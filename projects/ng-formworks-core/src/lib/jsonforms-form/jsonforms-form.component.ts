import { Component, inject, input, model, OnInit, output } from '@angular/core';
import { createAjv } from '@jsonforms/core';
import { FrameworkLibraryService } from '../framework-library/framework-library.service';
import { isObject } from '../shared/validator.functions';
@Component({
  selector: 'jsonforms-form',
  template: `
    <jsonforms [data]="data()" 
    [schema]="schema()" 
    [uischema]="uischema()" 
    [renderers]="renderers()" 
    [i18n]="i18n()" [ajv]="ajv()" 
    (dataChange)="dataChange($event)">
    </jsonforms>`,
  styleUrl: './jsonforms-form.component.scss',
  standalone:false
})
export class JsonformsFormComponent implements OnInit{
  private frameworkLibrary = inject(FrameworkLibraryService);
  readonly data = input<any>(undefined); // The form data
  readonly schema = input<any>(undefined); // The schema
  readonly uischema = input<any>(undefined); // The uischema
  readonly framework = input<any | string>(undefined); // The framework to load
  readonly renderers = model<any>(undefined); // Any custom renderers to load
  readonly i18n = input<any>(undefined); // i18n
  readonly options = input<any>(undefined); // options
  readonly loadExternalAssets = input<boolean>(undefined); // Load external framework assets?
  readonly theme = input<string>(undefined); // Theme
  readonly ajv = input<any>(createAjv({
    schemaId: 'id',
    allErrors: true
  })); // ajv
  readonly onChanges = output<any>();
  constructor(){
    
  }

    /**
     * 'initializeOptions' function
     *
     * Initialize 'options' (global form options) and set framework
     * Combine available inputs:
     * 1. options - recommended
     * 2. form.options - Single input style
     */
    private initializeOptions() {
      //const language = this.language();
      //if (language && language !== this.jsf.language) {
      //  this.jsf.setLanguage(language);
      //}
      //this.jsf.setOptions({ debug: !!this.debug() });
      let loadExternalAssets: boolean = this.loadExternalAssets() || false;
      let framework: any = this.framework() || 'default';
      const options:any = this.options();
      if (options && isObject(options)) {
        //this.jsf.setOptions(options);
        loadExternalAssets = options?.loadExternalAssets || loadExternalAssets;
        framework = options.framework || framework;
      }
      //const form = this.form();
      //if (isObject(form) && isObject(form.options)) {
        //this.jsf.setOptions(form.options);
      //  loadExternalAssets = form.options.loadExternalAssets || loadExternalAssets;
      //  framework = form.options.framework || framework;
      //}
      const activeFramework:any=this.frameworkLibrary.activeFramework;
      const renderers = this.renderers()||activeFramework.renderers;
      this.renderers.set(renderers);
      //if (isObject(renderers)) {
        //this.jsf.setOptions({ widgets: widgets });
      //}
      this.frameworkLibrary.setLoadExternalAssets(loadExternalAssets);
      this.frameworkLibrary.setFramework(framework);
      //this.jsf.framework = this.frameworkLibrary.getFramework();
      //if (isObject(this.jsf.formOptions.widgets)) {
      //  for (const widget of Object.keys(this.jsf.formOptions.widgets)) {
      //    this.widgetLibrary.registerWidget(widget, this.jsf.formOptions.widgets[widget]);
      //  }
      //}
      //if (isObject(form) && isObject(form.tpldata)) {
      //  this.jsf.setTpldata(form.tpldata);
      //}
      const theme = this.theme();
      if (theme) {
        this.frameworkLibrary.requestThemeChange(theme);
      }

      
    }

    private resetScriptsAndStyleSheets() {
      document.querySelectorAll('.ajsf').forEach(element => element.remove());
    }
    private loadScripts(scriptList?:string[]) {
      const scripts = scriptList||this.frameworkLibrary.getFrameworkScripts();
      scripts.map(script => {
        const scriptTag: HTMLScriptElement = document.createElement('script');
        scriptTag.src = script;
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.setAttribute('class', 'ajsf');
        document.getElementsByTagName('head')[0].appendChild(scriptTag);
      });
    }
    private loadStyleSheets(styleList?:string[]) {
      const stylesheets = styleList||this.frameworkLibrary.getFrameworkStylesheets();
      stylesheets.map(stylesheet => {
        const linkTag: HTMLLinkElement = document.createElement('link');
        linkTag.rel = 'stylesheet';
        linkTag.href = stylesheet;
        linkTag.setAttribute('class', 'ajsf');
        document.getElementsByTagName('head')[0].appendChild(linkTag);
      });
    }
    private loadAssets() {
      this.frameworkLibrary.getFrameworkAssetConfig().then(assetCfg=>{
        this.resetScriptsAndStyleSheets();
        this.loadScripts(assetCfg.scripts);
        this.loadStyleSheets(assetCfg.stylesheets);
      }).catch(err=>{
        console.log(err);
        this.resetScriptsAndStyleSheets();
        this.loadScripts();
        this.loadStyleSheets();
      })
  
    }

    dataChange(ev:any){
      this.onChanges.emit(ev);
    }

    ngOnInit() {
      this.updateForm();
      this.loadAssets();
    }

      private initializeSchema() {
    
        // TODO: update to allow non-object schemas
    
        //const form = this.form();
        const schema = this.schema();
        /*
        const JSONSchema = this.JSONSchema();
        if (isObject(schema)) {
          this.jsf.AngularSchemaFormCompatibility = true;
          this.jsf.schema = cloneDeep(schema);
        } else if (hasOwn(form, 'schema') && isObject(form.schema)) {
          this.jsf.schema = cloneDeep(form.schema);
        } else if (isObject(JSONSchema)) {
          this.jsf.ReactJsonSchemaFormCompatibility = true;
          this.jsf.schema = cloneDeep(JSONSchema);
        } else if (hasOwn(form, 'JSONSchema') && isObject(form.JSONSchema)) {
          this.jsf.ReactJsonSchemaFormCompatibility = true;
          this.jsf.schema = cloneDeep(form.JSONSchema);
        } else if (hasOwn(form, 'properties') && isObject(form.properties)) {
          this.jsf.schema = cloneDeep(form);
        } else if (isObject(form)) {
          // TODO: Handle other types of form input
        }
    
        if (!isEmpty(this.jsf.schema)) {
    
          // If other types also allowed, render schema as an object
          if (inArray('object', this.jsf.schema.type)) {
            this.jsf.schema.type = 'object';
          }
    
          // Wrap non-object schemas in object.
          if (hasOwn(this.jsf.schema, 'type') && this.jsf.schema.type !== 'object') {
            this.jsf.schema = {
              'type': 'object',
              'properties': { 1: this.jsf.schema }
            };
            this.objectWrap = true;
          } else if (!hasOwn(this.jsf.schema, 'type')) {
    
            // Add type = 'object' if missing
            if (isObject(this.jsf.schema.properties) ||
              isObject(this.jsf.schema.patternProperties) ||
              isObject(this.jsf.schema.additionalProperties)
            ) {
              this.jsf.schema.type = 'object';
    
              // Fix JSON schema shorthand (JSON Form style)
            } else {
              this.jsf.JsonFormCompatibility = true;
              this.jsf.schema = {
                'type': 'object',
                'properties': this.jsf.schema
              };
            }
          }
    
          // If needed, update JSON Schema to draft 6 format, including
          // draft 3 (JSON Form style) and draft 4 (Angular Schema Form style)
          this.jsf.schema = convertSchemaToDraft6(this.jsf.schema);
    
          // Initialize ajv and compile schema
          //this.jsf.compileAjvSchema();
          //moved to initializeAjv()
    
          // Create schemaRefLibrary, schemaRecursiveRefMap, dataRecursiveRefMap, & arrayMap
          this.jsf.schema = resolveSchemaReferences(
            this.jsf.schema, this.jsf.schemaRefLibrary, this.jsf.schemaRecursiveRefMap,
            this.jsf.dataRecursiveRefMap, this.jsf.arrayMap
          );
          if (hasOwn(this.jsf.schemaRefLibrary, '')) {
            this.jsf.hasRootReference = true;
          }
    
          // TODO: (?) Resolve external $ref links
          // // Create schemaRefLibrary & schemaRecursiveRefMap
          // this.parser.bundle(this.schema)
          //   .then(schema => this.schema = resolveSchemaReferences(
          //     schema, this.jsf.schemaRefLibrary,
          //     this.jsf.schemaRecursiveRefMap, this.jsf.dataRecursiveRefMap
          //   ));
        }
          */
      }

      updateForm() {
        this.initializeForm();
      }
/*
  updateForm() {
      let changedData;
    const language = this.language();
    if (!this.formInitialized || !this.formValuesInput ||
      (language && language !== this.jsf.language)
      
    ) {
      this.initializeForm();
    } else {
      if (language && language !== this.jsf.language) {
        this.jsf.setLanguage(language);
      }

      // Get names of changed inputs
      let changedInput = Object.keys(this.previousInputs)
        .filter(input => this.previousInputs[input] !== this.getInputValue(input));
      let resetFirst = true;
      if (changedInput.length === 1 && changedInput[0] === 'form' &&
        this.formValuesInput.startsWith('form.')
      ) {
        // If only 'form' input changed, get names of changed keys
        changedInput = Object.keys(this.previousInputs.form || {})
          .filter(key => !isEqual(this.previousInputs.form[key], this.form()[key]))
          .map(key => `form.${key}`);
        resetFirst = false;
      }

      // If only input values have changed, update the form values
      if (changedInput.length === 1 && changedInput[0] === this.formValuesInput) {
        if (this.formValuesInput.indexOf('.') === -1) {
          changedData=this.getInputValue(this.formValuesInput)
          //this[this.formValuesInput];
          this.setFormValues(changedData, resetFirst);
        } else {
          const [input, key] = this.formValuesInput.split('.');
          changedData=this.getInputValue(input)[key];
          this.setFormValues(changedData, resetFirst);
        }

        // If anything else has changed, re-render the entire form
      } else if (changedInput.length) {
        this.initializeForm(changedData);
        if (this.onChange) { this.onChange(this.jsf.formValues); }
        if (this.onTouched) { this.onTouched(this.jsf.formValues); }
      }
      
      //set framework theme
      const theme = this.theme();
      if (theme && theme !== this.frameworkLibrary.getActiveTheme()?.name) {
        this.frameworkLibrary.requestThemeChange(theme);
      }

      // Update previous inputs
      Object.keys(this.previousInputs)
        .filter(input => this.previousInputs[input] !== this.getInputValue(input))
        .forEach(input => this.previousInputs[input] = this.getInputValue(input));
    }
  }
  */


    initializeForm(initialData?:any) {
      this.initializeOptions();
      this.initializeSchema();
    }


}
