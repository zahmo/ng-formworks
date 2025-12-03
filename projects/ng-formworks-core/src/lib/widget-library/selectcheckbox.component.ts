import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FrameworkLibraryService } from '../framework-library/framework-library.service';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { buildTitleMap, isArray } from '../shared';

//component created as a fallback for the checkbox/sortabljs issue
//its meant to display a select as a checkbox
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'selectcheckbox-widget',
  template: `
    <div
      [class]="options?.htmlClass || ''">
      @if (boundControl) {
        <select
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.readonly]="options?.readonly ? 'readonly' : null"
          [attr.required]="options?.required"
          [class]=" frameworkStyles[activeFramework].selectClass"
          [multiple]="true"
          [id]="'control' + layoutNode()?._id"
          [name]="controlName"
          [ngModel]="selectValue"
          >
          @for (selectItem of selectList; track selectItem) {
            @if (!isArray(selectItem?.items)) {
              <option
                [class]="frameworkStyles[activeFramework].optionClass"
                [class.active]="selectItem?.value === controlValue"
                [class.unchecked-notusing]="selectItem?.value != controlValue"
                [value]="selectItem?.value"
                (click)="onSelectClicked($event)"
                type="checkbox"
                >
              </option>
            }
            <!--NB the text is out of the option element to display besides the checkbox-->
            <span [innerHTML]="selectItem?.name"></span>
          }
        </select>
      }
      @if (!boundControl) {
        <select
          [attr.aria-describedby]="'control' + layoutNode()?._id + 'Status'"
          [attr.readonly]="options?.readonly ? 'readonly' : null"
          [attr.required]="options?.required"
          [class]="frameworkStyles[activeFramework].selectClass +' select-box'"
          [multiple]="true"
          [disabled]="controlDisabled"
          [id]="'control' + layoutNode()?._id"
          [name]="controlName"
          (change)="updateValue($event)">
          @for (selectItem of selectList; track selectItem) {
            @if (!isArray(selectItem?.items)) {
              <option
                [selected]="selectItem?.value === controlValue"
                [class]="frameworkStyles[activeFramework].optionClass"
                [class.checked-notusing]="selectItem?.value === controlValue"
                [class.unchecked-notusing]]="selectItem?.value != controlValue"
                [value]="selectItem?.value"
                type="checkbox">
              </option>
            }
            <!--NB the text is out of the option element to display besides the checkbox-->
            <span [innerHTML]="selectItem?.name"></span>
          }
        </select>
      }
    
    </div>`,
    styles:[`
        /* Style the select element */
        .select-box {
            font-size: 16px;
            border: none;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            height: 25px;  /*Height equal to the size of a single option */
            overflow: hidden; /* Hide scrollbars */
            text-overflow: ellipsis; /* For overflowing text inside options */
            background-color: white; /* Set background to white */
            color: black; /* Ensure text is black */
            /* White gradient background */
            /*
            background-image: linear-gradient(0deg, white 0%, white 100%); 
            */
            background-color:transparent;
          }

        /* Remove the default focus outline */
        .select-box:focus {
            outline: none;
        }

        /* Style the option element */
        .select-option {
            font-size: 20px; /* Adjust size of the checkbox */
            color: black; /* Ensure text color is black */
            background-color: white; /* Ensure background is white */
            display:inline-block;
        }

        /* Empty box when unchecked */
        .unchecked::before {
            content: '☐'; /* Empty box Unicode */
            left: 5px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 30px; /* Adjust size */
        }

        /* Checked box when selected */
        .checked::before {
            content: '☑'; /* Checked box with tick Unicode */
            left: 5px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 30px;
        }

        /* Maintain the text and background color when the option is selected */
        .select-option:checked {
            background-image: linear-gradient(0deg, white 0%, white 100%);
            color: black;
        }

        /* Style the select element when focused */
        .select-box[multiple]:focus {
          /*
            background-image: linear-gradient(0deg, white 0%, white 100%);
            */
           background-color:transparent;
            color: blue;
            -webkit-text-fill-color: black;
        }
        
        .display-inline-block{
           display:inline-block;
        }

        .bs4-option, .bs3-option{
          width: 14px;
          height: 14px;
          border: solid 1px;
          color: darkgrey;
          min-block-size: auto;
          border-radius: 3px;
          
        }
        .bs4-option:checked[type=checkbox], .bs3-option:checked[type=checkbox] {
           
        background-image: url(data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%3C!--%20License%3A%20MIT.%20Made%20by%20jaynewey%3A%20https%3A%2F%2Fgithub.com%2Fjaynewey%2Fcharm-icons%20--%3E%3Csvg%20viewBox%3D%220%200%2016%2016%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20version%3D%221.1%22%20fill%3D%22none%22%20stroke%3D%22%23000000%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222.5%22%3E%3Cpolyline%20points%3D%224%208.75%2C6.25%2012.25%2C13.25%203.5%22%2F%3E%3C%2Fsvg%3E);
        background-color:darkturquoise;
        }
      
      `],
  standalone: false
})
export class SelectCheckboxComponent implements OnInit, OnDestroy {
  private jsf = inject(JsonSchemaFormService);
  private jsfFLService = inject(FrameworkLibraryService);

  formControl: AbstractControl;
  controlName: string;
  controlValue: any;
  controlDisabled = false;
  boundControl = false;
  options: any;
  selectList: any[] = [];
  selectListFlatGroup: any[] = [];
  selectValue: any;
  isArray = isArray;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

 frameworkStyles={
    daisyui:{selectClass:"select-box",optionClass:"checkbox tw:dui-checkbox",optionChecked:"active",optionUnchecked:""},
    "bootstrap-3":{selectClass:"select-box",optionClass:"bs3-option checkbox display-inline-block",optionChecked:"active",optionUnchecked:""},
    "bootstrap-4":{selectClass:"select-box",optionClass:"bs4-option checkbox display-inline-block",optionChecked:"active",optionUnchecked:""},
    "bootstrap-5":{selectClass:" select-box",optionClass:"form-check-input display-inline-block",optionChecked:"active",optionUnchecked:""},
    //"material-design":{selectClass:" ",optionClass:" "}

 }

 activeFramework:string;

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.activeFramework= this.jsfFLService.activeFramework.name;
    this.selectList = buildTitleMap(
      //this.options.titleMap || this.options.enumNames,
      //TODO review-title is set to null in the setTitle() method of CssFrameworkComponent
      this.options.enumNames || (this.options?.title && [this.options?.title]) 
      || [this.layoutNode().name],
      //this.options.enum, 
      [true],
      //make required true to avoid creating 'none' select option
      true, !!this.options.flatList
    );




    //the selectListFlatGroup array will be used to update the formArray values
    //while the selectList array will be bound to the form select
    //as either a grouped select or a flat select
    /*
    this.selectListFlatGroup = buildTitleMap(
      this.options.titleMap || this.options.enumNames,
      this.options.enum, !!this.options.required, true
    )
    */
    
    this.jsf.initializeControl(this);
    this.selectValue=[this.controlValue];
  }

  deselectAll() {
    this.selectListFlatGroup.forEach(selItem => {
      selItem.checked = false;
    })
  }

  updateValue(event) {
    this.options.showErrors = true;
    this.controlValue=this.selectValue[0];
    this.jsf.updateValue(this, this.controlValue);
  }

  onSelectClicked($event){
    this.selectValue=this.selectValue && this.selectValue[0]?[false]:[true];
    this.controlValue=this.selectValue[0];
    this.jsf.updateValue(this, this.controlValue);
  }

  ngOnDestroy() {
    let nullVal=this.options.multiple?[null]:null;
    this.formControl.reset(nullVal)
    this.controlValue=null;
  }
}
