import { Component, OnInit, input } from '@angular/core';
import { JsonSchemaFormService } from '../../json-schema-form.service';
import { ContextControl } from './contextcontrol';
import { TabsTemplateOptions } from './tabs.template';


/**
 * the basic structure should look like 
 * <tabs-base-widget>  
 * the tabs base component provides reusable tab logic which can be used by any
 * framework, it manages the tab state and handles the events 
 * but the parent must use base.selectedItem,base.select and base.setTabTitle in its template
 * in addition the parent also need to provide either
 * the [context] input or  
 * layoutNode, layoutIndex and dataIndex inputs
 *    <ng-template #baseContainer>
 *       <tabs-template>
 *              the tabs template component provides a structure
 *              for html <ul><li>...</li></ul><div>..</div>
 *              based tab implementations (like bootstrap 3/4/5) 
 *              taking in an input tabsTemplate which allows flexibility
 *              with the css styling of the elements
 *          <ng-template #tabTitle> </ng-template>
 *          <ng-template #tabContent ></ng-template>
 *       </tabs-template>
 *    </ng-template>
 *  </tabs-base-widget>
 */

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tabs-default',
  template: `
        <tabs-base-widget [context]="this">
            <ng-template #baseContainer let-base>
                <tabs-template [tabsTemplate]="tabsTemplate"
                 [tabContentArray]="layoutNode().items" 
                 [selectedTab]="base.selectedItem" 
                 (onTabSelect)="base.select($event)">
                <ng-template #tabTitle let-layoutItem let-i="index">
                    {{base.setTabTitle(layoutItem, i)}}
                </ng-template>
                <ng-template #tabContent let-layoutItem let-i="index">
                  <ng-container *ngIf="options?.tabMode=='oneOfMode'">
                    <select-framework-widget *ngIf="base.selectedItem === i"
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
             <ng-template #baseContainer > 
         <tabs-base-widget>  
    `,
    styles: [` a { cursor: pointer; } 
      .ngf-hidden{display:none}
    `],
  standalone: false
})


export class TabsDefaultComponent extends ContextControl implements OnInit {
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
    getTabPaneClassSet:(index, selectedTab)  =>{
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
    getTabLinkClassSet:(index, selectedTab) => {
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

  options: any;
  layoutNode = input<any>(undefined);
  layoutIndex = input<number[]>(undefined);
  dataIndex = input<number[]>(undefined);
  
  constructor(protected jsf:JsonSchemaFormService) {
    super();
  }

  ngOnInit() {
    this.layoutNode=this.getContext().layoutNode;
    this.layoutIndex=this.getContext().layoutIndex;
    this.dataIndex=this.getContext().dataIndex;
    this.options = this.getContext().layoutNode().options || {};
    this.tabsTemplate=this.getContext().tabsTemplate || this.tabsTemplate;

  }



}
