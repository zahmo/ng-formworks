import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { JsonSchemaFormService } from '../json-schema-form.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'number-widget',
    template: `
    <div #divElt [class]="options?.htmlClass || ''" class="sortable-filter" >
      <label *ngIf="options?.title"
        [attr.for]="'control' + layoutNode()?._id"
        [class]="options?.labelHtmlClass || ''"
        [style.display]="options?.notitle ? 'none' : ''"
        [innerHTML]="options?.title"></label>
      <input #inputControl *ngIf="boundControl"
        [formControl]="formControl"
        [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [attr.max]="options?.maximum"
        [attr.min]="options?.minimum"
        [attr.placeholder]="options?.placeholder"
        [attr.required]="options?.required"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.step]="options?.multipleOf || options?.step || 'any'"
        [class]="options?.fieldHtmlClass || ''"
        [id]="'control' + layoutNode()?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        [title]="lastValidNumber"
        [type]="layoutNode()?.type === 'range' ? 'range' : 'number'"
        [attributes]="inputAttributes"
        (mousedown)="onMouseDown($event)"
        (touchstart)="onTouchStart($event)"
        >
      <input #inputControl *ngIf="!boundControl"
        [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [attr.max]="options?.maximum"
        [attr.min]="options?.minimum"
        [attr.placeholder]="options?.placeholder"
        [attr.required]="options?.required"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.step]="options?.multipleOf || options?.step || 'any'"
        [class]="options?.fieldHtmlClass || ''"
        [disabled]="controlDisabled"
        [id]="'control' + layoutNode()?._id"
        [name]="controlName"
        [readonly]="options?.readonly ? 'readonly' : null"
        [title]="lastValidNumber"
        [type]="layoutNode()?.type === 'range' ? 'range' : 'number'"
        [value]="controlValue"
        (input)="updateValue($event)"
        [attributes]="inputAttributes"
        (mousedown)="onMouseDown($event)"
        (touchstart)="onTouchStart($event)"
        >
      <span *ngIf="layoutNode()?.type === 'range'" [innerHTML]="controlValue"></span>
    </div>`,
    standalone: false
})
//TODO look at reusing InputComponent
export class NumberComponent implements OnInit,OnDestroy {
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
  @ViewChild('inputControl', {})
  inputControl: ElementRef;

  @ViewChild('divElt', {})
  div: ElementRef;

    //TODO review:stopPropagation used as a workaround 
    //to prevent dragging onMouseDown and onTouchStart events
    onMouseDown(e){
      e.stopPropagation();
    }

    onTouchStart(e){
      e.stopPropagation();
    }  

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.jsf.initializeControl(this);
    if (this.layoutNode().dataType === 'integer') { this.allowDecimal = false; }
  }

  updateValue(event) {
    this.jsf.updateValue(this, event.target.value);
  }

  ngOnDestroy () {
    this.jsf.updateValue(this, null);
  }
  
}
