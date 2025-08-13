import { Component, OnDestroy, OnInit, inject, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '@ng-formworks/core';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'material-slider-widget',
    template: `

    <mat-slider discrete *ngIf="boundControl"
      [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
      [id]="'control' + layoutNode()?._id"
      [max]="options?.maximum"
      [min]="options?.minimum"
      [step]="options?.multipleOf || options?.step || 'any'"
      [style.width]="'100%'"
      class="sortable-filter"
      (blur)="options.showErrors = true">
        <input matSliderThumb [formControl]="formControl" 
                [attributes]="inputAttributes"
                (mousedown)="onMouseDown($event)"
                (touchstart)="onTouchStart($event)"
                
        />
      </mat-slider>
    <mat-slider discrete *ngIf="!boundControl"
      [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
      [disabled]="controlDisabled || options?.readonly"
      [id]="'control' + layoutNode()?._id"
      [max]="options?.maximum"
      [min]="options?.minimum"
      [step]="options?.multipleOf || options?.step || 'any'"
      [style.width]="'100%'"
      class="sortable-filter"
      (blur)="options.showErrors = true" #ngSlider>
        <input matSliderThumb [value]="controlValue" 
        (change)="updateValue({source: ngSliderThumb, parent: ngSlider, value: ngSliderThumb.value})"
        #ngSliderThumb="matSliderThumb" 
                [attributes]="inputAttributes"
                (mousedown)="onMouseDown($event)"
                (touchstart)="onTouchStart($event)"

        />
    </mat-slider>
    <mat-error *ngIf="options?.showErrors && options?.errorMessage"
      [innerHTML]="options?.errorMessage"></mat-error>`,
    styles: [` mat-error { font-size: 75%; } `],
})
export class MaterialSliderComponent implements OnInit,OnDestroy {
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
    this.jsf.initializeControl(this, !this.options.readonly);
  }

  updateValue(event) {
    this.options.showErrors = true;
    this.jsf.updateValue(this, event.value);
  }

  ngOnDestroy () {
    this.jsf.updateValue(this, null);
  }

}
