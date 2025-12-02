import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService, buildTitleMap } from '@ng-formworks/core';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'material-button-group-widget',
    template: `
    <div [class]="options?.htmlClass || ''">
      <div class="button-group-container">
        <div *ngIf="options?.title" class="button-group-label-container">
          <label
            [attr.for]="'control' + layoutNode()?._id"
            [class]="options?.labelHtmlClass || 'mat-label-medium'"
            [style.display]="options?.notitle ? 'none' : ''"
            [innerHTML]="layoutNode().options?.title"></label>
        </div>
        <mat-button-toggle-group
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.readonly]="options?.readonly ? 'readonly' : null"
          [attr.required]="options?.required"
          [ngClass]="{ 'required-pending-button-group': options?.required && controlValue == null }"
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
      </div>
      <mat-error *ngIf="options?.showErrors && options?.errorMessage"
        [innerHTML]="options?.errorMessage"></mat-error>
    </div>`,
    styles: [`
      mat-error { font-size: 75%; }

      .button-group-container {
        width: 100%;
        margin-bottom: 1.5rem;
      }

      .button-group-label-container {
        margin-bottom: 0.75rem;
      }

      /* Keep button group in a single horizontal row; Angular Material will
         handle vertical stacking when [vertical] is true. */
      .button-group-container .mat-button-toggle-group {
        display: inline-flex;
        flex-wrap: nowrap;
        max-width: 100%;
      }

      /* Subtle highlight for required but empty button group */
      .required-pending-button-group {
        background-color: rgba(255, 193, 7, 0.08);
      }
    `],
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
