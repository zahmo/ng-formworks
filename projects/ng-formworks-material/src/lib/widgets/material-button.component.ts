import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService, hasOwn } from '@ng-formworks/core';
import { Subscription } from 'rxjs';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'material-button-widget',
    template: `
    <div class="button-row" [class]="options?.htmlClass || ''">
      <button mat-raised-button
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [color]="options?.color || 'primary'"
        [disabled]="controlDisabled || options?.readonly"
        [id]="'control' + layoutNode()?._id"
        [name]="controlName"
        [type]="layoutNode()?.type"
        [value]="controlValue"
        (click)="updateValue($event)"
        [appStopPropagation]="['mousedown', 'touchstart']"
        >
        @if (options?.icon) {
          <mat-icon class="mat-24">{{options?.icon}}</mat-icon>
        }
        @if (options?.title) {
          <span [innerHTML]="layoutNode().options?.title"></span>
        }
      </button>
    </div>`,
    styles: [` button { margin-top: 10px; } `],
    standalone: false
})
export class MaterialButtonComponent implements OnInit,OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  isValidChangesSubs:Subscription;

  ngOnDestroy(): void {
    this.isValidChangesSubs?.unsubscribe();
    this.isValidChangesSubs=null;
    this.updateValue({target:{value:null}});
  }

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.jsf.initializeControl(this);
    if (hasOwn(this.options, 'disabled')) {
      this.controlDisabled = this.options.disabled;
    } else if (this.jsf.formOptions.disableInvalidSubmit) {
      this.controlDisabled = !this.jsf.isValid;
      this.jsf.isValidChanges.subscribe(isValid => this.controlDisabled = !isValid);
    }
  }

  updateValue(event) {
    if (typeof this.options.onClick === 'function') {
      this.options.onClick(event);
    } else {
      this.jsf.updateValue(this, event.target.value);
    }
  }

  
}
