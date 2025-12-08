import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { JsonSchemaFormService, buildTitleMap, isArray } from '@ng-formworks/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'material-select-widget',
  template: `
    <mat-form-field
      [appearance]="options?.appearance || matFormFieldDefaultOptions?.appearance || 'fill'"
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
      }
      @if (boundControl && !options?.multiple) {
        <mat-select
          [formControl]="formControl"
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.name]="controlName"
          [id]="'control' + layoutNode()?._id"
          [multiple]="options?.multiple"
          [placeholder]="options?.notitle ? options?.placeholder : layoutNode().options?.title"
          [required]="options?.required"
          [style.width]="'100%'"
          (blur)="options.showErrors = true"
          (selectionChange)="updateValue($event)">
          @for (selectItem of selectList; track selectItem) {
            @if (!isArray(selectItem?.items)) {
              <mat-option
                [value]="selectItem?.value">
                <span [innerHTML]="selectItem?.name"></span>
              </mat-option>
            }
            @if (isArray(selectItem?.items)) {
              <mat-optgroup
                [label]="selectItem?.group">
                @for (subItem of selectItem.items; track subItem) {
                  <mat-option
                    [value]="subItem?.value">
                    <span [innerHTML]="subItem?.name"></span>
                  </mat-option>
                }
              </mat-optgroup>
            }
          }
        </mat-select>
      }
      @if (!boundControl) {
        <mat-select
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.name]="controlName"
          [disabled]="controlDisabled || options?.readonly"
          [id]="'control' + layoutNode()?._id"
          [multiple]="options?.multiple"
          [placeholder]="options?.notitle ? options?.placeholder : layoutNode().options?.title"
          [required]="options?.required"
          [style.width]="'100%'"
          [value]="controlValue"
          (blur)="options.showErrors = true"
          (change)="updateValue($event)">
          @for (selectItem of selectList; track selectItem) {
            @if (!isArray(selectItem?.items)) {
              <mat-option
                [attr.selected]="selectItem?.value === controlValue"
                [value]="selectItem?.value">
                <span [innerHTML]="selectItem?.name"></span>
              </mat-option>
            }
            @if (isArray(selectItem?.items)) {
              <mat-optgroup
                [label]="selectItem?.group">
                @for (subItem of selectItem.items; track subItem) {
                  <mat-option
                    [attr.selected]="subItem?.value === controlValue"
                    [value]="subItem?.value">
                    <span [innerHTML]="subItem?.name"></span>
                  </mat-option>
                }
              </mat-optgroup>
            }
          }
        </mat-select>
      }
      @if (boundControl && options?.multiple) {
        <mat-select
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.name]="controlName"
          [disabled]="controlDisabled || options?.readonly"
          [id]="'control' + layoutNode()?._id"
          [multiple]="options?.multiple"
          [placeholder]="options?.notitle ? options?.placeholder : layoutNode().options?.title"
          [required]="options?.required"
          [style.width]="'100%'"
          [value]="controlValue"
          (blur)="options.showErrors = true"
          (selectionChange)="updateValue($event)">
          @for (selectItem of selectList; track selectItem) {
            @if (!isArray(selectItem?.items)) {
              <mat-option
                [attr.selected]="selectItem?.value === controlValue"
                [value]="selectItem?.value">
                <span [innerHTML]="selectItem?.name"></span>
              </mat-option>
            }
            @if (isArray(selectItem?.items)) {
              <mat-optgroup
                [label]="selectItem?.group">
                @for (subItem of selectItem.items; track subItem) {
                  <mat-option
                    [attr.selected]="subItem?.value === controlValue"
                    [value]="subItem?.value">
                    <span [innerHTML]="subItem?.name"></span>
                  </mat-option>
                }
              </mat-optgroup>
            }
          }
        </mat-select>
      }
      @if (options?.suffix || options?.fieldAddonRight) {
        <span matSuffix
        [innerHTML]="options?.suffix || options?.fieldAddonRight"></span>
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
export class MaterialSelectComponent implements OnInit, OnDestroy {
  matFormFieldDefaultOptions = inject(MAT_FORM_FIELD_DEFAULT_OPTIONS, { optional: true });
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  selectList: any[] = [];
  selectListFlatGroup: any[] = [];
  isArray = isArray;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.selectList = buildTitleMap(
      this.options.titleMap || this.options.enumNames,
      this.options.enum, !!this.options.required, !!this.options.flatList
    );
    //the selectListFlatGroup array will be used to update the formArray values
    //while the selectList array will be bound to the form select
    //as either a grouped select or a flat select
    this.selectListFlatGroup = buildTitleMap(
      this.options.titleMap || this.options.enumNames,
      this.options.enum, !!this.options.required, true
    )
    this.jsf.initializeControl(this, !this.options.readonly);
    if (!this.options.notitle && !this.options.description && this.options.placeholder) {
      this.options.description = this.options.placeholder;
    }
  }

  deselectAll() {
    this.selectListFlatGroup.forEach(selItem => {
      selItem.checked = false;
    })
  }



  updateValue(event) {

    this.options.showErrors = true;
    if (this.options.multiple) {
      if (event.value.includes(null)) {
        this.deselectAll();
        //this.control.setValue([]);  // Reset the form control to an empty array
        //this.selectList=JSON.parse(JSON.stringify(this.selectList));
        this.jsf.updateArrayMultiSelectList(this, []);
      } else {
        this.selectListFlatGroup.forEach(selItem => {
          selItem.checked = event.value.indexOf(selItem.value) >= 0 ? true : false;
        })
        this.jsf.updateArrayMultiSelectList(this, this.selectListFlatGroup);
      }
      return;
    }
    this.jsf.updateValue(this, event.value);
  }

  ngOnDestroy() {
    let nullVal=this.options.multiple?[null]:null;
    this.formControl.reset(nullVal)
    this.controlValue=null;
  }
}
