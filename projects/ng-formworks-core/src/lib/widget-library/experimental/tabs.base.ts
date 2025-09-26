import { Component, ContentChild, EventEmitter, OnInit, Output, TemplateRef, inject, input, signal } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tabs-base-widget',
    template: `
        <ng-container *ngTemplateOutlet="baseContainer; context: { $implicit: this }"></ng-container>`,
    styles: [],
    standalone: false
})
export class TabsBaseComponent implements OnInit {
  @ContentChild('baseContainer', { static: true }) baseContainer!: TemplateRef<any>;
  readonly context = input<any>(null);
  getContext() {
    return this.context() || this;
  }
  private jsf = inject(JsonSchemaFormService);

  options: any;
  itemCount: number;
  selectedItem = 0;
  showAddTab = true;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  @Output() onSelectEvent = new EventEmitter<number>();

  ngOnInit() {
    let layoutNode=this.getContext().layoutNode();
    this.options = layoutNode.options || {};
    if(this.options.selectedTab){
      this.selectedItem = this.options.selectedTab;
    }
    this.itemCount = layoutNode.items.length - 1;
    this.updateControl();
  }

  select(index:number) {
    const layoutNode = this.getContext().layoutNode();
    if (layoutNode.items[index].type === '$ref') {
      this.itemCount = layoutNode.items.length;
      this.jsf.addItem({
        layoutNode: signal(layoutNode.items[index]),
        layoutIndex: signal(this.getContext().layoutIndex().concat(index)),
        dataIndex: signal(this.getContext().dataIndex().concat(index))
      });
      this.updateControl();
    }
    this.selectedItem = index;
    this.onSelectEvent.emit(index);
  }

  updateControl() {
    const layoutNode = this.getContext().layoutNode();
    const lastItem = layoutNode.items[layoutNode.items.length - 1];
    if (lastItem.type === '$ref' &&
      this.itemCount >= (lastItem.options.maxItems || 1000)
    ) {
      this.showAddTab = false;
    }
  }

  setTabTitle(item: any, index: number): string {
    return this.jsf.setArrayItemTitle(this.getContext(), item, index);
  }
}
