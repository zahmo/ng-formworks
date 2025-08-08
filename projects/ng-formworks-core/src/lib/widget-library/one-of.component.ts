import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { isEqual, isObject, pick } from 'lodash';
import { JsonSchemaFormService } from '../json-schema-form.service';
import { hasNonNullValue, hasOwn, JsonPointer, path2ControlKey } from '../shared';

// TODO: Add this control

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'one-of-widget',
    template: `<h4>{{this.options?.description}}</h4>
    <tabs-widget #tabs [layoutNode]="layoutNode()" 
    [layoutIndex]="layoutIndex()" 
    [dataIndex]="dataIndex()" >
    </tabs-widget>`,
    standalone: false
})
export class OneOfComponent implements OnInit,OnDestroy {
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

  ngOnInit() {
    this.options = this.layoutNode().options || {};
    this.options.tabMode="oneOfMode";
    this.options.selectedTab=this.findSelectedTab();
    //this.options.description=this.options.description||"choose one of";
    this.jsf.initializeControl(this);
  }

    findSelectedTab(){
        //TODO test- this.jsf.formValues seems to be the initial data supplied to the form
        //while the jsf.formGroup value is derived from the actual controls
        //let formValue=this.jsf.getFormControlValue(this);
        let foundInd=-1;
        //seach for non null value
        if(this.layoutNode().items){
          this.layoutNode().items.forEach((layoutItem,ind)=>{
            let formValue=JsonPointer.get(this.jsf.formValues,layoutItem.dataPointer);
              if(layoutItem.oneOfPointer){
                let controlKey=path2ControlKey(layoutItem.oneOfPointer);
                let fname=layoutItem.name;
                if(hasOwn(this.jsf.formGroup.controls,controlKey)&&
                  (formValue || hasNonNullValue(this.jsf.formGroup.controls[controlKey].value))
                  //hasOwn(formValue,fname) && hasOwn(this.jsf.formGroup.controls,controlKey) 
                // && (formValue[fname] || this.jsf.formGroup.controls[controlKey].value)
                  //&&isEqual(formValue[fname],this.jsf.formGroup.controls[controlKey].value)
                ){
                    foundInd=ind;
                }
                //foundInd=formValue[controlKey]!=null?ind:foundInd;
                //if no exact match found, then search in descendant values
                //to see which one of item matches
                if(foundInd==-1){
                  //find all descendant oneof paths
                  let descendantOneOfControlNames=Object.keys(this.jsf.formGroup.controls).filter(controlName=>{
                    return controlName.startsWith(controlKey);
                  })
                  descendantOneOfControlNames.forEach(controlName=>{
                    let parts=controlName.split('$');
                    let fieldName=parts[parts.length-1];
                    let controlValue=this.jsf.formGroup.controls[controlName].value;
                    let controlSchema=JsonPointer.get(this.jsf.schema,parts.join("/"));
                    let schemaPointer=parts.join("/");
                    let dPointer=schemaPointer.replace(/(anyOf|allOf|oneOf|none)\/[\d]+\//g, '')
                    .replace(/(if|then|else|properties)\//g, '');
                    //JsonPointer.toDataPointer(parts.join("/"),this.jsf.schema);
                    let dVal=JsonPointer.get(this.jsf.formValues,dPointer);
                    let compareVal=dVal;//formValue;
                    //compare only values that are in the subschema properties
                    if(controlSchema && controlSchema.properties){
                      compareVal=isObject(dVal) && hasOwn(dVal,fieldName)?
                      pick(dVal[fieldName],Object.keys(controlSchema.properties))
                      :pick(dVal,Object.keys(controlSchema.properties))
                    }
                    /*
                    if(isObject(compareVal) && hasOwn(compareVal,fieldName) && 
                    isEqual(compareVal[fieldName],controlValue)
                  ){
                      foundInd=ind;
                    }else //if(formValue || controlValue){
                    if(isEqual(compareVal,controlValue)){
                      foundInd=ind;
                    }
                    */
                    if(isEqual(compareVal,controlValue)){
                      foundInd=ind;
                    }
                  })
                  //now need to compare values
                }
              }
          })
        }
        return Math.max(foundInd,0);
      }

  updateValue(event) {
    this.jsf.updateValue(this, event.target.value);
  }

  ngOnDestroy () {
    //this.jsf.updateValue(this, null);
  }
}
