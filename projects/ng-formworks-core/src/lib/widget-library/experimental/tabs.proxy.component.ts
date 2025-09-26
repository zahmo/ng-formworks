import { Component, ContentChild, OnInit, TemplateRef, input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
import { ContextControl } from './contextcontrol';
import { TabsTemplateOptions } from './tabs.template';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tabs-proxy',
  template: `
          <tabs-template [tabsTemplate]="tabsTemplate" [tabContentArray]="layoutNode().items" [selectedTab]="selectedItem" (onTabSelect)="select($event)">
          <ng-template #tabTitle let-layoutItem let-i="index">
              {{setTabTitle(layoutItem, i)}}
          </ng-template>
          <ng-template #tabContent let-layoutItem let-i="index">
            <ng-container *ngIf="options?.tabMode=='oneOfMode'">
              <select-framework-widget *ngIf="selectedItem === i"
                [class]="(options?.fieldHtmlClass || '') +
                  ' ' + (options?.activeClass || '') +
                  ' ' + (options?.style?.selected || '')"
                [dataIndex]="layoutNode()?.dataType === 'array' ? (dataIndex() || []).concat(i) : dataIndex()"
                [layoutIndex]="(layoutIndex() || []).concat(i)"
                [layoutNode]="layoutItem"></select-framework-widget>
            </ng-container> 
            <ng-container *ngIf="options?.tabMode !='oneOfMode'">
              <select-framework-widget 
                [class]="(options?.fieldHtmlClass || '') +
                  ' ' + (options?.activeClass || '') +
                  ' ' + (options?.style?.selected || '')"
                [dataIndex]="layoutNode()?.dataType === 'array' ? (dataIndex() || []).concat(i) : dataIndex()"
                [layoutIndex]="(layoutIndex() || []).concat(i)"
                [layoutNode]="layoutItem"></select-framework-widget>
            </ng-container> 
          </ng-template>
        </tabs-template>
    `,
    styles: [` a { cursor: pointer; } 
      .ngf-hidden{display:none}
    `],
  standalone: false
})


export class TabsProxyComponent extends ContextControl implements OnInit {
  readonly context = input<any>(null);
  getContext() {
    return this.context() || this;
  }
  tabsTemplate: TabsTemplateOptions = {
    getUlClassSet: (selectedTab) => {
      return this.applyMethod(this.getContext().tabsTemplate,"getUlClassSet",selectedTab);
    },
    getLiClassSet: (index, selectedTab) => {
      return this.applyMethod(this.getContext().tabsTemplate,"getLiClassSet",index,selectedTab);
    },
    getTabPaneClassSet:(index, selectedTab)  =>{
      return this.applyMethod(this.getContext().tabsTemplate,"getTabPaneClassSet",index,selectedTab);
    },
    getTabLinkClassSet:(index, selectedTab) => {
      return this.applyMethod(this.getContext().tabsTemplate,"getTabLinkClassSet",index,selectedTab);
    },
    getTabContentClassSet: (selectedTab) => {
      return this.applyMethod(this.getContext().tabsTemplate,"getTabContentClassSet",selectedTab);
    }
  }

  @ContentChild('tabContext', { static: true }) contextTemplate!: TemplateRef<any>;

  constructor(protected jsf:JsonSchemaFormService) {
    super();
  }

  options: any;
  itemCount: number;
  selectedItem = 0;
  showAddTab = true;
   layoutNode = input<any>(undefined);
  layoutIndex = input<number[]>(undefined);
  dataIndex = input<number[]>(undefined);
  layoutNodeItems: any[];

  ngOnInit() {
    this.layoutNode=this.getContext().layoutNode;
    this.layoutIndex=this.getContext().layoutIndex;
    this.dataIndex=this.getContext().dataIndex;
    let layoutNode=this.getContext().layoutNode();
    this.options = layoutNode.options || {};
    if (this.options.selectedTab) {
      this.selectedItem = this.options.selectedTab;
    }
    this.itemCount = layoutNode.items.length - 1;
    this.layoutNodeItems = layoutNode.items;
    this.updateControl();
  }

  select(index) {
    this.applyMethod(this.getContext(),"select",index)
  }

  updateControl() {
    this.applyMethod(this.getContext(),"updateControl")
  }

  setTabTitle(item: any, index: number): string {
    return this.applyMethod(this.getContext(),"setTabTitle",item,index)
  }
}
