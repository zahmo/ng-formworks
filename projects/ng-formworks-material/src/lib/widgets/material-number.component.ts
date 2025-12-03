import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { JsonSchemaFormService } from '@ng-formworks/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'material-number-widget',
    template: `
    <mat-form-field [appearance]="options?.appearance || matFormFieldDefaultOptions?.appearance || 'fill'"
      [class]="options?.htmlClass || ''"
      [floatLabel]="options?.floatLabel || matFormFieldDefaultOptions?.floatLabel || (options?.notitle ? 'never' : 'auto')"
      [hideRequiredMarker]="options?.hideRequired ? 'true' : 'false'"
      [style.width]="'100%'">
      @if (!options?.notitle) {
        <mat-label>{{layoutNode().options?.title}}</mat-label>
      }
      @if (options?.prefix || options?.fieldAddonLeft) {
        <span matPrefix
        [innerHTML]="options?.prefix || options?.fieldAddonLeft"></span>
      }
      @if (boundControl) {
        <input matInput
          [formControl]="formControl"
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.max]="options?.maximum"
          [attr.min]="options?.minimum"
          [attr.step]="options?.multipleOf || options?.step || 'any'"
          [id]="'control' + layoutNode()?._id"
          [name]="controlName"
          [placeholder]="options?.notitle ? options?.placeholder : layoutNode().options?.title"
          [readonly]="options?.readonly ? 'readonly' : null"
          [required]="options?.required"
          [style.width]="'100%'"
          [type]="'number'"
          (blur)="options.showErrors = true"
          [attributes]="inputAttributes"
          [appStopPropagation]="['mousedown', 'touchstart']"
          >
      }
      @if (!boundControl) {
        <input matInput
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.max]="options?.maximum"
          [attr.min]="options?.minimum"
          [attr.step]="options?.multipleOf || options?.step || 'any'"
          [disabled]="controlDisabled"
          [id]="'control' + layoutNode()?._id"
          [name]="controlName"
          [placeholder]="options?.notitle ? options?.placeholder : layoutNode().options?.title"
          [readonly]="options?.readonly ? 'readonly' : null"
          [required]="options?.required"
          [style.width]="'100%'"
          [type]="'number'"
          [value]="controlValue"
          (input)="updateValue($event)"
          (blur)="options.showErrors = true"
          [attributes]="inputAttributes"
          [appStopPropagation]="['mousedown', 'touchstart']"
          >
      }
      @if (options?.suffix || options?.fieldAddonRight) {
        <span matSuffix
        [innerHTML]="options?.suffix || options?.fieldAddonRight"></span>
      }
      @if (layoutNode()?.type === 'range') {
        <mat-hint align="start"
        [innerHTML]="controlValue"></mat-hint>
      }
      @if (options?.description && (!options?.showErrors || !options?.errorMessage)) {
        <mat-hint
        align="end" [innerHTML]="options?.description"></mat-hint>
      }
    </mat-form-field>
    @if (options?.showErrors && options?.errorMessage) {
      <mat-error
      [innerHTML]="options?.errorMessage"></mat-error>
    }`,
    styles: [`
    mat-error { font-size: 75%; margin-top: -1rem; margin-bottom: 0.5rem; }
    ::ng-deep json-schema-form mat-form-field .mat-mdc-form-field-wrapper .mat-form-field-flex
      .mat-form-field-infix { width: initial; }
  `],
    standalone: false
})
export class MaterialNumberComponent implements OnInit,OnDestroy {
  matFormFieldDefaultOptions = inject(MAT_FORM_FIELD_DEFAULT_OPTIONS, { optional: true });
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  allowNegative = true;
  allowDecimal = true;
  allowExponents = false;
  lastValidNumber = '';
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
    if (this.layoutNode().dataType === 'integer') { this.allowDecimal = false; }
    if (!this.options.notitle && !this.options.description && this.options.placeholder) {
      this.options.description = this.options.placeholder;
    }
  }

  updateValue(event) {
    this.jsf.updateValue(this, event.target.value);
  }

  ngOnDestroy () {
    this.jsf.updateValue(this, null);
  }

}
