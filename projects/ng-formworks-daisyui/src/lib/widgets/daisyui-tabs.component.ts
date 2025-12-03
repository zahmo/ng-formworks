import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { JsonSchemaFormService } from '@ng-formworks/core';
import { Subscription } from 'rxjs';



@Component({
    // tslint:disable-next-line:component-selector
    selector: 'daisyui-tabs-widget',
    template: `
    <div
      [class]="options?.labelHtmlClass || ''">
      @for (item of layoutNode()?.items; track item; let i = $index) {
        <a
        [class]="(options?.itemLabelHtmlClass || '') + (selectedItem === i ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + options?.style?.unselected))"
          (click)="select(i)"
          >
          @if (options?.tabMode=='oneOfMode') {
            <input type="radio" [value]="i"
              name="tabSelection"
              [(ngModel)]="selectedItem"
              [class]="(options?.widget_radioClass || '')"
              [value]="i"
              (change)="select(i)"
              />
          }
          @if (showAddTab || item.type !== '$ref') {
            <span
        [class]="(selectedItem === i ? (' ' + options?.activeClass + ' ' + options?.style?.selected) :
        (' ' + options?.style?.unselected))">{{setTabTitle(item, i)}}</span>
          }
        </a>
      }
    
    </div>
    
    <!--
    <div class="tabs tabs-boxed">
      <a class="tab">Tab 1</a>
      <a class="tab tab-active">Tab 2</a>
      <a class="tab">Tab 3</a>
    </div>
    -->
    
    @for (layoutItem of layoutNode()?.items; track layoutItem; let i = $index) {
      <div
        [class]="(options?.htmlClass || '') + (selectedItem != i?' ngf-hidden':'')">
        @if (options?.tabMode=='oneOfMode') {
          @if (selectedItem === i) {
            <select-framework-widget
          [class]="(options?.fieldHtmlClass || '') +
            ' ' + (options?.activeClass || '') +
            ' ' + (options?.style?.selected || '')"
              [dataIndex]="layoutNode()?.dataType === 'array' ? (dataIndex() || []).concat(i) : dataIndex()"
              [layoutIndex]="(layoutIndex() || []).concat(i)"
            [layoutNode]="layoutItem"></select-framework-widget>
          }
        }
        @if (options?.tabMode != 'oneOfMode') {
          <select-framework-widget
          [class]="(options?.fieldHtmlClass || '') +
            ' ' + (options?.activeClass || '') +
            ' ' + (options?.style?.selected || '')"
            [dataIndex]="layoutNode()?.dataType === 'array' ? (dataIndex() || []).concat(i) : dataIndex()"
            [layoutIndex]="(layoutIndex() || []).concat(i)"
          [layoutNode]="layoutItem"></select-framework-widget>
        }
      </div>
    }`,
    styles: [` a { cursor: pointer; }
      .ngf-hidden{display:none}
       `],
    standalone: false
})
export class DaisyUITabsComponent implements OnInit,OnDestroy {
  private jsf = inject(JsonSchemaFormService);
  private cdr = inject(ChangeDetectorRef);
  options: any;
  itemCount: number;
  selectedItem = 0;
  showAddTab = true;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);
  dataChangesSubs:Subscription;
  ngOnInit() {
    this.options = this.layoutNode().options || {};
    if(this.options.selectedTab){
      this.selectedItem = this.options.selectedTab;
    }
    this.itemCount = this.layoutNode().items.length - 1;
    this.updateControl();
    //TODO review/test-introduced to fix dynamic titles not updating
    //when their conditional linked field is destroyed
    //-forces change detection!
    //-commented out, causing other issues
    this.jsf.dataChanges.subscribe((val)=>{
      //this.cdr.detectChanges();
  })
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

  ngOnDestroy(): void {
    this.dataChangesSubs?.unsubscribe();
  }
}
