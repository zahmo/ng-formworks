/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { ChangeDetectionStrategy, Component, input, OnInit } from '@angular/core';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { isStringControl, RankedTester, rankWith } from '@jsonforms/core';
import { NGFJsonFormsControl } from './ngf-jf-control';

@Component({
  selector: 'InputControlRendererCore',
  template: 
  `
  <!--
    <mat-form-field [ngStyle]="{ display: hidden ? 'none' : '' }">
      <mat-label>{{ label }}</mat-label>
      <input
        matInput
        [type]="getType()"
        (input)="onChange($event)"
        [id]="id"
        [formControl]="form"
        (focus)="focused = true"
        (focusout)="focused = false"
      />
      <mat-hint *ngIf="shouldShowUnfocusedDescription() || focused">{{
        description
      }}</mat-hint>
      <mat-error>{{ error }}</mat-error>
    </mat-form-field>
   --> 
   <label *ngIf="options?.title"
   [attr.for]="'control' + layoutNode?._id"
   [class]="options?.labelHtmlClass || ''"
   [style.display]="options?.notitle ? 'none' : ''"
   [innerHTML]="options?.title"></label>
 <input *ngIf="boundControl"
   [formControl]="getForm()"
   [attr.aria-describedby]="'control' + layoutNode?._id + 'Status'"
   [attr.list]="'control' + layoutNode?._id + 'Autocomplete'"
   [attr.maxlength]="options?.maxLength"
   [attr.minlength]="options?.minLength"
   [attr.max]="max"
   [attr.min]="min"
   [attr.pattern]="options?.pattern"
   [attr.placeholder]="options?.placeholder"
   [attr.required]="options?.required"
   [class]="options?.fieldHtmlClass || ''"
   [id]="id"
   [name]="controlName"
   [readonly]="options?.readonly ? 'readonly' : null"
   [type]="getType()"
   (focus)="focused = true"
   (focusout)="focused = false"
   (input)="onChange($event)"
   >
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: row;
      }
      mat-form-field {
        flex: 1 1 auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class InputControlRendererCore extends NGFJsonFormsControl implements OnInit {
  getContext(){
    return this.context()||this;
  }
  boundControl:boolean;
  controlName: string;
  options: any;
  min:number;
  max:number;
  autoCompleteList: string[] = [];
  layoutNode: any;
  readonly context = input<JsonFormsControl>(null);

  focused = false;
  override ngOnInit() {
    super.ngOnInit();
    let uischema=this.getContext().uischema;
    this.options = uischema?.options||{};
    this.options.fieldHtmlClass="form-control";
    let scopedSchema=this.getContext().scopedSchema;
    this.min = scopedSchema.minimum;
    this.max = scopedSchema.maximum;
  }


  getForm(){
    return this.getContext()?.form||this.form;
  }

  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
    this.controlName=this.label;
    this.boundControl=true;
  }
  /*
  override getEventValue = (event: any) =>{
    if(this.context()?.getEventValue){
      return this.context()?.getEventValue(event);
    }
    return event.target.value || undefined
  }
*/

  getType = (): string => {
    let uischema=this.getContext().uischema
    if (uischema.options && uischema.options['format']) {
      return uischema.options['format'];
    }
    let scopedSchema=this.getContext().scopedSchema;
    if (scopedSchema && scopedSchema.type) {
      switch (scopedSchema.type) {
          case 'integer':
            if(this.getContext().uischema?.options?.slider){
              return 'range'
            }
            if(scopedSchema["options"]?.slider){
              return 'range'
            }
            return 'number';
      }
    }
    if (scopedSchema && scopedSchema.format) {
      switch (scopedSchema.format) {
        case 'email':
          return 'email';
        case 'tel':
          return 'tel';
        case 'iso-date-time':
          return 'datetime-local'  
        case 'integer':
          return 'number'  
        default:
          return scopedSchema.format;
      }
    }
    return 'text';
  };
}
export const InputControlRendererCoreTester: RankedTester = rankWith(
  1,
  isStringControl
);
