import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../json-schema-form.service";
import * as i2 from "@angular/common";
import * as i3 from "./select-framework.component";
import * as i4 from "./orderable.directive";
export class RootComponent {
    constructor(jsf) {
        this.jsf = jsf;
        this.isFlexItem = false;
    }
    isDraggable(node) {
        return node.arrayItem && node.type !== '$ref' &&
            node.arrayItemType === 'list' && this.isOrderable !== false;
    }
    // Set attributes for flexbox child
    // (container attributes are set in section.component)
    getFlexAttribute(node, attribute) {
        const index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
        return ((node.options || {}).flex || '').split(/\s+/)[index] ||
            (node.options || {})[attribute] || ['1', '1', 'auto'][index];
    }
    showWidget(layoutNode) {
        return this.jsf.evaluateCondition(layoutNode, this.dataIndex);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: RootComponent, deps: [{ token: i1.JsonSchemaFormService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: RootComponent, selector: "root-widget", inputs: { dataIndex: "dataIndex", layoutIndex: "layoutIndex", layout: "layout", isOrderable: "isOrderable", isFlexItem: "isFlexItem" }, ngImport: i0, template: `
    <div *ngFor="let layoutItem of layout; let i = index"
      [class.form-flex-item]="isFlexItem"
      [style.align-self]="(layoutItem.options || {})['align-self']"
      [style.flex-basis]="getFlexAttribute(layoutItem, 'flex-basis')"
      [style.flex-grow]="getFlexAttribute(layoutItem, 'flex-grow')"
      [style.flex-shrink]="getFlexAttribute(layoutItem, 'flex-shrink')"
      [style.order]="(layoutItem.options || {}).order">
      <div
        [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
        [layoutIndex]="(layoutIndex || []).concat(i)"
        [layoutNode]="layoutItem"
        [orderable]="isDraggable(layoutItem)">
        <select-framework-widget *ngIf="showWidget(layoutItem)"
          [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
          [layoutIndex]="(layoutIndex || []).concat(i)"
          [layoutNode]="layoutItem"></select-framework-widget>
      </div>
    </div>`, isInline: true, styles: ["[draggable=true]{transition:all .15s cubic-bezier(.4,0,.2,1)}[draggable=true]:hover{cursor:move;box-shadow:2px 2px 4px #0003;position:relative;z-index:10;margin:-1px 1px 1px -1px}[draggable=true].drag-target-top{box-shadow:0 -2px #000;position:relative;z-index:20}[draggable=true].drag-target-bottom{box-shadow:0 2px #000;position:relative;z-index:20}\n"], dependencies: [{ kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: i3.SelectFrameworkComponent, selector: "select-framework-widget", inputs: ["layoutNode", "layoutIndex", "dataIndex"] }, { kind: "directive", type: i4.OrderableDirective, selector: "[orderable]", inputs: ["orderable", "layoutNode", "layoutIndex", "dataIndex"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: RootComponent, decorators: [{
            type: Component,
            args: [{ selector: 'root-widget', template: `
    <div *ngFor="let layoutItem of layout; let i = index"
      [class.form-flex-item]="isFlexItem"
      [style.align-self]="(layoutItem.options || {})['align-self']"
      [style.flex-basis]="getFlexAttribute(layoutItem, 'flex-basis')"
      [style.flex-grow]="getFlexAttribute(layoutItem, 'flex-grow')"
      [style.flex-shrink]="getFlexAttribute(layoutItem, 'flex-shrink')"
      [style.order]="(layoutItem.options || {}).order">
      <div
        [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
        [layoutIndex]="(layoutIndex || []).concat(i)"
        [layoutNode]="layoutItem"
        [orderable]="isDraggable(layoutItem)">
        <select-framework-widget *ngIf="showWidget(layoutItem)"
          [dataIndex]="layoutItem?.arrayItem ? (dataIndex || []).concat(i) : (dataIndex || [])"
          [layoutIndex]="(layoutIndex || []).concat(i)"
          [layoutNode]="layoutItem"></select-framework-widget>
      </div>
    </div>`, styles: ["[draggable=true]{transition:all .15s cubic-bezier(.4,0,.2,1)}[draggable=true]:hover{cursor:move;box-shadow:2px 2px 4px #0003;position:relative;z-index:10;margin:-1px 1px 1px -1px}[draggable=true].drag-target-top{box-shadow:0 -2px #000;position:relative;z-index:20}[draggable=true].drag-target-bottom{box-shadow:0 2px #000;position:relative;z-index:20}\n"] }]
        }], ctorParameters: () => [{ type: i1.JsonSchemaFormService }], propDecorators: { dataIndex: [{
                type: Input
            }], layoutIndex: [{
                type: Input
            }], layout: [{
                type: Input
            }], isOrderable: [{
                type: Input
            }], isFlexItem: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm9vdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1mb3Jtd29ya3MtY29yZS9zcmMvbGliL3dpZGdldC1saWJyYXJ5L3Jvb3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7Ozs7QUFpRGpELE1BQU0sT0FBTyxhQUFhO0lBUXhCLFlBQ1UsR0FBMEI7UUFBMUIsUUFBRyxHQUFILEdBQUcsQ0FBdUI7UUFIM0IsZUFBVSxHQUFHLEtBQUssQ0FBQztJQUl4QixDQUFDO0lBRUwsV0FBVyxDQUFDLElBQVM7UUFDbkIsT0FBTyxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssTUFBTTtZQUMzQyxJQUFJLENBQUMsYUFBYSxLQUFLLE1BQU0sSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLEtBQUssQ0FBQztJQUNoRSxDQUFDO0lBRUQsbUNBQW1DO0lBQ25DLHNEQUFzRDtJQUN0RCxnQkFBZ0IsQ0FBQyxJQUFTLEVBQUUsU0FBaUI7UUFDM0MsTUFBTSxLQUFLLEdBQUcsQ0FBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1RSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQzFELENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELFVBQVUsQ0FBQyxVQUFlO1FBQ3hCLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7K0dBM0JVLGFBQWE7bUdBQWIsYUFBYSwyTEExQ2Q7Ozs7Ozs7Ozs7Ozs7Ozs7OztXQWtCRDs7NEZBd0JFLGFBQWE7a0JBN0N6QixTQUFTOytCQUVFLGFBQWEsWUFDYjs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBa0JEOzBGQTBCQSxTQUFTO3NCQUFqQixLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csTUFBTTtzQkFBZCxLQUFLO2dCQUNHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBQ0csVUFBVTtzQkFBbEIsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtU2VydmljZSB9IGZyb20gJy4uL2pzb24tc2NoZW1hLWZvcm0uc2VydmljZSc7XG5cblxuQENvbXBvbmVudCh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjb21wb25lbnQtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdyb290LXdpZGdldCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiAqbmdGb3I9XCJsZXQgbGF5b3V0SXRlbSBvZiBsYXlvdXQ7IGxldCBpID0gaW5kZXhcIlxuICAgICAgW2NsYXNzLmZvcm0tZmxleC1pdGVtXT1cImlzRmxleEl0ZW1cIlxuICAgICAgW3N0eWxlLmFsaWduLXNlbGZdPVwiKGxheW91dEl0ZW0ub3B0aW9ucyB8fCB7fSlbJ2FsaWduLXNlbGYnXVwiXG4gICAgICBbc3R5bGUuZmxleC1iYXNpc109XCJnZXRGbGV4QXR0cmlidXRlKGxheW91dEl0ZW0sICdmbGV4LWJhc2lzJylcIlxuICAgICAgW3N0eWxlLmZsZXgtZ3Jvd109XCJnZXRGbGV4QXR0cmlidXRlKGxheW91dEl0ZW0sICdmbGV4LWdyb3cnKVwiXG4gICAgICBbc3R5bGUuZmxleC1zaHJpbmtdPVwiZ2V0RmxleEF0dHJpYnV0ZShsYXlvdXRJdGVtLCAnZmxleC1zaHJpbmsnKVwiXG4gICAgICBbc3R5bGUub3JkZXJdPVwiKGxheW91dEl0ZW0ub3B0aW9ucyB8fCB7fSkub3JkZXJcIj5cbiAgICAgIDxkaXZcbiAgICAgICAgW2RhdGFJbmRleF09XCJsYXlvdXRJdGVtPy5hcnJheUl0ZW0gPyAoZGF0YUluZGV4IHx8IFtdKS5jb25jYXQoaSkgOiAoZGF0YUluZGV4IHx8IFtdKVwiXG4gICAgICAgIFtsYXlvdXRJbmRleF09XCIobGF5b3V0SW5kZXggfHwgW10pLmNvbmNhdChpKVwiXG4gICAgICAgIFtsYXlvdXROb2RlXT1cImxheW91dEl0ZW1cIlxuICAgICAgICBbb3JkZXJhYmxlXT1cImlzRHJhZ2dhYmxlKGxheW91dEl0ZW0pXCI+XG4gICAgICAgIDxzZWxlY3QtZnJhbWV3b3JrLXdpZGdldCAqbmdJZj1cInNob3dXaWRnZXQobGF5b3V0SXRlbSlcIlxuICAgICAgICAgIFtkYXRhSW5kZXhdPVwibGF5b3V0SXRlbT8uYXJyYXlJdGVtID8gKGRhdGFJbmRleCB8fCBbXSkuY29uY2F0KGkpIDogKGRhdGFJbmRleCB8fCBbXSlcIlxuICAgICAgICAgIFtsYXlvdXRJbmRleF09XCIobGF5b3V0SW5kZXggfHwgW10pLmNvbmNhdChpKVwiXG4gICAgICAgICAgW2xheW91dE5vZGVdPVwibGF5b3V0SXRlbVwiPjwvc2VsZWN0LWZyYW1ld29yay13aWRnZXQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5gLFxuICBzdHlsZXM6IFtgXG4gICAgW2RyYWdnYWJsZT10cnVlXSB7XG4gICAgICB0cmFuc2l0aW9uOiBhbGwgMTUwbXMgY3ViaWMtYmV6aWVyKC40LCAwLCAuMiwgMSk7XG4gICAgfVxuICAgIFtkcmFnZ2FibGU9dHJ1ZV06aG92ZXIge1xuICAgICAgY3Vyc29yOiBtb3ZlO1xuICAgICAgYm94LXNoYWRvdzogMnB4IDJweCA0cHggcmdiYSgwLCAwLCAwLCAwLjIpO1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlOyB6LWluZGV4OiAxMDtcbiAgICAgIG1hcmdpbi10b3A6IC0xcHg7XG4gICAgICBtYXJnaW4tbGVmdDogLTFweDtcbiAgICAgIG1hcmdpbi1yaWdodDogMXB4O1xuICAgICAgbWFyZ2luLWJvdHRvbTogMXB4O1xuICAgIH1cbiAgICBbZHJhZ2dhYmxlPXRydWVdLmRyYWctdGFyZ2V0LXRvcCB7XG4gICAgICBib3gtc2hhZG93OiAwIC0ycHggMCAjMDAwO1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlOyB6LWluZGV4OiAyMDtcbiAgICB9XG4gICAgW2RyYWdnYWJsZT10cnVlXS5kcmFnLXRhcmdldC1ib3R0b20ge1xuICAgICAgYm94LXNoYWRvdzogMCAycHggMCAjMDAwO1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlOyB6LWluZGV4OiAyMDtcbiAgICB9XG4gIGBdLFxufSlcbmV4cG9ydCBjbGFzcyBSb290Q29tcG9uZW50IHtcbiAgb3B0aW9uczogYW55O1xuICBASW5wdXQoKSBkYXRhSW5kZXg6IG51bWJlcltdO1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGxheW91dDogYW55W107XG4gIEBJbnB1dCgpIGlzT3JkZXJhYmxlOiBib29sZWFuO1xuICBASW5wdXQoKSBpc0ZsZXhJdGVtID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBqc2Y6IEpzb25TY2hlbWFGb3JtU2VydmljZVxuICApIHsgfVxuXG4gIGlzRHJhZ2dhYmxlKG5vZGU6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBub2RlLmFycmF5SXRlbSAmJiBub2RlLnR5cGUgIT09ICckcmVmJyAmJlxuICAgICAgbm9kZS5hcnJheUl0ZW1UeXBlID09PSAnbGlzdCcgJiYgdGhpcy5pc09yZGVyYWJsZSAhPT0gZmFsc2U7XG4gIH1cblxuICAvLyBTZXQgYXR0cmlidXRlcyBmb3IgZmxleGJveCBjaGlsZFxuICAvLyAoY29udGFpbmVyIGF0dHJpYnV0ZXMgYXJlIHNldCBpbiBzZWN0aW9uLmNvbXBvbmVudClcbiAgZ2V0RmxleEF0dHJpYnV0ZShub2RlOiBhbnksIGF0dHJpYnV0ZTogc3RyaW5nKSB7XG4gICAgY29uc3QgaW5kZXggPSBbJ2ZsZXgtZ3JvdycsICdmbGV4LXNocmluaycsICdmbGV4LWJhc2lzJ10uaW5kZXhPZihhdHRyaWJ1dGUpO1xuICAgIHJldHVybiAoKG5vZGUub3B0aW9ucyB8fCB7fSkuZmxleCB8fCAnJykuc3BsaXQoL1xccysvKVtpbmRleF0gfHxcbiAgICAgIChub2RlLm9wdGlvbnMgfHwge30pW2F0dHJpYnV0ZV0gfHwgWycxJywgJzEnLCAnYXV0byddW2luZGV4XTtcbiAgfVxuXG4gIHNob3dXaWRnZXQobGF5b3V0Tm9kZTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuanNmLmV2YWx1YXRlQ29uZGl0aW9uKGxheW91dE5vZGUsIHRoaXMuZGF0YUluZGV4KTtcbiAgfVxufVxuIl19