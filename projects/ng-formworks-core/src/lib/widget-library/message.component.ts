import { Component, OnInit, input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'message-widget',
  template: `
    <span *ngIf="message"
      [class]="options?.labelHtmlClass || ''"
      [innerHTML]="message"></span>`,
})
export class MessageComponent implements OnInit {
  options: any;
  message: string = null;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  constructor(
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.message = this.options.help || this.options.helpvalue ||
      this.options.msg || this.options.message;
  }
}
