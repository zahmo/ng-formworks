import { OnInit } from '@angular/core';
import { JsonSchemaFormService } from '@ng-formworks/core';
import * as i0 from "@angular/core";
export declare class MaterialTabsComponent implements OnInit {
    private jsf;
    options: any;
    itemCount: number;
    selectedItem: number;
    showAddTab: boolean;
    layoutNode: any;
    layoutIndex: number[];
    dataIndex: number[];
    constructor(jsf: JsonSchemaFormService);
    ngOnInit(): void;
    select(index: any): void;
    updateControl(): void;
    setTabTitle(item: any, index: number): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MaterialTabsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MaterialTabsComponent, "material-tabs-widget", never, { "layoutNode": { "alias": "layoutNode"; "required": false; }; "layoutIndex": { "alias": "layoutIndex"; "required": false; }; "dataIndex": { "alias": "dataIndex"; "required": false; }; }, {}, never, never, false, never>;
}
