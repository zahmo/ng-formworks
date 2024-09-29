import { OnInit } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';
import * as i0 from "@angular/core";
export declare class MessageComponent implements OnInit {
    private jsf;
    options: any;
    message: string;
    layoutNode: any;
    layoutIndex: number[];
    dataIndex: number[];
    constructor(jsf: JsonSchemaFormService);
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MessageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MessageComponent, "message-widget", never, { "layoutNode": { "alias": "layoutNode"; "required": false; }; "layoutIndex": { "alias": "layoutIndex"; "required": false; }; "dataIndex": { "alias": "dataIndex"; "required": false; }; }, {}, never, never, false, never>;
}
