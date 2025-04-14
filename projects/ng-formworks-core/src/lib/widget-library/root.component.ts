import { Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'root-widget',
  template: `
    <div #sortableContainter [nxtSortablejs]="layout()" [config]="sortableConfig" (init)="sortableInit($event)">
      <div *ngFor="let layoutItem of layout(); let i = index"
        [class.form-flex-item]="isFlexItem()"
        [style.align-self]="(layoutItem.options || {})['align-self']"
        [style.flex-basis]="getFlexAttribute(layoutItem, 'flex-basis')"
        [style.flex-grow]="getFlexAttribute(layoutItem, 'flex-grow')"
        [style.flex-shrink]="getFlexAttribute(layoutItem, 'flex-shrink')"
        [style.order]="(layoutItem.options || {}).order"
        [class.sortable-filter]="!isDraggable(layoutItem)"
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
  `],
  standalone: false
})
export class RootComponent implements OnInit, OnDestroy {


  private jsf = inject(JsonSchemaFormService);

export class RootComponent {
  options: any;
  @Input() dataIndex: number[];
  @Input() layoutIndex: number[];
  @Input() layout: any[];
  @Input() isOrderable: boolean;
  @Input() isFlexItem = false;

  constructor(
    private jsf: JsonSchemaFormService
  ) { }
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
      
    }
  }
  private sortableOptionsSubscription: Subscription;
  sortableInit(sortable) {
    this.sortableObj = sortable;
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
