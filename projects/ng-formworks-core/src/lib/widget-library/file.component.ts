import { AbstractControl } from '@angular/forms';
import { Component, OnInit, input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';


// TODO: Add this control

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'file-widget',
  template: ``,
})
export class FileComponent implements OnInit {
  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  constructor(
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.jsf.initializeControl(this);
  }

  updateValue(event) {
    this.jsf.updateValue(this, event.target.value);
  }
}
