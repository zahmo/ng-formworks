import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@ng-formworks/core";
import * as i2 from "@angular/common";
import * as i3 from "@angular/material/tabs";
export class MaterialTabsComponent {
    constructor(jsf) {
        this.jsf = jsf;
        this.selectedItem = 0;
        this.showAddTab = true;
    }
    ngOnInit() {
        this.options = this.layoutNode.options || {};
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
    setTabTitle(item, index) {
        return this.jsf.setArrayItemTitle(this, item, index);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: MaterialTabsComponent, deps: [{ token: i1.JsonSchemaFormService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.7", type: MaterialTabsComponent, selector: "material-tabs-widget", inputs: { layoutNode: "layoutNode", layoutIndex: "layoutIndex", dataIndex: "dataIndex" }, ngImport: i0, template: `
    <nav mat-tab-nav-bar [tabPanel]="tabPanel"
      [attr.aria-label]="options?.label || options?.title || ''"
      [style.width]="'100%'">
        <a mat-tab-link *ngFor="let item of layoutNode?.items; let i = index"
          [active]="selectedItem === i"
          (click)="select(i)">
          <span *ngIf="showAddTab || item.type !== '$ref'"
            [innerHTML]="setTabTitle(item, i)"></span>
        </a>
    </nav>
    <mat-tab-nav-panel #tabPanel>
      <div *ngFor="let layoutItem of layoutNode?.items; let i = index"
        [class]="options?.htmlClass || ''">
        <select-framework-widget *ngIf="selectedItem === i"
          [class]="(options?.fieldHtmlClass || '') + ' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')"
          [dataIndex]="layoutNode?.dataType === 'array' ? (dataIndex || []).concat(i) : dataIndex"
          [layoutIndex]="(layoutIndex || []).concat(i)"
          [layoutNode]="layoutItem"></select-framework-widget>
      </div>
    </mat-tab-nav-panel>
`, isInline: true, styles: ["a{cursor:pointer}\n"], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.MatTabNav, selector: "[mat-tab-nav-bar]", inputs: ["fitInkBarToContent", "mat-stretch-tabs", "animationDuration", "backgroundColor", "disableRipple", "color", "tabPanel"], exportAs: ["matTabNavBar", "matTabNav"] }, { kind: "component", type: i3.MatTabNavPanel, selector: "mat-tab-nav-panel", inputs: ["id"], exportAs: ["matTabNavPanel"] }, { kind: "component", type: i3.MatTabLink, selector: "[mat-tab-link], [matTabLink]", inputs: ["active", "disabled", "disableRipple", "tabIndex", "id"], exportAs: ["matTabLink"] }, { kind: "component", type: i1.SelectFrameworkComponent, selector: "select-framework-widget", inputs: ["layoutNode", "layoutIndex", "dataIndex"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: MaterialTabsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'material-tabs-widget', template: `
    <nav mat-tab-nav-bar [tabPanel]="tabPanel"
      [attr.aria-label]="options?.label || options?.title || ''"
      [style.width]="'100%'">
        <a mat-tab-link *ngFor="let item of layoutNode?.items; let i = index"
          [active]="selectedItem === i"
          (click)="select(i)">
          <span *ngIf="showAddTab || item.type !== '$ref'"
            [innerHTML]="setTabTitle(item, i)"></span>
        </a>
    </nav>
    <mat-tab-nav-panel #tabPanel>
      <div *ngFor="let layoutItem of layoutNode?.items; let i = index"
        [class]="options?.htmlClass || ''">
        <select-framework-widget *ngIf="selectedItem === i"
          [class]="(options?.fieldHtmlClass || '') + ' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')"
          [dataIndex]="layoutNode?.dataType === 'array' ? (dataIndex || []).concat(i) : dataIndex"
          [layoutIndex]="(layoutIndex || []).concat(i)"
          [layoutNode]="layoutItem"></select-framework-widget>
      </div>
    </mat-tab-nav-panel>
`, styles: ["a{cursor:pointer}\n"] }]
        }], ctorParameters: () => [{ type: i1.JsonSchemaFormService }], propDecorators: { layoutNode: [{
                type: Input
            }], layoutIndex: [{
                type: Input
            }], dataIndex: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtdGFicy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1mb3Jtd29ya3MtbWF0ZXJpYWwvc3JjL2xpYi93aWRnZXRzL21hdGVyaWFsLXRhYnMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFVLE1BQU0sZUFBZSxDQUFDOzs7OztBQThCekQsTUFBTSxPQUFPLHFCQUFxQjtJQVNoQyxZQUNVLEdBQTBCO1FBQTFCLFFBQUcsR0FBSCxHQUFHLENBQXVCO1FBUHBDLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLGVBQVUsR0FBRyxJQUFJLENBQUM7SUFPZCxDQUFDO0lBRUwsUUFBUTtRQUNOLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQzdDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUNsRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELE1BQU0sQ0FBQyxLQUFLO1FBQ1YsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFLENBQUM7WUFDakQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUM7Z0JBQ2YsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDeEMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDM0MsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQzthQUN4QyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdkIsQ0FBQztRQUNELElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0lBQzVCLENBQUM7SUFFRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ2xELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6RSxJQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEtBQUssTUFBTTtZQUN4QyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELFdBQVcsQ0FBQyxJQUFTLEVBQUUsS0FBYTtRQUNsQyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN2RCxDQUFDOzhHQXhDVSxxQkFBcUI7a0dBQXJCLHFCQUFxQixzSkF4QnRCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FxQlg7OzJGQUdZLHFCQUFxQjtrQkEzQmpDLFNBQVM7K0JBRUUsc0JBQXNCLFlBQ3RCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FxQlg7MEZBUVUsVUFBVTtzQkFBbEIsS0FBSztnQkFDRyxXQUFXO3NCQUFuQixLQUFLO2dCQUNHLFNBQVM7c0JBQWpCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJ0BuZy1mb3Jtd29ya3MvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y29tcG9uZW50LXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnbWF0ZXJpYWwtdGFicy13aWRnZXQnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuYXYgbWF0LXRhYi1uYXYtYmFyIFt0YWJQYW5lbF09XCJ0YWJQYW5lbFwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cIm9wdGlvbnM/LmxhYmVsIHx8IG9wdGlvbnM/LnRpdGxlIHx8ICcnXCJcbiAgICAgIFtzdHlsZS53aWR0aF09XCInMTAwJSdcIj5cbiAgICAgICAgPGEgbWF0LXRhYi1saW5rICpuZ0Zvcj1cImxldCBpdGVtIG9mIGxheW91dE5vZGU/Lml0ZW1zOyBsZXQgaSA9IGluZGV4XCJcbiAgICAgICAgICBbYWN0aXZlXT1cInNlbGVjdGVkSXRlbSA9PT0gaVwiXG4gICAgICAgICAgKGNsaWNrKT1cInNlbGVjdChpKVwiPlxuICAgICAgICAgIDxzcGFuICpuZ0lmPVwic2hvd0FkZFRhYiB8fCBpdGVtLnR5cGUgIT09ICckcmVmJ1wiXG4gICAgICAgICAgICBbaW5uZXJIVE1MXT1cInNldFRhYlRpdGxlKGl0ZW0sIGkpXCI+PC9zcGFuPlxuICAgICAgICA8L2E+XG4gICAgPC9uYXY+XG4gICAgPG1hdC10YWItbmF2LXBhbmVsICN0YWJQYW5lbD5cbiAgICAgIDxkaXYgKm5nRm9yPVwibGV0IGxheW91dEl0ZW0gb2YgbGF5b3V0Tm9kZT8uaXRlbXM7IGxldCBpID0gaW5kZXhcIlxuICAgICAgICBbY2xhc3NdPVwib3B0aW9ucz8uaHRtbENsYXNzIHx8ICcnXCI+XG4gICAgICAgIDxzZWxlY3QtZnJhbWV3b3JrLXdpZGdldCAqbmdJZj1cInNlbGVjdGVkSXRlbSA9PT0gaVwiXG4gICAgICAgICAgW2NsYXNzXT1cIihvcHRpb25zPy5maWVsZEh0bWxDbGFzcyB8fCAnJykgKyAnICcgKyAob3B0aW9ucz8uYWN0aXZlQ2xhc3MgfHwgJycpICsgJyAnICsgKG9wdGlvbnM/LnN0eWxlPy5zZWxlY3RlZCB8fCAnJylcIlxuICAgICAgICAgIFtkYXRhSW5kZXhdPVwibGF5b3V0Tm9kZT8uZGF0YVR5cGUgPT09ICdhcnJheScgPyAoZGF0YUluZGV4IHx8IFtdKS5jb25jYXQoaSkgOiBkYXRhSW5kZXhcIlxuICAgICAgICAgIFtsYXlvdXRJbmRleF09XCIobGF5b3V0SW5kZXggfHwgW10pLmNvbmNhdChpKVwiXG4gICAgICAgICAgW2xheW91dE5vZGVdPVwibGF5b3V0SXRlbVwiPjwvc2VsZWN0LWZyYW1ld29yay13aWRnZXQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L21hdC10YWItbmF2LXBhbmVsPlxuYCxcbiAgc3R5bGVzOiBbYCBhIHsgY3Vyc29yOiBwb2ludGVyOyB9IGBdLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRlcmlhbFRhYnNDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBvcHRpb25zOiBhbnk7XG4gIGl0ZW1Db3VudDogbnVtYmVyO1xuICBzZWxlY3RlZEl0ZW0gPSAwO1xuICBzaG93QWRkVGFiID0gdHJ1ZTtcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMub3B0aW9ucyA9IHRoaXMubGF5b3V0Tm9kZS5vcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuaXRlbUNvdW50ID0gdGhpcy5sYXlvdXROb2RlLml0ZW1zLmxlbmd0aCAtIDE7XG4gICAgdGhpcy51cGRhdGVDb250cm9sKCk7XG4gIH1cblxuICBzZWxlY3QoaW5kZXgpIHtcbiAgICBpZiAodGhpcy5sYXlvdXROb2RlLml0ZW1zW2luZGV4XS50eXBlID09PSAnJHJlZicpIHtcbiAgICAgIHRoaXMuanNmLmFkZEl0ZW0oe1xuICAgICAgICBsYXlvdXROb2RlOiB0aGlzLmxheW91dE5vZGUuaXRlbXNbaW5kZXhdLFxuICAgICAgICBsYXlvdXRJbmRleDogdGhpcy5sYXlvdXRJbmRleC5jb25jYXQoaW5kZXgpLFxuICAgICAgICBkYXRhSW5kZXg6IHRoaXMuZGF0YUluZGV4LmNvbmNhdChpbmRleClcbiAgICAgIH0pO1xuICAgICAgdGhpcy51cGRhdGVDb250cm9sKCk7XG4gICAgfVxuICAgIHRoaXMuc2VsZWN0ZWRJdGVtID0gaW5kZXg7XG4gIH1cblxuICB1cGRhdGVDb250cm9sKCkge1xuICAgIHRoaXMuaXRlbUNvdW50ID0gdGhpcy5sYXlvdXROb2RlLml0ZW1zLmxlbmd0aCAtIDE7XG4gICAgY29uc3QgbGFzdEl0ZW0gPSB0aGlzLmxheW91dE5vZGUuaXRlbXNbdGhpcy5sYXlvdXROb2RlLml0ZW1zLmxlbmd0aCAtIDFdO1xuICAgIHRoaXMuc2hvd0FkZFRhYiA9IGxhc3RJdGVtLnR5cGUgPT09ICckcmVmJyAmJlxuICAgICAgdGhpcy5pdGVtQ291bnQgPCAobGFzdEl0ZW0ub3B0aW9ucy5tYXhJdGVtcyB8fCAxMDAwKTtcbiAgfVxuXG4gIHNldFRhYlRpdGxlKGl0ZW06IGFueSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuanNmLnNldEFycmF5SXRlbVRpdGxlKHRoaXMsIGl0ZW0sIGluZGV4KTtcbiAgfVxufVxuIl19