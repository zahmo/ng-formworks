import { AbstractControl } from '@angular/forms';
import { Component, OnInit, input, inject } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'button-widget',
    template: `
    <div
      [class]="options?.htmlClass || ''">
      <button
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [class]="options?.fieldHtmlClass || ''"
        [disabled]="controlDisabled"
        [name]="controlName"
        [type]="layoutNode()?.type"
        [value]="controlValue"
        (click)="updateValue($event)">
        <span *ngIf="options?.icon || options?.title"
          [class]="options?.icon"
          [innerHTML]="options?.title"></span>
      </button>
    </div>`,
    standalone: false
})
export class ButtonComponent implements OnInit {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.jsf.initializeControl(this);
  }

  updateValue(event) {
    if (typeof this.options.onClick === 'function') {
      this.options.onClick(event);
    } else {
      this.jsf.updateValue(this, event.target.value);
    }
  }
}
