import { Component, Input, ViewEncapsulation } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@ng-formworks/core";
import * as i2 from "@ng-formworks/cssframework";
/**
 * Bootstrap 3 framework for Angular JSON Schema Form.
 */
export class Bootstrap3FrameworkComponent {
    constructor(changeDetector, jsf) {
        this.changeDetector = changeDetector;
        this.jsf = jsf;
        this.frameworkInitialized = false;
        this.formControl = null;
        this.debugOutput = '';
        this.debug = '';
        this.parentArray = null;
        this.isOrderable = false;
    }
    ngOnInit() {
    }
    ngOnChanges() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: Bootstrap3FrameworkComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.JsonSchemaFormService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "17.3.12", type: Bootstrap3FrameworkComponent, selector: "bootstrap-3-framework", inputs: { layoutNode: "layoutNode", layoutIndex: "layoutIndex", dataIndex: "dataIndex" }, usesOnChanges: true, ngImport: i0, template: `
  <div>
    <css-framework [layoutNode]="layoutNode" 
    [layoutIndex]="layoutIndex" 
    [dataIndex]="dataIndex">
    </css-framework>
  </div>
  `, isInline: true, styles: [":host ::ng-deep .list-group-item .form-control-feedback{top:40px}:host ::ng-deep .checkbox,:host ::ng-deep .radio{margin-top:0;margin-bottom:0}:host ::ng-deep .checkbox-inline,:host ::ng-deep .checkbox-inline+.checkbox-inline,:host ::ng-deep .checkbox-inline+.radio-inline,:host ::ng-deep .radio-inline,:host ::ng-deep .radio-inline+.radio-inline,:host ::ng-deep .radio-inline+.checkbox-inline{margin-left:0;margin-right:10px}:host ::ng-deep .checkbox-inline:last-child,:host ::ng-deep .radio-inline:last-child{margin-right:0}:host ::ng-deep .ng-invalid.ng-touched{border:1px solid #f44336}\n"], dependencies: [{ kind: "component", type: i2.CssFrameworkComponent, selector: "css-framework", inputs: ["layoutNode", "layoutIndex", "dataIndex", "widgetStyles"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: Bootstrap3FrameworkComponent, decorators: [{
            type: Component,
            args: [{ selector: 'bootstrap-3-framework', template: `
  <div>
    <css-framework [layoutNode]="layoutNode" 
    [layoutIndex]="layoutIndex" 
    [dataIndex]="dataIndex">
    </css-framework>
  </div>
  `, encapsulation: ViewEncapsulation.None, styles: [":host ::ng-deep .list-group-item .form-control-feedback{top:40px}:host ::ng-deep .checkbox,:host ::ng-deep .radio{margin-top:0;margin-bottom:0}:host ::ng-deep .checkbox-inline,:host ::ng-deep .checkbox-inline+.checkbox-inline,:host ::ng-deep .checkbox-inline+.radio-inline,:host ::ng-deep .radio-inline,:host ::ng-deep .radio-inline+.radio-inline,:host ::ng-deep .radio-inline+.checkbox-inline{margin-left:0;margin-right:10px}:host ::ng-deep .checkbox-inline:last-child,:host ::ng-deep .radio-inline:last-child{margin-right:0}:host ::ng-deep .ng-invalid.ng-touched{border:1px solid #f44336}\n"] }]
        }], ctorParameters: () => [{ type: i0.ChangeDetectorRef }, { type: i1.JsonSchemaFormService }], propDecorators: { layoutNode: [{
                type: Input
            }], layoutIndex: [{
                type: Input
            }], dataIndex: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwMy1mcmFtZXdvcmsuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmctZm9ybXdvcmtzLWJvb3RzdHJhcDMvc3JjL2xpYi9ib290c3RyYXAzLWZyYW1ld29yay5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFxQixTQUFTLEVBQUUsS0FBSyxFQUFxQixpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQUcxRzs7R0FFRztBQWVILE1BQU0sT0FBTyw0QkFBNEI7SUFldkMsWUFDUyxjQUFpQyxFQUNqQyxHQUEwQjtRQUQxQixtQkFBYyxHQUFkLGNBQWMsQ0FBbUI7UUFDakMsUUFBRyxHQUFILEdBQUcsQ0FBdUI7UUFoQm5DLHlCQUFvQixHQUFHLEtBQUssQ0FBQztRQUk3QixnQkFBVyxHQUFRLElBQUksQ0FBQztRQUN4QixnQkFBVyxHQUFRLEVBQUUsQ0FBQztRQUN0QixVQUFLLEdBQVEsRUFBRSxDQUFDO1FBQ2hCLGdCQUFXLEdBQVEsSUFBSSxDQUFDO1FBQ3hCLGdCQUFXLEdBQUcsS0FBSyxDQUFDO0lBVXBCLENBQUM7SUFJRCxRQUFRO0lBRVIsQ0FBQztJQUVELFdBQVc7SUFFWCxDQUFDOytHQTdCVSw0QkFBNEI7bUdBQTVCLDRCQUE0Qiw0S0FYN0I7Ozs7Ozs7R0FPVDs7NEZBSVUsNEJBQTRCO2tCQWR4QyxTQUFTOytCQUVFLHVCQUF1QixZQUN2Qjs7Ozs7OztHQU9ULGlCQUVhLGlCQUFpQixDQUFDLElBQUk7MEhBWTNCLFVBQVU7c0JBQWxCLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgSnNvblNjaGVtYUZvcm1TZXJ2aWNlIH0gZnJvbSAnQG5nLWZvcm13b3Jrcy9jb3JlJztcblxuLyoqXG4gKiBCb290c3RyYXAgMyBmcmFtZXdvcmsgZm9yIEFuZ3VsYXIgSlNPTiBTY2hlbWEgRm9ybS5cbiAqL1xuQENvbXBvbmVudCh7XG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjb21wb25lbnQtc2VsZWN0b3JcbiAgc2VsZWN0b3I6ICdib290c3RyYXAtMy1mcmFtZXdvcmsnLFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2PlxuICAgIDxjc3MtZnJhbWV3b3JrIFtsYXlvdXROb2RlXT1cImxheW91dE5vZGVcIiBcbiAgICBbbGF5b3V0SW5kZXhdPVwibGF5b3V0SW5kZXhcIiBcbiAgICBbZGF0YUluZGV4XT1cImRhdGFJbmRleFwiPlxuICAgIDwvY3NzLWZyYW1ld29yaz5cbiAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlVXJsczogWycuL2Jvb3RzdHJhcDMtZnJhbWV3b3JrLmNvbXBvbmVudC5zY3NzJ10sXG4gIGVuY2Fwc3VsYXRpb246Vmlld0VuY2Fwc3VsYXRpb24uTm9uZVxufSlcbmV4cG9ydCBjbGFzcyBCb290c3RyYXAzRnJhbWV3b3JrQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMgIHtcbiAgZnJhbWV3b3JrSW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgd2lkZ2V0T3B0aW9uczogYW55OyAvLyBPcHRpb25zIHBhc3NlZCB0byBjaGlsZCB3aWRnZXRcbiAgd2lkZ2V0TGF5b3V0Tm9kZTogYW55OyAvLyBsYXlvdXROb2RlIHBhc3NlZCB0byBjaGlsZCB3aWRnZXRcbiAgb3B0aW9uczogYW55OyAvLyBPcHRpb25zIHVzZWQgaW4gdGhpcyBmcmFtZXdvcmtcbiAgZm9ybUNvbnRyb2w6IGFueSA9IG51bGw7XG4gIGRlYnVnT3V0cHV0OiBhbnkgPSAnJztcbiAgZGVidWc6IGFueSA9ICcnO1xuICBwYXJlbnRBcnJheTogYW55ID0gbnVsbDtcbiAgaXNPcmRlcmFibGUgPSBmYWxzZTtcbiAgQElucHV0KCkgbGF5b3V0Tm9kZTogYW55O1xuICBASW5wdXQoKSBsYXlvdXRJbmRleDogbnVtYmVyW107XG4gIEBJbnB1dCgpIGRhdGFJbmRleDogbnVtYmVyW107XG4gIFxuICBcbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGNoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwdWJsaWMganNmOiBKc29uU2NoZW1hRm9ybVNlcnZpY2VcbiAgKSB7XG4gIH1cbiAgXG4gIFxuICBcbiAgbmdPbkluaXQoKSB7XG4gIFxuICB9XG4gIFxuICBuZ09uQ2hhbmdlcygpIHtcbiAgXG4gIH1cbiAgXG4gIFxuICBcbiAgXG4gIFxuICBcbiAgfVxuIl19