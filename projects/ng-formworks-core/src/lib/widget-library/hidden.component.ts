import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'hidden-widget',
    template: `
    @if (boundControl) {
      <input
        [formControl]="formControl"
        [id]="'control' + layoutNode()?._id"
        [name]="controlName"
        type="hidden">
    }
    @if (!boundControl) {
      <input
        [disabled]="controlDisabled"
        [name]="controlName"
        [id]="'control' + layoutNode()?._id"
        type="hidden"
        [value]="controlValue">
    }`,
    standalone: false
})
export class HiddenComponent implements OnInit,OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  ngOnInit() {
    this.jsf.initializeControl(this);
  }

  ngOnDestroy () {
    this.jsf.updateValue(this, null);
  }

}
