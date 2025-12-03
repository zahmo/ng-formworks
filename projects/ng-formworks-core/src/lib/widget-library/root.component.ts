import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { JsonSchemaFormService } from '../json-schema-form.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'root-widget',
  template: `
    <div cdkDropList (cdkDropListDropped)="drop($event)"
      [class.flex-inherit]="true"
      [cdkDropListSortPredicate]="sortPredicate"
      >
      @for (layoutItem of layout(); track layoutItem; let i = $index) {
        <div
          cdkDrag  [cdkDragStartDelay]="{touch:1000,mouse:0}"
          [cdkDragDisabled]="!isDraggable(layoutItem)"
          [class.form-flex-item]="isFlexItem()"
          [style.align-self]="(layoutItem.options || {})['align-self']"
          [style.flex-basis]="getFlexAttribute(layoutItem, 'flex-basis')"
          [style.flex-grow]="getFlexAttribute(layoutItem, 'flex-grow')"
          [style.flex-shrink]="getFlexAttribute(layoutItem, 'flex-shrink')"
          [style.order]="(layoutItem.options || {}).order"
          >
          @if (showWidget(layoutItem)) {
            <select-framework-widget
              [dataIndex]="getSelectFrameworkInputs(layoutItem,i).dataIndex"
              [layoutIndex]="getSelectFrameworkInputs(layoutItem,i).layoutIndex"
              [layoutNode]="getSelectFrameworkInputs(layoutItem,i).layoutNode">
            </select-framework-widget>
          }
        </div>
      }
    </div>
    `,
  styles: [`
    [draggable=true] {
      transition: all 150ms cubic-bezier(.4, 0, .2, 1);
    }
    [draggable=true]:hover {
      cursor: move;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      position: relative; z-index: 10;
      margin-top: -1px;
      margin-left: -1px;
      margin-right: 1px;
      margin-bottom: 1px;
    }
    [draggable=true].drag-target-top {
      box-shadow: 0 -2px 0 #000;
      position: relative; z-index: 20;
    }
    [draggable=true].drag-target-bottom {
      box-shadow: 0 2px 0 #000;
      position: relative; z-index: 20;
    }
    .flex-inherit{
      display:inherit;
      flex-flow:inherit;
      flex-wrap:inherit;
      flex-direction:inherit;
      width:100%
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class RootComponent implements OnInit, OnDestroy, OnChanges {

  private jsf = inject(JsonSchemaFormService);
  private cdr = inject(ChangeDetectorRef);

  options: any;
  readonly dataIndex = input<number[]>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly layout = input<any[]>(undefined);
  readonly isOrderable = input<boolean>(undefined);
  readonly isFlexItem = input(false);
  readonly memoizationEnabled = input<boolean>(true);

  // Unified destroy notifier for Rx subscriptions
  private destroy$ = new Subject<void>();

  // WeakMap caches keyed by layout node object to allow GC when nodes are removed
  private selectInputsCache = new WeakMap<object, Map<number, { dataIndex: any[], layoutIndex: any[], layoutNode: any }>>();
  private showWidgetCache = new WeakMap<object, Map<string, boolean>>();

  ngOnInit(): void {
    if (this.memoizationEnabled) {
      // Debounce dataChanges so rapid model updates don't thrash caches
      this.jsf.dataChanges.pipe(
        debounceTime(30),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        // Clear caches on model change; WeakMap allows entries to be GC'd when layout nodes die
        this.clearAllCaches();
        // Ensure OnPush components are checked for visibility/title updates
        this.cdr.markForCheck();
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['layout'] || changes['dataIndex'] || changes['layoutIndex']) {
      // Input context changed — cached computed inputs and visibility may be stale
      this.clearAllCaches();
      this.cdr.markForCheck();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearAllCaches();
  }

  /**
   * Get select-framework inputs for a layout node/index. Memoizes per-node and per-index.
   * Uses a WeakMap keyed by layoutItem object to avoid JSON.stringify and circular-to-string issues.
   */
  getSelectFrameworkInputs(layoutItem: any, i: number) {
    // Fast path when memoization disabled
    if (!this.memoizationEnabled || !layoutItem) {
      return this.computeSelectFrameworkInputs(layoutItem, i);
    }

    let perNode = this.selectInputsCache.get(layoutItem);
    if (!perNode) {
      perNode = new Map();
      this.selectInputsCache.set(layoutItem, perNode);
    }

    const cached = perNode.get(i);
    if (cached) {
      return cached;
    }

    const computed = this.computeSelectFrameworkInputs(layoutItem, i);
    perNode.set(i, computed);
    return computed;
  }

  private computeSelectFrameworkInputs(layoutItem: any, i: number) {
    const dataIndexValue = this.dataIndex() || [];
    const layoutIndexValue = this.layoutIndex() || [];

    return {
      layoutNode: layoutItem,
      layoutIndex: [...layoutIndexValue, i],
      dataIndex: layoutItem?.arrayItem ? [...dataIndexValue, i] : dataIndexValue,
    };
  }

  /**
   * showWidget: caches visibility decisions per layout node and per dataIndexKey (stringified index array).
   * Uses WeakMap for memory-safety. Cache invalidated on model/layout changes.
   */
  showWidget(layoutNode: any): boolean {
    if (!layoutNode) {
      return false;
    }
    if (!this.memoizationEnabled) {
      return this.jsf.evaluateCondition(layoutNode, this.dataIndex());
    }

    let perNode = this.showWidgetCache.get(layoutNode);
    if (!perNode) {
      perNode = new Map();
      this.showWidgetCache.set(layoutNode, perNode);
    }

    const dataIndexKey = (this.dataIndex() || []).join(',');
    const cached = perNode.get(dataIndexKey);
    if (typeof cached === 'boolean') {
      return cached;
    }

    const visible = this.jsf.evaluateCondition(layoutNode, this.dataIndex());
    perNode.set(dataIndexKey, visible);
    return visible;
  }

  // Clear both caches (WeakMaps will drop entries automatically when keys are GC'd)
  private clearAllCaches() {
    this.selectInputsCache = new WeakMap();
    this.showWidgetCache = new WeakMap();
  }

  // Better trackBy helps Angular avoid re-rendering node DOM when only non-visual changes happen
  trackByFn(index: number, item: any): any {
    // Prefer stable explicit id, otherwise fallback to object identity
    return item?._id ?? item;
  }

  drop(event: CdkDragDrop<string[]>) {
    const srcInd = event.previousIndex;
    const trgInd = event.currentIndex;
    const layoutItem = this.layout()[trgInd];
    const dataInd = layoutItem?.arrayItem ? (this.dataIndex() || []).concat(trgInd) : (this.dataIndex() || []);
    const layoutInd = (this.layoutIndex() || []).concat(trgInd);
    const itemCtx: any = {
      dataIndex: () => { return dataInd; },
      layoutIndex: () => { return layoutInd; },
      layoutNode: () => { return layoutItem; },
    };
    this.jsf.moveArrayItem(itemCtx, srcInd, trgInd, true);
  }

  isDraggable(node: any): boolean {
    return !!(node && node.arrayItem && node.type !== '$ref' &&
      node.arrayItemType === 'list' && this.isOrderable() !== false && node.type !== 'submit');
  }

  isFixed(node: any): boolean {
    return node?.type === '$ref';
  }

  sortPredicate = (index: number, item: CdkDrag<number>) => {
    const layoutItem = this.layout()[index];
    return this.isDraggable(layoutItem);
  }

  getFlexAttribute(node: any, attribute: string) {
    const index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
    return ((node.options || {}).flex || '').split(/\s+/)[index] ||
      (node.options || {})[attribute] || ['1', '1', 'auto'][index];
  }

