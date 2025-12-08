import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../json-schema-form.service';

///NB issue caused by sortablejs when it its destroyed
//this mainly affects checkboxes coupled with conditions
//-the value is rechecked
//-see https://github.com/SortableJS/Sortable/issues/1052#issuecomment-369613072
//-switched to angular cdk for dnd
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'checkbox-widget',
    template: `
    <label
      [attr.for]="'control' + layoutNode()?._id"
      [class]="options?.itemLabelHtmlClass || ''">
      @if (boundControl) {
        <input
          [formControl]="formControl"
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [class]="(options?.fieldHtmlClass || '') + (isChecked ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + (options?.style?.unselected || '')))"
          [id]="'control' + layoutNode()?._id"
          [name]="controlName"
          [readonly]="options?.readonly ? 'readonly' : null"
          type="checkbox">
      }
      @if (!boundControl) {
        <input
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [checked]="isChecked"
        [class]="(options?.fieldHtmlClass || '') + (isChecked ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + (options?.style?.unselected || '')))"
          [disabled]="controlDisabled"
          [id]="'control' + layoutNode()?._id"
          [name]="controlName"
          [readonly]="options?.readonly ? 'readonly' : null"
          [value]="controlValue"
          type="checkbox"
          (change)="updateValue($event)">
      }
      @if (options?.title) {
        <span
          [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></span>
      }
    </label>`,
    standalone: false
})
export class CheckboxComponent implements OnInit,OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  trueValue: any = true;
  falseValue: any = false;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.jsf.initializeControl(this);
    if (this.controlValue === null || this.controlValue === undefined) {
      this.controlValue = false;
      this.jsf.updateValue(this, this.falseValue);
    }
  }

  updateValue(event) {
    event.preventDefault();
    this.jsf.updateValue(this, event.target.checked ? this.trueValue : this.falseValue);
  }

  get isChecked() {
    return this.jsf.getFormControlValue(this) === this.trueValue;
  }

  ngOnDestroy () {
    this.jsf.updateValue(this, null);
  }

}
