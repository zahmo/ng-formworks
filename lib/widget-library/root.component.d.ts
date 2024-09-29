import { JsonSchemaFormService } from '../json-schema-form.service';
import * as i0 from "@angular/core";
export declare class RootComponent {
    private jsf;
    options: any;
    dataIndex: number[];
    layoutIndex: number[];
    layout: any[];
    isOrderable: boolean;
    isFlexItem: boolean;
    constructor(jsf: JsonSchemaFormService);
    isDraggable(node: any): boolean;
    getFlexAttribute(node: any, attribute: string): any;
    showWidget(layoutNode: any): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<RootComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RootComponent, "root-widget", never, { "dataIndex": { "alias": "dataIndex"; "required": false; }; "layoutIndex": { "alias": "layoutIndex"; "required": false; }; "layout": { "alias": "layout"; "required": false; }; "isOrderable": { "alias": "isOrderable"; "required": false; }; "isFlexItem": { "alias": "isFlexItem"; "required": false; }; }, {}, never, never, false, never>;
}
