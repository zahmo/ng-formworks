import { OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '@ng-formworks/core';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
export declare class MaterialButtonComponent implements OnInit, OnDestroy {
    private jsf;
    formControl: AbstractControl;
    controlName: string;
    controlValue: any;
    controlDisabled: boolean;
    boundControl: boolean;
    options: any;
    layoutNode: any;
    layoutIndex: number[];
    dataIndex: number[];
    isValidChangesSubs: Subscription;
    constructor(jsf: JsonSchemaFormService);
    ngOnDestroy(): void;
    ngOnInit(): void;
    updateValue(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MaterialButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MaterialButtonComponent, "material-button-widget", never, { "layoutNode": { "alias": "layoutNode"; "required": false; }; "layoutIndex": { "alias": "layoutIndex"; "required": false; }; "dataIndex": { "alias": "dataIndex"; "required": false; }; }, {}, never, never, false, never>;
}
