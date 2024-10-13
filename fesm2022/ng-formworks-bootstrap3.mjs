import * as i0 from '@angular/core';
import { Component, ViewEncapsulation, Input, Injectable, NgModule } from '@angular/core';
import * as i1 from '@ng-formworks/core';
import { JsonSchemaFormModule, WidgetLibraryModule, JsonSchemaFormService, FrameworkLibraryService, WidgetLibraryService, Framework } from '@ng-formworks/core';
import * as i1$1 from '@ng-formworks/cssframework';
import { CssFramework, CssFrameworkModule } from '@ng-formworks/cssframework';
import { CommonModule } from '@angular/common';

/**
 * Bootstrap 3 framework for Angular JSON Schema Form.
 */
class Bootstrap3FrameworkComponent {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: Bootstrap3FrameworkComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.JsonSchemaFormService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "18.2.7", type: Bootstrap3FrameworkComponent, selector: "bootstrap-3-framework", inputs: { layoutNode: "layoutNode", layoutIndex: "layoutIndex", dataIndex: "dataIndex" }, usesOnChanges: true, ngImport: i0, template: `
  <div>
    <css-framework [layoutNode]="layoutNode" 
    [layoutIndex]="layoutIndex" 
    [dataIndex]="dataIndex">
    </css-framework>
  </div>
  `, isInline: true, styles: [":host ::ng-deep .list-group-item .form-control-feedback{top:40px}:host ::ng-deep .checkbox,:host ::ng-deep .radio{margin-top:0;margin-bottom:0}:host ::ng-deep .checkbox-inline,:host ::ng-deep .checkbox-inline+.checkbox-inline,:host ::ng-deep .checkbox-inline+.radio-inline,:host ::ng-deep .radio-inline,:host ::ng-deep .radio-inline+.radio-inline,:host ::ng-deep .radio-inline+.checkbox-inline{margin-left:0;margin-right:10px}:host ::ng-deep .checkbox-inline:last-child,:host ::ng-deep .radio-inline:last-child{margin-right:0}:host ::ng-deep .ng-invalid.ng-touched{border:1px solid #f44336}\n"], dependencies: [{ kind: "component", type: i1$1.CssFrameworkComponent, selector: "css-framework", inputs: ["layoutNode", "layoutIndex", "dataIndex", "widgetStyles"] }], encapsulation: i0.ViewEncapsulation.None }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: Bootstrap3FrameworkComponent, decorators: [{
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

const cssFrameworkCfgBootstrap3 = {
    "name": "bootstrap-3",
    "text": "Bootstrap 3",
    "stylesheets": [
        "//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
        "//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css"
    ],
    "scripts": [
        "//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js",
        "//ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js",
        "//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"
    ],
    "widgetstyles": {
        "__themes__": [
            { "name": "bootstrap3_default", "text": "Bootstrap3 default" }
        ],
        "$ref": {
            "fieldHtmlClass": "btn pull-right btn-info"
        },
        "__array_item_nonref__": {
            "htmlClass": "list-group-item"
        },
        "__form_group__": {
            "htmlClass": "form-group"
        },
        "__control_label__": {
            "labelHtmlClass": "control-label"
        },
        "__active__": {
            "activeClass": "active"
        },
        "__required_asterisk__": "text-danger",
        "__screen_reader__": "sr-only",
        "__remove_item__": "close pull-right",
        "__help_block__": "help-block",
        "__field_addon_left__": "input-group-addon",
        "__field_addon_right__": "input-group-addon",
        "alt-date": {},
        "alt-datetime": {},
        "__array__": {
            "htmlClass": "list-group"
        },
        "array": {},
        "authfieldset": {},
        "advancedfieldset": {},
        "button": {
            "fieldHtmlClass": "btn btn-sm btn-primary"
        },
        "checkbox": { "fieldHtmlClass": "checkbox" },
        "checkboxes": {
            "fieldHtmlClass": "checkbox"
        },
        "checkboxbuttons": {
            "fieldHtmlClass": "sr-only",
            "htmlClass": "btn-group",
            "itemLabelHtmlClass": "btn"
        },
        "checkboxes-inline": {
            "htmlClass": "checkbox",
            "itemLabelHtmlClass": "checkbox-inline"
        },
        "date": {},
        "datetime-local": {},
        "fieldset": {},
        "integer": {},
        "number": {},
        "optionfieldset": {},
        "password": {},
        "radiobuttons": {
            "fieldHtmlClass": "sr-only",
            "htmlClass": "btn-group",
            "itemLabelHtmlClass": "btn"
        },
        "radio": { "fieldHtmlClass": "radio" },
        "radios": {
            "fieldHtmlClass": "radio"
        },
        "radios-inline": {
            "htmlClass": "radio",
            "itemLabelHtmlClass": "radio-inline"
        },
        "range": {},
        "section": {},
        "selectfieldset": {},
        "select": {},
        "submit": {
            "fieldHtmlClass": "btn btn-primary"
        },
        "text": {},
        "tabs": {
            "labelHtmlClass": "nav nav-tabs",
            "htmlClass": "tab-content",
            "fieldHtmlClass": "tab-pane"
        },
        "tabarray": {
            "labelHtmlClass": "nav nav-tabs",
            "htmlClass": "tab-content",
            "fieldHtmlClass": "tab-pane"
        },
        "textarea": {},
        "default": {
            "fieldHtmlClass": "form-control"
        }
    }
};

// Bootstrap 3 Framework
// https://github.com/valor-software/ng2-bootstrap
class Bootstrap3Framework extends CssFramework {
    constructor(cssFWService) {
        super(cssFrameworkCfgBootstrap3, cssFWService);
        this.cssFWService = cssFWService;
        this.name = 'bootstrap-3';
        this.framework = Bootstrap3FrameworkComponent;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: Bootstrap3Framework, deps: [{ token: i1$1.CssframeworkService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: Bootstrap3Framework }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: Bootstrap3Framework, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1$1.CssframeworkService }] });

class Bootstrap3FrameworkModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: Bootstrap3FrameworkModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.7", ngImport: i0, type: Bootstrap3FrameworkModule, declarations: [Bootstrap3FrameworkComponent], imports: [JsonSchemaFormModule,
            CommonModule,
            WidgetLibraryModule,
            CssFrameworkModule], exports: [JsonSchemaFormModule,
            Bootstrap3FrameworkComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: Bootstrap3FrameworkModule, providers: [
            JsonSchemaFormService,
            FrameworkLibraryService,
            WidgetLibraryService,
            { provide: Framework, useClass: Bootstrap3Framework, multi: true },
        ], imports: [JsonSchemaFormModule,
            CommonModule,
            WidgetLibraryModule,
            CssFrameworkModule, JsonSchemaFormModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: Bootstrap3FrameworkModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        JsonSchemaFormModule,
                        CommonModule,
                        WidgetLibraryModule,
                        CssFrameworkModule
                    ],
                    declarations: [
                        Bootstrap3FrameworkComponent,
                    ],
                    exports: [
                        JsonSchemaFormModule,
                        Bootstrap3FrameworkComponent,
                    ],
                    providers: [
                        JsonSchemaFormService,
                        FrameworkLibraryService,
                        WidgetLibraryService,
                        { provide: Framework, useClass: Bootstrap3Framework, multi: true },
                    ]
                }]
        }] });

/*
 * Public API Surface of @ng-formworks/bootstrap3
 */

/**
 * Generated bundle index. Do not edit.
 */

export { Bootstrap3Framework, Bootstrap3FrameworkComponent, Bootstrap3FrameworkModule };
//# sourceMappingURL=ng-formworks-bootstrap3.mjs.map
