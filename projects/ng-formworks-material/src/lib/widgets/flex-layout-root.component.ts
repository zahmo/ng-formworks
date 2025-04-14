import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { JsonSchemaFormService } from '@ng-formworks/core';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'flex-layout-root-widget',
    template: `
    <div #sortableContainter [nxtSortablejs]="layout()" [config]="sortableConfig" (init)="sortableInit($event)">
      <div *ngFor="let layoutNode of layout(); let i = index"
        [class.form-flex-item]="isFlexItem()"
        [style.flex-grow]="getFlexAttribute(layoutNode, 'flex-grow')"
        [style.flex-shrink]="getFlexAttribute(layoutNode, 'flex-shrink')"
        [style.flex-basis]="getFlexAttribute(layoutNode, 'flex-basis')"
        [style.align-self]="(layoutNode?.options || {})['align-self']"
        [style.order]="layoutNode?.options?.order"
        [attr.fxFlex]="layoutNode?.options?.fxFlex"
        [attr.fxFlexOrder]="layoutNode?.options?.fxFlexOrder"
        [attr.fxFlexOffset]="layoutNode?.options?.fxFlexOffset"
        [attr.fxFlexAlign]="layoutNode?.options?.fxFlexAlign">
        <select-framework-widget *ngIf="showWidget(layoutNode)"
          [dataIndex]="layoutNode?.arrayItem ? (dataIndex() || []).concat(i) : (dataIndex() || [])"
          [layoutIndex]="(layoutIndex() || []).concat(i)"
          [layoutNode]="layoutNode"></select-framework-widget>
      <div>
    </div>`,
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false
})
export class FlexLayoutRootComponent {
  private jsf = inject(JsonSchemaFormService);

  readonly dataIndex = input<number[]>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly layout = input<any[]>(undefined);
  readonly isFlexItem = input(false);

  removeItem(item) {
    this.jsf.removeItem(item);
  }
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
  sortableInit(sortable) {
    this.sortableObj = sortable;
  }

  // Set attributes for flexbox child
  // (container attributes are set in flex-layout-section.component)
  getFlexAttribute(node: any, attribute: string) {
    const index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
    return ((node.options || {}).flex || '').split(/\s+/)[index] ||
      (node.options || {})[attribute] || ['1', '1', 'auto'][index];
  }

  showWidget(layoutNode: any): boolean {
    return this.jsf.evaluateCondition(layoutNode, this.dataIndex());
  }
}
