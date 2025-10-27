import { ChangeDetectorRef, Component, OnDestroy, OnInit, inject, input, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'tabs-widget',
  template: `
    <ul
      [class]="options?.labelHtmlClass || ''">
      <li *ngFor="let item of layoutNode()?.items; let i = index"
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

    <div *ngFor="let layoutItem of layoutNode()?.items; let i = index"
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
    </div>`,
    styles: [` a { cursor: pointer; } 
        .ngf-hidden{display:none}
      `],
    standalone: false
})
export class TabsComponent implements OnInit,OnDestroy {
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
    this.jsf.dataChanges.subscribe((val)=>{
        this.cdr.detectChanges();
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
