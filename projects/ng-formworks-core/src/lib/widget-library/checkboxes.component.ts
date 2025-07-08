import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService, TitleMapItem } from '../json-schema-form.service';
import { buildTitleMap } from '../shared';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'checkboxes-widget',
  template: `
    <label *ngIf="options?.title"
      [class]="options?.labelHtmlClass || ''"
      [style.display]="options?.notitle ? 'none' : ''"
      [innerHTML]="options?.title"></label>

    <!-- 'horizontal' = checkboxes-inline or checkboxbuttons -->
    <div *ngIf="layoutOrientation === 'horizontal'" [class]="options?.htmlClass || ''">
      <label *ngFor="let checkboxItem of checkboxList"
        [attr.for]="'control' + layoutNode()?._id + '/' + checkboxItem.value"
        [class]="(options?.itemLabelHtmlClass || '') + (checkboxItem.checked ?
          (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
          (' ' + (options?.style?.unselected || '')))">
        <input type="checkbox"
          [attr.required]="options?.required"
          [checked]="checkboxItem.checked"
          [class]="options?.fieldHtmlClass || ''"
          [disabled]="controlDisabled"
          [id]="'control' + layoutNode()?._id + '/' + checkboxItem.value"
          [name]="checkboxItem?.name"
          [readonly]="options?.readonly ? 'readonly' : null"
          [value]="checkboxItem.value"
          (change)="updateValue($event)">
        <span [innerHTML]="checkboxItem.name"></span>
      </label>
    </div>

    <!-- 'vertical' = regular checkboxes -->
    <div *ngIf="layoutOrientation === 'vertical'">
      <div *ngFor="let checkboxItem of checkboxList" [class]="options?.htmlClass || ''">
        <label
          [attr.for]="'control' + layoutNode()?._id + '/' + checkboxItem.value"
          [class]="(options?.itemLabelHtmlClass || '') + (checkboxItem.checked ?
            (' ' + (options?.activeClass || '') + ' ' + (options?.style?.selected || '')) :
            (' ' + (options?.style?.unselected || '')))">
          <input type="checkbox"
            [attr.required]="options?.required"
            [checked]="checkboxItem.checked"
            [class]="options?.fieldHtmlClass || ''"
            [disabled]="controlDisabled"
            [id]="options?.name + '/' + checkboxItem.value"
            [name]="checkboxItem?.name"
            [readonly]="options?.readonly ? 'readonly' : null"
            [value]="checkboxItem.value"
            (change)="updateValue($event)">
          <span [innerHTML]="checkboxItem?.name"></span>
        </label>
      </div>
    </div>`,
})
export class CheckboxesComponent implements OnInit,OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  layoutOrientation: string;
  formArray: AbstractControl;
  checkboxList: TitleMapItem[] = [];
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    const layoutNode = this.layoutNode();
    this.layoutOrientation = (layoutNode.type === 'checkboxes-inline' ||
      layoutNode.type === 'checkboxbuttons') ? 'horizontal' : 'vertical';
    this.jsf.initializeControl(this);
    this.checkboxList = buildTitleMap(
      this.options.titleMap || this.options.enumNames, this.options.enum, true
    );
    if (this.boundControl) {
      const formArray = this.jsf.getFormControl(this);
      this.checkboxList.forEach(checkboxItem =>
        checkboxItem.checked = formArray.value.includes(checkboxItem.value)
      );
    }
  }

  updateValue(event) {
    for (const checkboxItem of this.checkboxList) {
      if (event.target.value === checkboxItem.value) {
        checkboxItem.checked = event.target.checked;
      }
    }
    if (this.boundControl) {
      this.jsf.updateArrayCheckboxList(this, this.checkboxList);
    }
  }

  //TODO review this
  ngOnDestroy () {
        //this.jsf.updateValue(this, null);
        let nullVal=[];
        this.formControl.reset(nullVal)
        this.controlValue=null;
  }

}
