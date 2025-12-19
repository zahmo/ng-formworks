import { Component, OnChanges, OnInit, SimpleChanges, inject, input, signal } from '@angular/core';
import { JsonSchemaFormService } from '@ng-formworks/core';
import { memoize } from 'lodash';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'material-tabs-widget',
    template: `
    <nav mat-tab-nav-bar [tabPanel]="tabPanel"
      [attr.aria-label]="options?.label || layoutNode().options?.title || ''"
      [style.width]="'100%'">
    
      @for (item of layoutNode()?.items; track item; let i = $index) {
        <a mat-tab-link
          [active]="selectedItem === i"
          (click)="select(i)">
          <!--
          <input
            type="radio"
            name="tabSelection"
            [(ngModel)]="selectedItem"
            [value]="i"
            (change)="select(i)" class="mat-mdc-radio-button" />
            {{ setTabTitle(item, i) }}
            -->
            @if (options?.tabMode=='oneOfMode') {
              <mat-radio-button
                [checked]="selectedItem === i"
                [value]="i"
                >
              </mat-radio-button>
            }
            @if (showAddTab || item.type !== '$ref') {
              <span
              [innerHTML]="setTabTitle(item, i)"></span>
            }
          </a>
        }
    
    
      </nav>
      <mat-tab-nav-panel #tabPanel>
        @for (layoutItem of layoutNode()?.items; track layoutItem; let i = $index) {
          <div
            [class]="(options?.htmlClass || '') + (selectedItem != i?' ngf-hidden':'')">
            <!--for now the only difference between oneOfMode and the default
            is that oneOfMode uses the *ngIf="selectedItem === i" clause, which automatically
            destroys the tabs that are not rendered while default mode only hide them
            the upshot is that only the active tabs value will be used
            -->
            @if (options?.tabMode=='oneOfMode') {
              @if (selectedItem === i) {
                <select-framework-widget
                  [class]="(options?.fieldHtmlClass || '') + ' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')"
                  [dataIndex]="layoutNode()?.dataType === 'array' ? (dataIndex() || []).concat(i) : dataIndex()"
                  [layoutIndex]="(layoutIndex() || []).concat(i)"
                [layoutNode]="layoutItem"></select-framework-widget>
              }
            }
            @if (options?.tabMode !='oneOfMode') {
            <!--
              <select-framework-widget
                [class]="(options?.fieldHtmlClass || '') + ' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')"
                [dataIndex]="layoutNode()?.dataType === 'array' ? (dataIndex() || []).concat(i) : dataIndex()"
                [layoutIndex]="(layoutIndex() || []).concat(i)"
              [layoutNode]="layoutItem"></select-framework-widget>
            -->
             
            <select-framework-widget
               [class]="(options?.fieldHtmlClass || '') + ' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')"
              [dataIndex]="getSelectFrameworkInputs(layoutItem,i).dataIndex"
              [layoutIndex]="getSelectFrameworkInputs(layoutItem,i).layoutIndex"
              [layoutNode]="layoutItem">
            </select-framework-widget> 
             
            }
          </div>
        }
      </mat-tab-nav-panel>
    
    `,
    styles: [` a { cursor: pointer; } 
            .ngf-hidden{display:none}
      `],
    standalone: false
})
export class MaterialTabsComponent implements OnInit,OnChanges {
  private jsf = inject(JsonSchemaFormService);

  options: any;
  itemCount: number;
  selectedItem = 0;
  showAddTab = true;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);
  readonly memoizationEnabled= input<boolean>(true);

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    if(this.options.selectedTab){
      this.selectedItem = this.options.selectedTab;
    }
    this.itemCount = this.layoutNode().items.length - 1;
    this.updateControl();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['layout'] || changes['dataIndex'] || changes['layoutIndex']) {
      this._getSelectFrameworkInputsMemoized.cache.clear();

    }
  }
  select(index) {
    const layoutNode = this.layoutNode();
    if (layoutNode.items[index].type === '$ref') {
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
    this.itemCount = this.layoutNode().items.length - 1;
    const lastItem = this.layoutNode().items[this.layoutNode().items.length - 1];
    this.showAddTab = lastItem.type === '$ref' &&
      this.itemCount < (lastItem.options.maxItems || 1000);
  }

  setTabTitle(item: any, index: number): string {
    return this.jsf.setArrayItemTitle(this, item, index);
  }
    private _getSelectFrameworkInputsRaw = (layoutItem: any, i: number) => {
      const dataIndexValue = this.layoutNode()?.dataType === 'array' ? (this.dataIndex() || []).concat(i) : this.dataIndex()
      const layoutIndexValue = (this.layoutIndex() || []).concat(i);
  
      return {
        layoutNode: layoutItem,
        layoutIndex: layoutIndexValue,
        dataIndex:dataIndexValue
      };
    };
  
    // Define a separate function to hold the memoized version
    private _getSelectFrameworkInputsMemoized = memoize(
      this._getSelectFrameworkInputsRaw,
      (layoutItem: any, i: number) => {
        const layoutItemKey = layoutItem?.id ?? JSON.stringify(layoutItem);
        return `${layoutItemKey}-${i}`;
      }
    );
  
    // This is the public function that the template calls
    getSelectFrameworkInputs(layoutItem: any, i: number) {
      if (this.memoizationEnabled) {
        return this._getSelectFrameworkInputsMemoized(layoutItem, i);
      } else {
        return this._getSelectFrameworkInputsRaw(layoutItem, i);
      }
    }
}
