
import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, OnDestroy, OnInit, forwardRef, inject, input, model as modelSignal, output } from '@angular/core';
import { NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { FrameworkLibraryService } from './framework-library/framework-library.service';
import { JsonSchemaFormService } from './json-schema-form.service';

export const JSON_SCHEMA_FORM_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => JsonSchemaFormComponent),
  multi: true,
};

export enum FormEngine{
  Default='Default',
  JSONForms='JSONForms'
}

/**
 * @module 'JsonSchemaFormComponent' - Angular JSON Schema Form
 *
 * Root module of the Angular JSON Schema Form client-side library,
 * an Angular library which generates an HTML form from a JSON schema
 * structured data model and/or a JSON Schema Form layout description.
 * This has now been changed to be the entry point/wrapper for selection of the
 * form engine:either Json Forms(https://jsonforms.io/) or
 * the built in form engine
 * The original JsonSchemaFormComponent has been renamed
 * to NGFFormComponent, this is mainly so existing clients will still
 * work without any changes
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'json-schema-form',
    template: `
        <ngf-form *ngIf="formEngine() == FormEngine_Default && !usingNgModel"
          [schema]="schema()"
          [layout]="layout()"
          [data]="data()"
          [framework]="framework()" 
          [widgets]="widgets()"
          [options]="options()" 
          [form]="form()" 
          [model]="model()" 
          [JSONSchema]="JSONSchema()"
          [UISchema]="UISchema()"
          [language]="language()" 
          [formData]="formData()"
          [theme]="theme()"
          [loadExternalAssets]="loadExternalAssets()"
          [debug]="debug()"
          [ajvOptions]="ajvOptions()"
          [value]="value()"
          (onChanges)="forwardOutput('onChanges',$event)"
          (onSubmit)="forwardOutput('onSubmit',$event)"
          (isValid)="forwardOutput('isValid',$event)" 
          (validationErrors)="forwardOutput('validationErrors',$event)"
          (formSchema)="forwardOutput('formSchema',$event)"
          (formLayout)="forwardOutput('formLayout',$event)"
          (dataChange)="forwardOutput('dataChange',$event)"
          (modelChange)="forwardOutput('modelChange',$event)"
          (formDataChange)="forwardOutput('formDataChange',$event)"
        >
        </ngf-form>
       
      <ngf-form *ngIf="formEngine() == FormEngine_Default && usingNgModel"
          [schema]="schema()"
          [layout]="layout()"
          [data]="data()"
          [framework]="framework()" 
          [widgets]="widgets()"
          [options]="options()" 
          [form]="form()" 
          [model]="model()" 
          [JSONSchema]="JSONSchema()"
          [UISchema]="UISchema()"
          [language]="language()" 
          [formData]="formData()"
          [theme]="theme()"
          [ngModel]="ngModel()" 
          [loadExternalAssets]="loadExternalAssets()"
          [debug]="debug()"
          [ajvOptions]="ajvOptions()"
          [value]="value()"
          (onChanges)="forwardOutput('onChanges',$event)"
          (onSubmit)="forwardOutput('onSubmit',$event)"
          (isValid)="forwardOutput('isValid',$event)" 
          (validationErrors)="forwardOutput('validationErrors',$event)"
          (formSchema)="forwardOutput('formSchema',$event)"
          (formLayout)="forwardOutput('formLayout',$event)"
          (dataChange)="forwardOutput('dataChange',$event)"
          (modelChange)="forwardOutput('modelChange',$event)"
          (formDataChange)="forwardOutput('formDataChange',$event)"
          (ngModelChange)="forwardOutput('ngModelChange',$event)"
        >
        </ngf-form>     
        <jsonforms-form *ngIf="formEngine() == FormEngine_JSONForms" 
          [loadExternalAssets]="loadExternalAssets()" 
          [options]="options()" 
          [framework]="framework()" 
          [theme]="theme()" 
          [schema]="schema()" 
          [uischema]="JFUISchema()" 
          [data]="data()" 
          [ajv]="ajv()"
          [i18n]="i18n()"
          [renderers]="renderers()"
          [form]="form()" 
          (onChanges)="forwardOutput('onChanges',$event)"
        >
        </jsonforms-form>        
`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    // Adding 'JsonSchemaFormService' here, instead of in the module,
    // creates a separate instance of the service for each component
    providers: [JsonSchemaFormService, JSON_SCHEMA_FORM_VALUE_ACCESSOR],
    standalone: false
})
export class JsonSchemaFormComponent implements OnInit,OnDestroy,AfterContentInit {
  FormEngine_Default=FormEngine.Default;
  FormEngine_JSONForms=FormEngine.JSONForms;
  
  private frameworkLibrary = inject(FrameworkLibraryService);
  jsf = inject(JsonSchemaFormService);
  cdr =inject(ChangeDetectorRef);

  schema = modelSignal<any>(undefined); // The JSON Schema
  readonly layout = input<any[]>(undefined); // The form layout
  data = modelSignal<any>(undefined); // The form data
  readonly options = input<any>(undefined); // The global form options
  readonly framework = input<any | string>(undefined); // The framework to load
  readonly widgets = input<any>(undefined); // Any custom widgets to load


  readonly form = input<any>(undefined); // For testing, and JSON Schema Form API compatibility

  // Angular Schema Form API compatibility input
  readonly model = input<any>(undefined); // Alternate input for form data

  // React JSON Schema Form API compatibility inputs
  readonly JSONSchema = input<any>(undefined); // Alternate input for JSON Schema
  readonly UISchema = input<any>(undefined); // UI schema - alternate form layout format
  readonly formData = input<any>(undefined); // Alternate input for form data

  ngModel = modelSignal<any>(undefined); // Alternate input for Angular forms

  readonly language = input<string>(undefined); // Language

  // Development inputs, for testing and debugging
  readonly loadExternalAssets = input<boolean>(undefined); // Load external framework assets?
  readonly debug = input<boolean>(undefined); // Show debug information?

  readonly theme = input<string>(undefined); // Theme

  readonly ajvOptions = input<any>(undefined); // ajvOptions
  
  readonly value = input<any>(undefined); // ajvOptions

  // Outputs
  readonly onChanges = output<any>(); // Live unvalidated internal form data
  readonly onSubmit = output<any>(); // Complete validated form data
  readonly isValid = output<boolean>(); // Is current data valid?
  readonly validationErrors = output<any>(); // Validation errors (if any)
  readonly formSchema = output<any>(); // Final schema used to create form
  readonly formLayout = output<any>(); // Final layout used to create form

  // Outputs for possible 2-way data binding
  // Only the one input providing the initial form data will be bound.
  // If there is no inital data, input '{}' to activate 2-way data binding.
  // There is no 2-way binding if inital data is combined inside the 'form' input.
  readonly dataChange = output<any>();
  readonly modelChange = output<any>();
  readonly formDataChange = output<any>();
  readonly ngModelChange = output<any>();

  // JSON forms inputs/outputs
  //readonly data = input<any>(undefined); // The form data
  //readonly schema = input<any>(undefined); // The schema
  readonly uischema = input<any>(undefined); // The uischema
  //readonly framework = input<any | string>(undefined); // The framework to load
  readonly renderers = input<any>(undefined); // Any custom renderers to load
  readonly i18n = input<any>(undefined); // i18n
  //readonly options = input<any>(undefined); // options
  //readonly loadExternalAssets = input<boolean>(undefined); // Load external framework assets?
  //readonly theme = input<string>(undefined); // Theme
  readonly ajv = input<any>(undefined); // ajv
  readonly JFUISchema = input<any>(undefined); // The uischema
  //readonly onChanges = output<any>();
  formEngine=modelSignal<string>(this.FormEngine_Default)
  //modelSignal<string>(FormEngine.Default)

  usingNgModel:boolean=false;

  @ContentChild(NgModel) ngModelDirective: NgModel | undefined;
  forwardOutput(outputName,e){
    this[outputName].emit(e)
  }
 
  //TODO move to utilities maybe
  isNotEnumValue<T>(value: string, enumType: T): boolean {
    return !Object.values(enumType).includes(value as keyof T);
  }
  
  ngOnInit(): void {
      let jfUISchema=this.JFUISchema();
      jfUISchema=this.form() && this.form().JFUISchema||jfUISchema
      let opts =this.options();
      let formOpts=this.form()?.options;
      let engine=jfUISchema?this.FormEngine_JSONForms:
      opts && opts.formEngine || formOpts && formOpts.formEngine ||this.FormEngine_Default
      if(engine==this.FormEngine_JSONForms){
        this.formEngine.set(this.FormEngine_JSONForms);
        //this.cdr.markForCheck();
      }
      if(this.isNotEnumValue(engine,FormEngine)){
          console.warn(`unsupported form engine '${engine}'-must be one of:${Object.values(FormEngine)} using Default`);
      }

  }

  ngOnDestroy(): void {

  }
  ngAfterContentInit() {
    //this.ngModel.set({
    //  "name": "ng m"
    //})
    if (this.ngModelDirective) {
      // Handle cases where the parent provides ngModel to the library component
      //this.ngModel.set(this.ngModelDirective.value)
      this.usingNgModel=true;
    }
  }

}
