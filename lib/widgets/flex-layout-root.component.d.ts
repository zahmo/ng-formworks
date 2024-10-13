import { JsonSchemaFormService } from '@ng-formworks/core';
import * as i0 from "@angular/core";
export declare class FlexLayoutRootComponent {
    private jsf;
    dataIndex: number[];
    layoutIndex: number[];
    layout: any[];
    isFlexItem: boolean;
    constructor(jsf: JsonSchemaFormService);
    removeItem(item: any): void;
    getFlexAttribute(node: any, attribute: string): any;
    showWidget(layoutNode: any): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<FlexLayoutRootComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FlexLayoutRootComponent, "flex-layout-root-widget", never, { "dataIndex": { "alias": "dataIndex"; "required": false; }; "layoutIndex": { "alias": "layoutIndex"; "required": false; }; "layout": { "alias": "layout"; "required": false; }; "isFlexItem": { "alias": "isFlexItem"; "required": false; }; }, {}, never, never, false, never>;
}
