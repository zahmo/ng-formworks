import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { JsonSchemaFormService } from '@ng-formworks/core';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'flex-layout-root-widget',
    template: `
    <div cdkDropList (cdkDropListDropped)="drop($event)" 
    >
      <div *ngFor="let layoutNode of layout; let i = index" 
       cdkDrag  [cdkDragStartDelay]="{touch:1000,mouse:0}"
        [class.form-flex-item]="isFlexItem"
        [style.flex-grow]="getFlexAttribute(layoutNode, 'flex-grow')"
        [style.flex-shrink]="getFlexAttribute(layoutNode, 'flex-shrink')"
        [style.flex-basis]="getFlexAttribute(layoutNode, 'flex-basis')"
        [style.align-self]="(layoutNode?.options || {})['align-self']"
        [style.order]="layoutNode?.options?.order"
        [attr.fxFlex]="layoutNode?.options?.fxFlex"
        [attr.fxFlexOrder]="layoutNode?.options?.fxFlexOrder"
        [attr.fxFlexOffset]="layoutNode?.options?.fxFlexOffset"
        [attr.fxFlexAlign]="layoutNode?.options?.fxFlexAlign"

        >
        <!-- workaround to disbale dragging of input fields -->
        <div *ngIf="layoutNode?.dataType !='object'" cdkDragHandle>
         <p></p>
        </div>
        <select-framework-widget *ngIf="showWidget(layoutNode)"
       
          [dataIndex]="layoutNode?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
          [layoutIndex]="(layoutIndex || []).concat(i)"
          [layoutNode]="layoutNode"></select-framework-widget>
      <div>
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
`],
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false
})
export class FlexLayoutRootComponent {
  @Input() dataIndex: number[];
  @Input() layoutIndex: number[];
  @Input() layout: any[];
  @Input() isFlexItem = false;

  constructor(
    private jsf: JsonSchemaFormService
  ) { }

  removeItem(item) {
    this.jsf.removeItem(item);
  }
  sortableObj: any;
  sortableConfig:any={
    filter:".sortable-filter",//needed to disable dragging on input range elements, class needs to be added to the element or its parent
    preventOnFilter: false,//needed for input range elements slider do still work
    onEnd: (/**Event*/evt)=> {

      
    }
  }
  sortableInit(sortable) {
    this.sortableObj = sortable;
  }

  drop(event: CdkDragDrop<string[]>) {
    // most likely why this event is used is to get the dragging element's current index
    // same properties as onEnd
    //console.log(`sortablejs event:${evt}`);
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
    //must set moveLayout to false as nxtSortable already moves it
    this.jsf.moveArrayItem(itemCtx, srcInd, trgInd,true);
  }

  // Set attributes for flexbox child
  // (container attributes are set in flex-layout-section.component)
  getFlexAttribute(node: any, attribute: string) {
    const index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
    return ((node.options || {}).flex || '').split(/\s+/)[index] ||
      (node.options || {})[attribute] || ['1', '1', 'auto'][index];
  }

  showWidget(layoutNode: any): boolean {
    return this.jsf.evaluateCondition(layoutNode, this.dataIndex);
  }
}
