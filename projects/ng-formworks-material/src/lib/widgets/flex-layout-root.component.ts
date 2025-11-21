import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Input, SimpleChanges } from '@angular/core';
import { JsonSchemaFormService } from '@ng-formworks/core';
import { memoize } from 'lodash';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'flex-layout-root-widget',
    template: `
    <div cdkDropList (cdkDropListDropped)="drop($event)" 
    [class.flex-inherit]="true"
    [cdkDropListSortPredicate]="sortPredicate"
    >
      <!-- -for now left out
      cdkDragHandle directive, by itself, does not disable the 
      default drag behavior of its parent cdkDrag element. 
      You must explicitly disable dragging on the main element 
      and re-enable it only when using the handle.
      -->
      <div *ngFor="let layoutItem of layout; let i = index;" 
       cdkDrag  [cdkDragStartDelay]="{touch:1000,mouse:0}"
        [cdkDragDisabled]="!isDraggable(layoutItem)"
        [class.form-flex-item]="isFlexItem"
        [style.flex-grow]="getFlexAttribute(layoutItem, 'flex-grow')"
        [style.flex-shrink]="getFlexAttribute(layoutItem, 'flex-shrink')"
        [style.flex-basis]="getFlexAttribute(layoutItem, 'flex-basis')"
        [style.align-self]="(layoutItem?.options || {})['align-self']"
        [style.order]="layoutItem?.options?.order"
        [attr.fxFlex]="layoutItem?.options?.fxFlex"
        [attr.fxFlexOrder]="layoutItem?.options?.fxFlexOrder"
        [attr.fxFlexOffset]="layoutItem?.options?.fxFlexOffset"
        [attr.fxFlexAlign]="layoutItem?.options?.fxFlexAlign"

        >
        <!-- workaround to disbale dragging of input fields -->
        <!--
        <div *ngIf="layoutItem?.dataType !='object'" cdkDragHandle>
         <p></p>
        </div>
        -->
        <!--
        <select-framework-widget *ngIf="showWidget(layoutItem)"
          [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
          [layoutIndex]="(layoutIndex || []).concat(i)"
          [layoutNode]="layoutItem"></select-framework-widget>
        -->
        <select-framework-widget *ngIf="showWidget(layoutItem)"
            [dataIndex]="getSelectFrameworkInputs(layoutItem,i).dataIndex"
            [layoutIndex]="getSelectFrameworkInputs(layoutItem,i).layoutIndex"
            [layoutNode]="getSelectFrameworkInputs(layoutItem,i).layoutNode">
		  </select-framework-widget>
      </div>
    </div>`,
    styles:[`
    .example-list {
  width: 500px;
  max-width: 100%;
  border: solid 1px #ccc;
  min-height: 60px;
  display: block;
  background: white;
  border-radius: 4px;
  overflow: hidden;
}

.example-box {
  padding: 20px 10px;
  border-bottom: solid 1px #ccc;
  color: rgba(0, 0, 0, 0.87);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  cursor: move;
  background: white;
  font-size: 14px;
}

.cdk-drag-preview {
  border: none;
  box-sizing: border-box;
  border-radius: 4px;
  box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
              0 8px 10px 1px rgba(0, 0, 0, 0.14),
              0 3px 14px 2px rgba(0, 0, 0, 0.12);
}

.cdk-drag-placeholder {
  opacity: 0;
}

.cdk-drag-animating {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}

.example-box:last-child {
  border: none;
}

.example-list.cdk-drop-list-dragging .example-box:not(.cdk-drag-placeholder) {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}
.flex-inherit{
    display:inherit;
    flex-flow:inherit;
    flex-wrap:inherit;
    flex-direction:inherit;
    width:100%
}
    
`],
    //changeDetection: ChangeDetectionStrategy.Default,
    changeDetection:ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class FlexLayoutRootComponent {
  @Input() dataIndex: number[];
  @Input() layoutIndex: number[];
  @Input() layout: any[];
  @Input() isOrderable:boolean;
  @Input() isFlexItem = false;
  @Input() memoizationEnabled =true;
  constructor(
    private jsf: JsonSchemaFormService
  ) { }

  removeItem(item) {
    this.jsf.removeItem(item);
  }

  drop(event: CdkDragDrop<string[]>) {
    // most likely why this event is used is to get the dragging element's current index
    let srcInd=event.previousIndex;
    let trgInd=event.currentIndex;
    let layoutItem=this.layout[trgInd];
    let dataInd=layoutItem?.arrayItem ? (this.dataIndex || []).concat(trgInd) : (this.dataIndex || []);
    let layoutInd=(this.layoutIndex || []).concat(trgInd)
    let itemCtx:any={
      dataIndex:dataInd,
      layoutIndex: layoutInd,
      layoutNode: layoutItem
    }
    this.jsf.moveArrayItem(itemCtx, srcInd, trgInd,true);
  }

  isDraggable(node: any): boolean {
    let result=node.arrayItem && node.type !== '$ref' &&
    node.arrayItemType === 'list' && this.isOrderable !== false
    && node.type !=='submit'
    return result;
  }


    /**
   * Predicate function that disallows '$ref' item sorts
   * NB declared as a var instead of a function 
   * like sortPredicate(index: number, item: CdkDrag<number>){..}
   * since 'this' is bound to the draglist and doesn't reference the
   * FlexLayoutRootComponent instance
   */
    //TODO also need to think of other types such as button which can be
    //created by an arbitrary layout
    sortPredicate=(index: number, item: CdkDrag<number>)=> {
      let layoutItem=this.layout[index];
      let result=this.isDraggable(layoutItem);
      //layoutItem.type != '$ref';
      return result;
    }

  // Set attributes for flexbox child
  // (container attributes are set in flex-layout-section.component)
  getFlexAttribute(node: any, attribute: string) {
    const index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
    return ((node.options || {}).flex || '').split(/\s+/)[index] ||
      (node.options || {})[attribute] || ['1', '1', 'auto'][index];
  }

  private _getSelectFrameworkInputsRaw = (layoutItem: any, i: number) => {
    const dataIndexValue = this.dataIndex || [];
    const layoutIndexValue = this.layoutIndex || [];

    return {
      layoutNode: layoutItem,
      layoutIndex: [...layoutIndexValue, i],
      dataIndex: layoutItem?.arrayItem ? [...dataIndexValue, i] : dataIndexValue,
    };
  };

  // Define a separate function to hold the memoized version
  private _getSelectFrameworkInputsMemoized = memoize(
    this._getSelectFrameworkInputsRaw,
    (layoutItem: any, i: number) => {
      const layoutItemKey = layoutItem?.id ?? JSON.stringify(layoutItem);
      return `${layoutItemKey}-${i}`;
    }
  );

  // This is the public function that the template calls
  getSelectFrameworkInputs(layoutItem: any, i: number) {
    if (this.memoizationEnabled) {
      return this._getSelectFrameworkInputsMemoized(layoutItem, i);
    } else {
      return this._getSelectFrameworkInputsRaw(layoutItem, i);
    }
  }
  //TODO investigate-causing layout issue with layout,for now
  //removed from template
    trackByFn(index: number, item: any): any {
      return item._id ?? index;
    }

  showWidget(layoutNode: any): boolean {
    return this.jsf.evaluateCondition(layoutNode, this.dataIndex);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['layout'] || changes['dataIndex'] || changes['layoutIndex']) {
      // Clear the entire cache of the memoized function
      this._getSelectFrameworkInputsMemoized.cache.clear();
    }
  }
  ngOnDestroy(): void {
    //this.selectframeworkInputCache?.clear()
    //this.selectframeworkInputCache=null;
    this._getSelectFrameworkInputsMemoized.cache.clear();
    //this.dataChangesSubs?.unsubscribe();
}
}
