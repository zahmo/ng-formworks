import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { JsonSchemaFormService } from '../json-schema-form.service';
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'root-widget',
  template: `
    <div [class.flex-inherit]="true" #sortableContainter [nxtSortablejs]="layout()" [config]="sortableConfig" (init)="sortableInit($event)">
      <div *ngFor="let layoutItem of layout(); let i = index"
        [class.form-flex-item]="isFlexItem()"
        [style.align-self]="(layoutItem.options || {})['align-self']"
        [style.flex-basis]="getFlexAttribute(layoutItem, 'flex-basis')"
        [style.flex-grow]="getFlexAttribute(layoutItem, 'flex-grow')"
        [style.flex-shrink]="getFlexAttribute(layoutItem, 'flex-shrink')"
        [style.order]="(layoutItem.options || {}).order"
        [class.sortable-filter]="!isDraggable(layoutItem)"
        [class.sortable-fixed]="isFixed(layoutItem)"
        >
        <!--NB orderable directive is not used but has been left in for now and set to false
          otherwise the compiler won't recognize dataIndex and other dependent attributes
        -->
        <div 
          [dataIndex]="layoutItem?.arrayItem ? (dataIndex() || []).concat(i) : (dataIndex() || [])"
          [layoutIndex]="(layoutIndex() || []).concat(i)"
          [layoutNode]="layoutItem"
          [orderable]="false"
          [class.sortable-filter]="!isDraggable(layoutItem)"
          [class.sortable-fixed]="isFixed(layoutItem)"
          >
          <select-framework-widget *ngIf="showWidget(layoutItem)"
            [dataIndex]="layoutItem?.arrayItem ? (dataIndex() || []).concat(i) : (dataIndex() || [])"
            [layoutIndex]="(layoutIndex() || []).concat(i)"
            [layoutNode]="layoutItem"></select-framework-widget>
        </div>
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
  standalone: false
})
export class RootComponent implements OnInit, OnDestroy {


  private jsf = inject(JsonSchemaFormService);

  options: any;
  readonly dataIndex = input<number[]>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly layout = input<any[]>(undefined);
  readonly isOrderable = input<boolean>(undefined);
  readonly isFlexItem = input(false);

  // @ViewChild('sortableContainter', {})
  // sortableContainterElt: ElementRef;

  sortableObj: any;
  sortableConfig:any={
    filter:".sortable-filter",//needed to disable dragging on input range elements, class needs to be added to the element or its parent
    preventOnFilter: false,//needed for input range elements slider do still work
    delay: 1000,
    delayOnTouchOnly: true,
    onEnd: (/**Event*/evt)=> {
      evt.newIndex // most likely why this event is used is to get the dragging element's current index
      // same properties as onEnd
      //console.log(`sortablejs event:${evt}`);
      let srcInd=evt.oldIndex;
      let trgInd=evt.newIndex;
      let layoutItem=this.layout()[trgInd];
      let dataInd=layoutItem?.arrayItem ? (this.dataIndex() || []).concat(trgInd) : (this.dataIndex() || []);
      let layoutInd=(this.layoutIndex() || []).concat(trgInd)
      let itemCtx:any={
        dataIndex:()=>{return dataInd},
        layoutIndex:()=>{return layoutInd},
        layoutNode:()=>{return layoutItem},
      }
      //must set moveLayout to false as nxtSortable already moves it
      this.jsf.moveArrayItem(itemCtx, evt.oldIndex, evt.newIndex,false);
      
    },
    onMove: function (/**Event*/evt, /**Event*/originalEvent) {
      if(evt.related.classList.contains("sortable-fixed")){
       //console.log(evt.related);
       return false;
     }
     return undefined;
   }
  }
  private sortableOptionsSubscription: Subscription;
  sortableInit(sortable) {
    this.sortableObj = sortable;
    //Sortable.utils.on(this.sortableObj.el,"nulling",(s)=>{console.log("event nulling sortablejs")})
    ///NB issue caused by sortablejs when it its destroyed
    //this mainly affects checkboxes coupled with conditions
    //-the value is rechecked
    //-see https://github.com/SortableJS/Sortable/issues/1052#issuecomment-369613072
    /* attempt to monkey patch sortable js 
    const originalMethod = sortable._nulling;
    let zone=this.zone;
    sortable._nulling=function() {
      console.log(`pluginEvent 2 ${pluginEvent}`)
            zone.runOutsideAngular(() => {
              console.log(`pluginEvent3 ${pluginEvent}`)
      pluginEvent('nulling', this);
  
      rootEl =
      dragEl =
      parentEl =
      ghostEl =
      nextEl =
      cloneEl =
      lastDownEl =
      cloneHidden =
  
      tapEvt =
      touchEvt =
  
      moved =
      newIndex =
      newDraggableIndex =
      oldIndex =
      oldDraggableIndex =
  
      lastTarget =
      lastDirection =
  
      putSortable =
      activeGroup =
      Sortable.dragged =
      Sortable.ghost =
      Sortable.clone =
      Sortable.active = null;
  
    
        let el = this.el;
        savedInputChecked.forEach(function (checkEl) {
          if (el.contains(checkEl)) {
            checkEl.checked = true;
          }
        });
    
        savedInputChecked.length =
        lastDx =
        lastDy = 0;

      })

    }.bind(sortable)
    */
  }

  isDraggable(node: any): boolean {
    let result=node.arrayItem && node.type !== '$ref' &&
    node.arrayItemType === 'list' && this.isOrderable() !== false;
    if (this.sortableObj) {
      //this.sortableObj.option("disabled",true);
      //this.sortableObj.option("sort",false);
      //this.sortableObj.option("disabled",!result);
    }

    return result;
  }

  //TODO also need to think of other types such as button which can be
  //created by an arbitrary layout
  isFixed(node: any): boolean {
    let result=node.type == '$ref';
    return result;
  }

  // Set attributes for flexbox child
  // (container attributes are set in section.component)
  getFlexAttribute(node: any, attribute: string) {
    const index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
    return ((node.options || {}).flex || '').split(/\s+/)[index] ||
      (node.options || {})[attribute] || ['1', '1', 'auto'][index];
  }

  showWidget(layoutNode: any): boolean {
    return this.jsf.evaluateCondition(layoutNode, this.dataIndex());
  }
  ngOnInit(): void {
    // Subscribe to the draggable state
    this.sortableOptionsSubscription = this.jsf.sortableOptions$.subscribe(
      (optsValue) => {
        if (this.sortableObj) {
          Object.keys(optsValue).forEach(opt=>{
            let optVal=optsValue[opt];
            this.sortableObj.option(opt,optVal);
          })
          //this.sortableObj.option("disabled",true);
          //this.sortableObj.option("sort",false);
        }
      }
    );
  }
  ngOnDestroy(): void {
    if (this.sortableOptionsSubscription) {
      this.sortableOptionsSubscription.unsubscribe();
    }
  }
}
