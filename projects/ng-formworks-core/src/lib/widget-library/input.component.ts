import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'input-widget',
    template: `
    <div [class]="options?.htmlClass || ''" >
      <label *ngIf="options?.title"
        [attr.for]="'control' + layoutNode()?._id"
        [class]="options?.labelHtmlClass || ''"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></label>
      <input *ngIf="boundControl"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [attr.list]="'control' + layoutNode()?._id + 'Autocomplete'"
        [attr.maxlength]="options?.maxLength"
        [attr.minlength]="options?.minLength"
        [attr.pattern]="options?.pattern"
        [attr.placeholder]="options?.placeholder"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode()?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        [type]="layoutNode()?.type"
        [attributes]="inputAttributes"
        [appStopPropagation]="['mousedown', 'touchstart']"
        >
      <input *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [attr.list]="'control' + layoutNode()?._id + 'Autocomplete'"
        [attr.maxlength]="options?.maxLength"
        [attr.minlength]="options?.minLength"
        [attr.pattern]="options?.pattern"
        [attr.placeholder]="options?.placeholder"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode()?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        [type]="layoutNode()?.type"
        [value]="controlValue"
        (input)="updateValue($event)"
        [attributes]="inputAttributes"
        [appStopPropagation]="['mousedown', 'touchstart']"
        >
        <datalist *ngIf="options?.typeahead?.source"
          [id]="'control' + layoutNode()?._id + 'Autocomplete'">
          <option *ngFor="let word of options?.typeahead?.source" [value]="word">
        </datalist>
    </div>`,
    standalone: false
})
export class InputComponent implements OnInit, OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: string;
  controlDisabled = false;
  boundControl = false;
  options: any;
  autoCompleteList: string[] = [];
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  //needed as templates don't accept something like [attributes]="options?.['x-inputAttributes']"
  get inputAttributes() {
    return this.options?.['x-inputAttributes'];
  }

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.jsf.initializeControl(this);
  }

  updateValue(event) {
    this.jsf.updateValue(this, event.target.value);
  }

  ngOnDestroy () {
    this.jsf.updateValue(this, null);
  }

}
