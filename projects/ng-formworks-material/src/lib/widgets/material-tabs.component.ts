import { Component, Input, OnInit } from '@angular/core';
import { JsonSchemaFormService } from '@ng-formworks/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'material-tabs-widget',
  template: `
    <nav mat-tab-nav-bar [tabPanel]="tabPanel"
      [attr.aria-label]="options?.label || options?.title || ''"
      [style.width]="'100%'">
      
        <a mat-tab-link *ngFor="let item of layoutNode?.items; let i = index"
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
        <mat-radio-button *ngIf="options?.tabMode=='oneOfMode'"
          [checked]="selectedItem === i" 
          [value]="i"
          >
        </mat-radio-button>

          <span *ngIf="showAddTab || item.type !== '$ref'"
            [innerHTML]="setTabTitle(item, i)"></span>
                  
        </a>

        
    </nav>
        <mat-tab-nav-panel #tabPanel>
          <div *ngFor="let layoutItem of layoutNode?.items; let i = index" 
            [class]="(options?.htmlClass || '') + (selectedItem != i?' ngf-hidden':'')">
               <!--for now the only difference between oneOfMode and the default 
                is that oneOfMode uses the *ngIf="selectedItem === i" clause, which automatically
                destroys the tabs that are not rendered while default mode only hide them
                the upshot is that only the active tabs value will be used
              -->
            <ng-container *ngIf="options?.tabMode=='oneOfMode'">
              <select-framework-widget *ngIf="selectedItem === i"
                [class]="(options?.fieldHtmlClass || '') + ' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')"
                [dataIndex]="layoutNode?.dataType === 'array' ? (dataIndex || []).concat(i) : dataIndex"
                [layoutIndex]="(layoutIndex || []).concat(i)"
                [layoutNode]="layoutItem"></select-framework-widget>
             </ng-container>   
            <ng-container *ngIf="options?.tabMode !='oneOfMode'">
              <select-framework-widget *ngIf="selectedItem === i"
                [class]="(options?.fieldHtmlClass || '') + ' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')"
                [dataIndex]="layoutNode?.dataType === 'array' ? (dataIndex || []).concat(i) : dataIndex"
                [layoutIndex]="(layoutIndex || []).concat(i)"
                [layoutNode]="layoutItem"></select-framework-widget>
             </ng-container>   
          </div>
        </mat-tab-nav-panel>

`,
    styles: [` a { cursor: pointer; } 
            .ngf-hidden{display:none}
      `],
    standalone: false
})
export class MaterialTabsComponent implements OnInit {
  options: any;
  itemCount: number;
  selectedItem = 0;
  showAddTab = true;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];

  constructor(
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.options = this.layoutNode.options || {};
    if(this.options.selectedTab){
      this.selectedItem = this.options.selectedTab;
    }
    this.itemCount = this.layoutNode.items.length - 1;
    this.updateControl();
  }

  select(index) {
    if (this.layoutNode.items[index].type === '$ref') {
      this.jsf.addItem({
        layoutNode: this.layoutNode.items[index],
        layoutIndex: this.layoutIndex.concat(index),
        dataIndex: this.dataIndex.concat(index)
      });
      this.updateControl();
    }
    this.selectedItem = index;
  }

  updateControl() {
    this.itemCount = this.layoutNode.items.length - 1;
    const lastItem = this.layoutNode.items[this.layoutNode.items.length - 1];
    this.showAddTab = lastItem.type === '$ref' &&
      this.itemCount < (lastItem.options.maxItems || 1000);
  }

  setTabTitle(item: any, index: number): string {
    return this.jsf.setArrayItemTitle(this, item, index);
  }
}
