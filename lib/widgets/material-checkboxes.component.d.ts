import { OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService, TitleMapItem } from '@ng-formworks/core';
import * as i0 from "@angular/core";
export declare class MaterialCheckboxesComponent implements OnInit {
    private jsf;
    formControl: AbstractControl;
    controlName: string;
    controlValue: any;
    controlDisabled: boolean;
    boundControl: boolean;
    options: any;
    horizontalList: boolean;
    formArray: AbstractControl;
    checkboxList: TitleMapItem[];
    layoutNode: any;
    layoutIndex: number[];
    dataIndex: number[];
    constructor(jsf: JsonSchemaFormService);
    ngOnInit(): void;
    get allChecked(): boolean;
    get someChecked(): boolean;
    updateValue(): void;
    updateAllValues(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MaterialCheckboxesComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MaterialCheckboxesComponent, "material-checkboxes-widget", never, { "layoutNode": { "alias": "layoutNode"; "required": false; }; "layoutIndex": { "alias": "layoutIndex"; "required": false; }; "dataIndex": { "alias": "dataIndex"; "required": false; }; }, {}, never, never, false, never>;
}
