import { Component, OnInit, input, signal } from '@angular/core';
import { JsonSchemaFormService } from '@ng-formworks/core';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tabs-widget',
  template: `
    <div
      [class]="options?.labelHtmlClass || ''">
      <a *ngFor="let item of layoutNode()?.items; let i = index"
        [class]="(options?.itemLabelHtmlClass || '') + (selectedItem === i ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + options?.style?.unselected))"
        >
        <span *ngIf="showAddTab || item.type !== '$ref'"
        [class]="(selectedItem === i ? (' ' + options?.activeClass + ' ' + options?.style?.selected) :
        (' ' + options?.style?.unselected))"
      [innerHTML]="setTabTitle(item, i)"
      (click)="select(i)"></span>
      </a>

    </div>

    <!--
    <div class="tabs tabs-boxed">
  <a class="tab">Tab 1</a> 
  <a class="tab tab-active">Tab 2</a> 
  <a class="tab">Tab 3</a>
</div>
-->

    <div *ngFor="let layoutItem of layoutNode()?.items; let i = index"
      [class]="options?.htmlClass || ''">

      <select-framework-widget *ngIf="selectedItem === i"
        [class]="(options?.fieldHtmlClass || '') +
          ' ' + (options?.activeClass || '') +
          ' ' + (options?.style?.selected || '')"
        [dataIndex]="layoutNode()?.dataType === 'array' ? (dataIndex() || []).concat(i) : dataIndex()"
        [layoutIndex]="(layoutIndex() || []).concat(i)"
        [layoutNode]="layoutItem"></select-framework-widget>

    </div>`,
  styles: [` a { cursor: pointer; } `],
})
export class DaisyUITabsComponent implements OnInit {
  options: any;
  itemCount: number;
  selectedItem = 0;
  showAddTab = true;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  constructor(
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.itemCount = this.layoutNode().items.length - 1;
    this.updateControl();
  }

  select(index) {
    const layoutNode = this.layoutNode();
    if (layoutNode.items[index].type === '$ref') {
      this.itemCount = layoutNode.items.length;
      this.jsf.addItem({
        layoutNode: signal(layoutNode.items[index]),
        layoutIndex: signal(this.layoutIndex().concat(index)),
        dataIndex: signal(this.dataIndex().concat(index))
      });
      this.updateControl();
    }
    this.selectedItem = index;
  }

  updateControl() {
    const lastItem = this.layoutNode().items[this.layoutNode().items.length - 1];
    if (lastItem.type === '$ref' &&
      this.itemCount >= (lastItem.options.maxItems || 1000)
    ) {
      this.showAddTab = false;
    }
  }

  setTabTitle(item: any, index: number): string {
    return this.jsf.setArrayItemTitle(this, item, index);
  }
}
