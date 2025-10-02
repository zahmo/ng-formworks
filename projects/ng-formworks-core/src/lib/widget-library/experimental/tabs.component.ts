import { Component, OnInit, inject, input, signal } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
import { ContextControl } from './contextcontrol';
import { TabsTemplateOptions } from './tabs.template';



@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tabs-widget',
  template: `
  <!--<tabs-proxy [context]="this"></tabs-proxy>-->
  <tabs-default [context]="this"></tabs-default>

  `,
  standalone: false
})
export class TabsComponent extends ContextControl implements OnInit {
  readonly context = input<any>(null);
  getContext() {
    return this.context() || this;
  }
  tabsTemplate: TabsTemplateOptions = {
    getUlClassSet: (selectedTab) => {
      let ulClass=this.options.labelHtmlClass;
      //return { ["nav nav-tabs"]: true }
      return ulClass&&{[ulClass]:true}
    },
    getLiClassSet: (index, selectedTab) => {
      let liClass=this.options.itemLabelHtmlClass;
      //return {"nav-item": true}
      return liClass&&{[liClass]:true}
    },
    getTabPaneClassSet(index, selectedTab) {
      let tpClass=this.options.fieldHtmlClass;
      let activeClass=this.options.activeClass;
      //return {
      //  "tab-pane fade": true,
      //  "show active": selectedTab === index
      //}
      return {
          [tpClass]:true,
          [activeClass]:selectedTab === index
      }
    },
    getTabLinkClassSet(index, selectedTab) {
      let tlClass=this.options.widget_tabLinkClass;
      let activeClass=this.options.activeClass;

      return {
        ...(tlClass !== undefined && { [tlClass]: true }),
        [activeClass]: selectedTab === index
      }
      //return {
      //  "nav-link": true,
      //  "active": selectedTab === index
      //}
    },
    getTabContentClassSet: (selectedTab) => {
      let tcClass=this.options.htmlClass;
      //return { "tab-content mt-3": true }
      return tcClass &&{[tcClass]:true}
    }
  }

  private jsf = inject(JsonSchemaFormService);

  constructor() {
    super();
  }

  options: any;
  itemCount: number;
  selectedItem = 0;
  showAddTab = true;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);
  layoutNodeItems: any[];

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    if (this.options.selectedTab) {
      this.selectedItem = this.options.selectedTab;
    }
    this.itemCount = this.layoutNode().items.length - 1;
    this.layoutNodeItems = this.layoutNode().items;
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
      //this.layoutNodeItems=[...this.layoutNode().items];
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
    //this.cdr.markForCheck();
  }

  setTabTitle(item: any, index: number): string {
    return this.jsf.setArrayItemTitle(this, item, index);
  }
}
