import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { buildTitleMap, isArray } from '../shared';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-widget',
  template: `
    <div
      [class]="options?.htmlClass || ''">
      <label *ngIf="options?.title"
        [attr.for]="'control' + layoutNode()?._id"
        [class]="options?.labelHtmlClass || ''"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></label>
      <select *ngIf="boundControl && !options?.multiple"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode()?._id"
        [name]="controlName">
        <ng-template ngFor let-selectItem [ngForOf]="selectList">
          <option *ngIf="!isArray(selectItem?.items)"
            [value]="selectItem?.value">
            <span [innerHTML]="selectItem?.name"></span>
          </option>
          <optgroup *ngIf="isArray(selectItem?.items)"
            [label]="selectItem?.group">
            <option *ngFor="let subItem of selectItem.items"
              [value]="subItem?.value">
              <span [innerHTML]="subItem?.name"></span>
            </option>
          </optgroup>
        </ng-template>
      </select>
      <select *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode()?._id"
        [name]="controlName"
        (change)="updateValue($event)">
        <ng-template ngFor let-selectItem [ngForOf]="selectList">
          <option *ngIf="!isArray(selectItem?.items)"
            [selected]="selectItem?.value === controlValue"
            [value]="selectItem?.value">
            <span [innerHTML]="selectItem?.name"></span>
          </option>
          <optgroup *ngIf="isArray(selectItem?.items)"
            [label]="selectItem?.group">
            <option *ngFor="let subItem of selectItem.items"
              [attr.selected]="subItem?.value === controlValue"
              [value]="subItem?.value">
              <span [innerHTML]="subItem?.name"></span>
            </option>
          </optgroup>
        </ng-template>
      </select>
      <select *ngIf="boundControl && options?.multiple"
        [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [class]="options?.fieldHtmlClass || ''"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode()?._id"
        [multiple]="options?.multiple"
        [name]="controlName"
        [(ngModel)]="controlValue"
        (change)="updateValue($event)">
        <ng-template ngFor let-selectItem [ngForOf]="selectList">
          <option *ngIf="!isArray(selectItem?.items)"
            [selected]="selectItem?.value === controlValue"
            [value]="selectItem?.value">
            <span [innerHTML]="selectItem?.name"></span>
          </option>
          <optgroup *ngIf="isArray(selectItem?.items)"
            [label]="selectItem?.group">
            <option *ngFor="let subItem of selectItem.items"
              [attr.selected]="subItem?.value === controlValue"
              [value]="subItem?.value">
              <span [innerHTML]="subItem?.name"></span>
            </option>
          </optgroup>
        </ng-template>
      </select>
    </div>`,
  standalone: false
})
export class SelectComponent implements OnInit, OnDestroy {
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
    this.jsf.initializeControl(this);
  }

  deselectAll() {
    this.selectListFlatGroup.forEach(selItem => {
      selItem.checked = false;
    })
  }

  updateValue(event) {
    this.options.showErrors = true;
    if (this.options.multiple) {
      if (this.controlValue?.includes(null)) {
        this.deselectAll();
        //this.control.setValue([]);  // Reset the form control to an empty array
        //this.selectList=JSON.parse(JSON.stringify(this.selectList));
        this.jsf.updateArrayMultiSelectList(this, []);
      } else {
        this.selectListFlatGroup.forEach(selItem => {
          selItem.checked = this.controlValue?.indexOf(selItem.value) >= 0 ? true : false;
        })
        this.jsf.updateArrayMultiSelectList(this, this.selectListFlatGroup);
      }
      return;
    }
    this.jsf.updateValue(this, this.controlValue);
  }

  ngOnDestroy() {
    let nullVal=this.options.multiple?[null]:null;
    this.formControl.reset(nullVal)
    this.controlValue=null;
  }
}
