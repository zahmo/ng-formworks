import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService, buildTitleMap } from '@ng-formworks/core';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'material-button-group-widget',
    template: `
    <div>
      <div *ngIf="options?.title">
        <label
          [attr.for]="'control' + layoutNode()?._id"
          [class]="options?.labelHtmlClass || ''"
          [style.display]="options?.notitle ? 'none' : ''"
          [innerHTML]="layoutNode().options?.title"></label>
      </div>
      <mat-button-toggle-group
        [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
        [attr.readonly]="options?.readonly ? 'readonly' : null"
        [attr.required]="options?.required"
        [disabled]="controlDisabled || options?.readonly"
        [name]="controlName"
        [value]="controlValue"
        [vertical]="!!options.vertical">
        <mat-button-toggle *ngFor="let radioItem of radiosList"
          [id]="'control' + layoutNode()?._id + '/' + radioItem?.name"
          [value]="radioItem?.value"
          (click)="updateValue(radioItem?.value)">
          <span [innerHTML]="radioItem?.name"></span>
        </mat-button-toggle>
      </mat-button-toggle-group>
      <mat-error *ngIf="options?.showErrors && options?.errorMessage"
        [innerHTML]="options?.errorMessage"></mat-error>
    </div>`,
    styles: [` mat-error { font-size: 75%; } `],
    standalone: false
})
export class MaterialButtonGroupComponent implements OnInit,OnDestroy {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  radiosList: any[] = [];
  vertical = false;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.radiosList = buildTitleMap(
      this.options.titleMap || this.options.enumNames,
      this.options.enum, true
    );
    this.jsf.initializeControl(this);
  }

  updateValue(value) {
    this.options.showErrors = true;
    this.jsf.updateValue(this, value);
  }
  ngOnDestroy () {
    this.jsf.updateValue(this, null);
  }
}
