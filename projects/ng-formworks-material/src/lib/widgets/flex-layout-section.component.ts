import { Component, inject, input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { JsonSchemaFormService } from '@ng-formworks/core';

@Component({
    selector: 'flex-layout-section-widget',
    template: `
    <div *ngIf="containerType === 'div'"
      [class]="options?.htmlClass || ''"
      [class.expandable]="options?.expandable && !expanded"
      [class.expanded]="options?.expandable && expanded">
      <label *ngIf="sectionTitle"
        [class]="'legend ' + (options?.labelHtmlClass || '')"
        [innerHTML]="sectionTitle"
        (click)="toggleExpanded()"></label>
      <flex-layout-root-widget 
        [layout]="layoutNode().items"
        [dataIndex]="dataIndex()"
        [layoutIndex]="layoutIndex()"
        [isFlexItem]="getFlexAttribute('is-flex')"
        [class.form-flex-column]="getFlexAttribute('flex-direction') === 'column'"
        [class.form-flex-row]="getFlexAttribute('flex-direction') === 'row'"
        [style.flex-direction]="getFlexAttribute('flex-direction')"
        [style.flex-wrap]="getFlexAttribute('flex-wrap')"
        [style.justify-content]="getFlexAttribute('justify-content')"
        [style.align-items]="getFlexAttribute('align-items')"
        [style.align-content]="getFlexAttribute('align-content')"
        [attr.fxLayout]="getFlexAttribute('layout')"
        [style.gap]="options?.fxLayoutGap"
        [attr.fxLayoutAlign]="options?.fxLayoutAlign"
        [attr.fxFlexFill]="options?.fxLayoutAlign"></flex-layout-root-widget>
      <mat-error *ngIf="options?.showErrors && options?.errorMessage"
        [innerHTML]="options?.errorMessage"></mat-error>
    </div>
    
    <fieldset *ngIf="containerType === 'fieldset'"
      [class]="options?.htmlClass || ''"
      [class.expandable]="options?.expandable && !expanded"
      [class.expanded]="options?.expandable && expanded"
      [disabled]="options?.readonly">
      <legend *ngIf="sectionTitle"
        [class]="'legend ' + (options?.labelHtmlClass || '')"
        [innerHTML]="sectionTitle"
        (click)="toggleExpanded()"></legend>
      <flex-layout-root-widget 
        [layout]="layoutNode().items"
        [dataIndex]="dataIndex()"
        [layoutIndex]="layoutIndex()"
        [isFlexItem]="getFlexAttribute('is-flex')"
        [class.form-flex-column]="getFlexAttribute('flex-direction') === 'column'"
        [class.form-flex-row]="getFlexAttribute('flex-direction') === 'row'"
        [style.flex-direction]="getFlexAttribute('flex-direction')"
        [style.flex-wrap]="getFlexAttribute('flex-wrap')"
        [style.justify-content]="getFlexAttribute('justify-content')"
        [style.align-items]="getFlexAttribute('align-items')"
        [style.align-content]="getFlexAttribute('align-content')"
        [attr.fxLayout]="getFlexAttribute('layout')"
        [attr.fxLayoutAlign]="options?.fxLayoutAlign"
        [style.gap]="options?.fxLayoutGap"
        [attr.attr.fxFlexFill]="options?.fxLayoutAlign"></flex-layout-root-widget>
      <mat-error *ngIf="options?.showErrors && options?.errorMessage"
        [innerHTML]="options?.errorMessage"></mat-error>
    </fieldset>

    <mat-card *ngIf="containerType === 'card'" appearance="outlined"
      [class.expandable]="options?.expandable && !expanded"
      [class.expanded]="options?.expandable && expanded"
      [style.margin]="'10px 0'"
      [ngClass]="options?.htmlClass || ''">
      <mat-card-header *ngIf="sectionTitle">
        <legend
          [class]="'legend ' + (options?.labelHtmlClass || '')"
          [innerHTML]="sectionTitle"
          (click)="toggleExpanded()"></legend>
      </mat-card-header>
      <mat-card-content >
        <fieldset [disabled]="options?.readonly">
          <flex-layout-root-widget 
            [layout]="layoutNode().items"
            [dataIndex]="dataIndex()"
            [layoutIndex]="layoutIndex()"
            [isFlexItem]="getFlexAttribute('is-flex')"
            [class.form-flex-column]="getFlexAttribute('flex-direction') === 'column'"
            [class.form-flex-row]="getFlexAttribute('flex-direction') === 'row'"
            [style.flex-direction]="getFlexAttribute('flex-direction')"
            [style.flex-wrap]="getFlexAttribute('flex-wrap')"
            [style.justify-content]="getFlexAttribute('justify-content')"
            [style.align-items]="getFlexAttribute('align-items')"
            [style.align-content]="getFlexAttribute('align-content')"
            [attr.fxLayout]="getFlexAttribute('layout')"
            [style.gap]="options?.fxLayoutGap"
            [attr.fxLayoutAlign]="options?.fxLayoutAlign"
            [attr.fxFlexFill]="options?.fxLayoutAlign"></flex-layout-root-widget>
          </fieldset>
      </mat-card-content>
      <mat-card-footer>
        <mat-error *ngIf="options?.showErrors && options?.errorMessage"
          [innerHTML]="options?.errorMessage"></mat-error>
      </mat-card-footer>
    </mat-card>

    <mat-expansion-panel *ngIf="containerType === 'expansion-panel'"
       [hideToggle]="!options?.expandable">
      <mat-expansion-panel-header>
        <mat-panel-title>
          <legend *ngIf="sectionTitle"
            [class]="options?.labelHtmlClass"
            [innerHTML]="sectionTitle"></legend>
        </mat-panel-title>
      </mat-expansion-panel-header>
      <fieldset>
        <flex-layout-root-widget 
          [layout]="layoutNode().items"
          [dataIndex]="dataIndex()"
          [layoutIndex]="layoutIndex()"
          [isFlexItem]="getFlexAttribute('is-flex')"
          [class.form-flex-column]="getFlexAttribute('flex-direction') === 'column'"
          [class.form-flex-row]="getFlexAttribute('flex-direction') === 'row'"
          [style.flex-direction]="getFlexAttribute('flex-direction')"
          [style.flex-wrap]="getFlexAttribute('flex-wrap')"
          [style.justify-content]="getFlexAttribute('justify-content')"
          [style.align-items]="getFlexAttribute('align-items')"
          [style.align-content]="getFlexAttribute('align-content')"
          [attr.fxLayout]="getFlexAttribute('layout')"
          [style.gap]="options?.fxLayoutGap"
          [attr.fxLayoutAlign]="options?.fxLayoutAlign"
          [attr.fxFlexFill]="options?.fxLayoutAlign"></flex-layout-root-widget>
      </fieldset>
      <mat-error *ngIf="options?.showErrors && options?.errorMessage"
        [innerHTML]="options?.errorMessage"></mat-error>
    </mat-expansion-panel>`,
    styleUrls: ['./flex-layout-section.component.scss'],
    standalone: false
})
export class FlexLayoutSectionComponent implements OnInit {
  private jsf = inject(JsonSchemaFormService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  expanded = true;
  expandable = true;
  containerType = 'div';
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  get sectionTitle() {
    return this.options.notitle ? null : this.jsf.setItemTitle(this);
  }

  ngOnInit() {
    this.jsf.initializeControl(this);
    this.options = this.layoutNode().options || {};
    this.expanded = typeof this.options.expanded === 'boolean' ?
      this.options.expanded : !this.options.expandable;
    switch (this.layoutNode().type) {
      case 'section': case 'array': case 'fieldset': case 'advancedfieldset':
      case 'authfieldset': case 'optionfieldset': case 'selectfieldset':
        this.containerType = 'fieldset';
        break;
      case 'card':
        this.containerType = 'card';
        break;
      case 'expansion-panel':
        this.containerType = 'expansion-panel';
        break;
      default: // 'div', 'flex', 'tab', 'conditional', 'actions'
        this.containerType = 'div';
    }
  }

  toggleExpanded() {
    if (this.options.expandable) { this.expanded = !this.expanded; }
  }

  // Set attributes for flexbox container
  // (child attributes are set in flex-layout-root.component)
  getFlexAttribute(attribute: string) {
    const flexActive: boolean =
      this.layoutNode().type === 'flex' ||
      !!this.options.displayFlex ||
      this.options.display === 'flex';
    // if (attribute !== 'flex' && !flexActive) { return null; }
    switch (attribute) {
      case 'is-flex':
        return flexActive;
      case 'display':
        return flexActive ? 'flex' : 'initial';
      case 'flex-direction': case 'flex-wrap':
        const index = ['flex-direction', 'flex-wrap'].indexOf(attribute);
        return (this.options['flex-flow'] || '').split(/\s+/)[index] ||
          this.options[attribute] || ['column', 'wrap', 'nowrap'][index];
      case 'justify-content': case 'align-items': case 'align-content':
        return this.options[attribute];
      case 'layout':
        return (this.options.fxLayout || 'row') +
          this.options.fxLayoutWrap ? ' ' + this.options.fxLayoutWrap : '';

    }
  }
}
