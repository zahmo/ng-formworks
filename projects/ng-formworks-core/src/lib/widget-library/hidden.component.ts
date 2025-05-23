import { AbstractControl } from '@angular/forms';
import { Component, OnInit, input, inject } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'hidden-widget',
    template: `
    <input *ngIf="boundControl"
      [formControl]="formControl"
      [id]="'control' + layoutNode()?._id"
      [name]="controlName"
      type="hidden">
    <input *ngIf="!boundControl"
      [disabled]="controlDisabled"
      [name]="controlName"
      [id]="'control' + layoutNode()?._id"
      type="hidden"
      [value]="controlValue">`,
    standalone: false
})
export class HiddenComponent implements OnInit {
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
}
