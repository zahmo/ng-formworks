import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { memoize } from 'lodash';
import { Subscription } from 'rxjs';
import { JsonSchemaFormService } from '../json-schema-form.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'root-widget',
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
      <div *ngFor="let layoutItem of layout; let i = index;trackBy: trackByFn"
         cdkDrag  [cdkDragStartDelay]="{touch:1000,mouse:0}"
        [cdkDragDisabled]="layoutItem?.type=='submit' || layoutItem?.type=='$ref'"
        [class.form-flex-item]="isFlexItem()"
        [style.align-self]="(layoutItem.options || {})['align-self']"
        [style.flex-basis]="getFlexAttribute(layoutItem, 'flex-basis')"
        [style.flex-grow]="getFlexAttribute(layoutItem, 'flex-grow')"
        [style.flex-shrink]="getFlexAttribute(layoutItem, 'flex-shrink')"
        [style.order]="(layoutItem.options || {}).order"
        >

        <!-- workaround to disbale dragging of input fields -->
        <!--
        <div *ngIf="layoutItem?.dataType !='object'"  cdkDragHandle>
         <p>Drag Handle {{layoutItem?.dataType}}</p>
        </div>
        -->
        <!--NB orderable directive is not used but has been left in for now and set to false
          otherwise the compiler won't recognize dataIndex and other dependent attributes
        -->
        <!--
        <div 
          [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
          [layoutIndex]="(layoutIndex || []).concat(i)"
          [layoutNode]="layoutItem"
          [orderable]="false"
          >
          <select-framework-widget *ngIf="showWidget(layoutItem)"
            [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
            [layoutIndex]="(layoutIndex || []).concat(i)"
            [layoutNode]="layoutItem"></select-framework-widget>
        </div>
        -->
      <select-framework-widget *ngIf="showWidget(layoutItem)"
            [dataIndex]="getSelectFrameworkInputs(layoutItem,i).dataIndex"
            [layoutIndex]="getSelectFrameworkInputs(layoutItem,i).layoutIndex"
            [layoutNode]="getSelectFrameworkInputs(layoutItem,i).layoutNode">
		  </select-framework-widget>
      </div>
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
  changeDetection:ChangeDetectionStrategy.OnPush,
  standalone: false
})


export class RootComponent implements OnInit, OnDestroy,OnChanges{
  options: any;
  @Input() dataIndex: number[];
  @Input() layoutIndex: number[];
  @Input() layout: any[];
  @Input() isOrderable: boolean;
  @Input() isFlexItem = false;
  @Input() memoizationEnabled= true;

  dataChangesSubs:Subscription;
  constructor(
    private jsf: JsonSchemaFormService
  ) { }


  drop(event: CdkDragDrop<string[]>) {
    // most likely why this event is used is to get the dragging element's current index
    let srcInd=event.previousIndex;
    let trgInd=event.currentIndex;
    let layoutItem=this.layout[trgInd];
    let dataInd=layoutItem?.arrayItem ? (this.dataIndex || []).concat(trgInd) : (this.dataIndex || []);
    let layoutInd=(this.layoutIndex || []).concat(trgInd)
    let itemCtx:any={
      dataIndex:()=>{return dataInd},
      layoutIndex:()=>{return layoutInd},
      layoutNode:()=>{return layoutItem},
    }
    //must set moveLayout to false as nxtSortable already moves it
    this.jsf.moveArrayItem(itemCtx, srcInd, trgInd,true);
  }

  isDraggable(node: any): boolean {
    let result=node.arrayItem && node.type !== '$ref' &&
    node.arrayItemType === 'list' && this.isOrderable !== false;
    return result;
  }

  //TODO also need to think of other types such as button which can be
  //created by an arbitrary layout
  isFixed(node: any): boolean {
    let result=node.type == '$ref';
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
    //might not be needed added condition to [cdkDragDisabled]
    sortPredicate=(index: number, item: CdkDrag<number>)=> {
      let layoutItem=this.layout[index];
      let result=layoutItem.type != '$ref';
      return result;
    }

  // Set attributes for flexbox child
  // (container attributes are set in section.component)
  getFlexAttribute(node: any, attribute: string) {
    const index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
    return ((node.options || {}).flex || '').split(/\s+/)[index] ||
      (node.options || {})[attribute] || ['1', '1', 'auto'][index];
  }

  //private selectframeworkInputCache = new Map<string, { dataIndex: any[], layoutIndex: any[], layoutNode: any }>();

  //TODO review caching-if form field values change, the changes are not propagated

  /*
  getSelectFrameworkInputs(layoutItem: any, i: number) {
    // Create a unique key based on the layoutItem and index
    const cacheKey = `${layoutItem._id}-${i}`;
  
    // If the result is already in the cache, return it
    if(this.enableCaching){
      if (this.selectframeworkInputCache.has(cacheKey)) {
        return this.selectframeworkInputCache.get(cacheKey);
      }
    }


    // If not cached, calculate the values (assuming dataIndex() and layoutIndex() are functions)
    const dataIndex = layoutItem?.arrayItem ? (this.dataIndex() || []).concat(i) : (this.dataIndex() || []);
    const layoutIndex = (this.layoutIndex() || []).concat(i);

    // Save the result in the cache
    const result = { dataIndex, layoutIndex, layoutNode: layoutItem };
    if(this.enableCaching){
      this.selectframeworkInputCache.set(cacheKey, result);
    }

    return result;
  }
    */

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
  trackByFn(index: number, item: any): any {
    return item._id ?? index;
  }

  

  /*
  ngOnChanges(changes: SimpleChanges): void {
    // If any of the input properties change, clear the cache
    if (changes.dataIndex || changes.layoutIndex || changes.layout) {
      this.selectframeworkInputCache?.clear(); // Clear the entire cache
    }
  }
  */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['layout'] || changes['dataIndex'] || changes['layoutIndex']) {
      // Clear the entire cache of the memoized function
      this._getSelectFrameworkInputsMemoized.cache.clear();
    }
  }


  showWidget(layoutNode: any): boolean {
    return this.jsf.evaluateCondition(layoutNode, this.dataIndex);
  }
  ngOnInit(): void {
      if(this.memoizationEnabled){
        this.jsf.dataChanges.subscribe((val)=>{
          //this.selectframeworkInputCache?.clear();
          this._getSelectFrameworkInputsMemoized.cache.clear();
        })
      }

  }
  ngOnDestroy(): void {
      //this.selectframeworkInputCache?.clear()
      //this.selectframeworkInputCache=null;
      this._getSelectFrameworkInputsMemoized.cache.clear();
      this.dataChangesSubs?.unsubscribe();
  }
  

}
