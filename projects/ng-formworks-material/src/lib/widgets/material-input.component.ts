import { Component, ElementRef, OnInit, inject, input, viewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { JsonSchemaFormService } from '@ng-formworks/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'material-input-widget',
    template: `
    <mat-form-field [appearance]="options?.appearance || matFormFieldDefaultOptions?.appearance || 'fill'"
      [class]="options?.htmlClass || ''"
      [floatLabel]="options?.floatLabel || matFormFieldDefaultOptions?.floatLabel || (options?.notitle ? 'never' : 'auto')"
      [hideRequiredMarker]="options?.hideRequired ? 'true' : 'false'"
      [style.width]="'100%'">
      <mat-label *ngIf="!options?.notitle">{{options?.title}}</mat-label>
      <span matPrefix *ngIf="options?.prefix || options?.fieldAddonLeft"
        [innerHTML]="options?.prefix || options?.fieldAddonLeft"></span>
      <input #input matInput *ngIf="boundControl"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [attr.list]="'control' + layoutNode()?._id + 'Autocomplete'"
        [attr.maxlength]="options?.maxLength"
        [attr.minlength]="options?.minLength"
        [attr.pattern]="options?.pattern"
        [readonly]="options?.readonly ? 'readonly' : null"
        [id]="'control' + layoutNode()?._id"
        [name]="controlName"
        [placeholder]="options?.notitle ? options?.placeholder : options?.title"
        [required]="options?.required"
        [type]="layoutNode()?.type"
        (blur)="options.showErrors = true"
        [attributes]="options?.inputAttributes">
      <input #input matInput *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [attr.list]="'control' + layoutNode()?._id + 'Autocomplete'"
        [attr.maxlength]="options?.maxLength"
        [attr.minlength]="options?.minLength"
        [attr.pattern]="options?.pattern"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode()?._id"
        [name]="controlName"
        [placeholder]="options?.notitle ? options?.placeholder : options?.title"
        [readonly]="options?.readonly ? 'readonly' : null"
        [required]="options?.required"
        [type]="layoutNode()?.type"
        [value]="controlValue"
        (input)="updateValue($event)"
        (blur)="options.showErrors = true"
        [attributes]="options?.inputAttributes"
        >
      <span matSuffix *ngIf="options?.suffix || options?.fieldAddonRight"
        [innerHTML]="options?.suffix || options?.fieldAddonRight"></span>
      <mat-hint *ngIf="options?.description && (!options?.showErrors || !options?.errorMessage)"
        align="end" [innerHTML]="options?.description"></mat-hint>
      <mat-autocomplete *ngIf="options?.typeahead?.source">
        <mat-option *ngFor="let word of options?.typeahead?.source"
          [value]="word">{{word}}</mat-option>
      </mat-autocomplete>
        <button *ngIf="layoutNode()?.type=='datetime-local'" (click)="input()?.nativeElement?.showPicker()" mat-icon-button matIconSuffix>
          <mat-icon>calendar_today</mat-icon>
        </button>
    </mat-form-field>
    <mat-error *ngIf="options?.showErrors && options?.errorMessage"
      [innerHTML]="options?.errorMessage"></mat-error>`,
    styles: [`
    mat-error { font-size: 75%; margin-top: -1rem; margin-bottom: 0.5rem; }
    ::ng-deep json-schema-form mat-form-field .mat-mdc-form-field-wrapper .mat-form-field-flex
      .mat-form-field-infix { width: initial; }
      input {width:100%;}
      /*width of 120% for type 'datetime-local' to hide firefox picker*/ 
      input[type='datetime-local'] {width:120%;}
  `],
    standalone: false
})
export class MaterialInputComponent implements OnInit {
  matFormFieldDefaultOptions = inject(MAT_FORM_FIELD_DEFAULT_OPTIONS, { optional: true });
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

  
  readonly input = viewChild<ElementRef>('input');

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.jsf.initializeControl(this);
    if (!this.options.notitle && !this.options.description && this.options.placeholder) {
      this.options.description = this.options.placeholder;
    }
  }

  updateValue(event) {
    this.jsf.updateValue(this, event.target.value);
  }
}
