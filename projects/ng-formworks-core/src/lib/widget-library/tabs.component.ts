import { Component, Input, OnInit } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tabs-widget',
  template: `
    <ul
      [class]="options?.labelHtmlClass || ''">
      <li *ngFor="let item of layoutNode?.items; let i = index"
        [class]="(options?.itemLabelHtmlClass || '') + (selectedItem === i ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + options?.style?.unselected))"
        role="presentation"
        data-tabs>
        <a *ngIf="showAddTab || item.type !== '$ref'"
           [class]="'nav-link' + (selectedItem === i ? (' ' + options?.activeClass + ' ' + options?.style?.selected) :
            (' ' + options?.style?.unselected))"
          (click)="select(i)">
          <input type="radio" [value]="i" *ngIf="options?.tabMode=='oneOfMode'" 
           name="tabSelection" 
           [(ngModel)]="selectedItem"
           [class]="(options?.widget_radioClass || '')"
           [value]="i" 
           (change)="select(i)"
          />
          {{setTabTitle(item, i)}}
          </a>
      </li>
    </ul>

    <div *ngFor="let layoutItem of layoutNode?.items; let i = index"
      [class]="(options?.htmlClass || '') + (selectedItem != i?' ngf-hidden':'') ">
        <!--for now the only difference between oneOfMode and the default 
          is that oneOfMode uses the *ngIf="selectedItem === i" clause, which automatically
          destroys the tabs that are not rendered while default mode only hide them
          the upshot is that only the active tabs value will be used
        -->
      <ng-container *ngIf="options?.tabMode=='oneOfMode'">
        <select-framework-widget *ngIf="selectedItem === i"
          [class]="(options?.fieldHtmlClass || '') +
            ' ' + (options?.activeClass || '') +
            ' ' + (options?.style?.selected || '')"
          [dataIndex]="layoutNode?.dataType === 'array' ? (dataIndex || []).concat(i) : dataIndex"
          [layoutIndex]="(layoutIndex || []).concat(i)"
          [layoutNode]="layoutItem"></select-framework-widget>
      </ng-container> 
      <ng-container *ngIf="options?.tabMode !='oneOfMode'">
        <select-framework-widget 
          [class]="(options?.fieldHtmlClass || '') +
            ' ' + (options?.activeClass || '') +
            ' ' + (options?.style?.selected || '')"
          [dataIndex]="layoutNode?.dataType === 'array' ? (dataIndex || []).concat(i) : dataIndex"
          [layoutIndex]="(layoutIndex || []).concat(i)"
          [layoutNode]="layoutItem"></select-framework-widget>
      </ng-container> 
    </div>`,
    styles: [` a { cursor: pointer; } 
        .ngf-hidden{display:none}
      `],
    standalone: false
})
export class TabsComponent implements OnInit {
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
      this.itemCount = this.layoutNode.items.length;
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
    const lastItem = this.layoutNode.items[this.layoutNode.items.length - 1];
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
