import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Framework, FrameworkLibraryService, JsonPointer } from '@ng-formworks/core';
import { Examples } from './example-schemas.model';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'demo',
  templateUrl: 'demo.component.html',
  animations: [
    trigger('expandSection', [
      state('in', style({ height: '*' })),
      transition(':enter', [
        style({ height: 0 }), animate(100),
      ]),
      transition(':leave', [
        style({ height: '*' }),
        animate(100, style({ height: 0 })),
      ]),
    ]),
  ],
  styles:[
    `.flex-spacer {
      flex: 1 1 auto;
    }`
  ]
})
export class DemoComponent implements OnInit,AfterViewInit {
  examples: any = Examples;
  languageList: any = ['de', 'en', 'es', 'fr', 'it', 'pt', 'zh'];
  languages: any = {
    'de': 'German',
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'it': 'Italian',
    'pt': 'Portuguese',
    'zh': 'Chinese'
  };
  frameworkList: any =[]// ['material-design', 'bootstrap-3', 'bootstrap-4','bootstrap-5','daisyui','no-framework',];
  frameworks: any ={};
  /*
  {
    'material-design': 'Material Design',
    'bootstrap-3': 'Bootstrap 3',
    'bootstrap-4': 'Bootstrap 4',
    'bootstrap-5': 'Bootstrap 5',
    'daisyui': 'DaisyUI',
    'no-framework': 'None (plain HTML)'
    
  };
  */
  selectedSet = 'ng-jsf';
  selectedSetName = '';
  selectedExample = 'ng-jsf-flex-layout';
  selectedExampleName = 'Flexbox layout';
  selectedFramework = 'material-design';
  selectedLanguage = 'en';
  visible = {
    options: true,
    schema: true,
    form: true,
    output: true
  };

  formActive = false;
  jsonFormSchema: string;
  jsonFormValid = false;
  jsonFormStatusMessage = 'Loading form...';
  jsonFormObject: any;
  jsonFormOptions: any = {
    addSubmit: true, // Add a submit button if layout does not have one
    debug: false, // Don't show inline debugging information
    loadExternalAssets: true, // Load external css and JavaScript for frameworks
    returnEmptyFields: false, // Don't return values for empty input fields
    setSchemaDefaults: true, // Always use schema defaults for empty fields
    defaultWidgetOptions: { feedback: true }, // Show inline feedback icons
  };
  liveFormData: any = {};
  formValidationErrors: any;
  formIsValid = null;
  submittedFormData: any = null;
  aceEditorOptions: any = {
    highlightActiveLine: true,
    maxLines: 1000,
    printMargin: false,
    autoScrollEditorIntoView: true,
  };
  selectedTheme:string;
  themeList:any=[];

  
  formDataEncoded:string;

  dialogRef:MatDialogRef<any>;

  dialogOptions:any={
    title:'Confirm',
    msg:'',
    toolbar_color:'primary'
  }

  @ViewChild(MatMenuTrigger, { static: true }) menuTrigger: MatMenuTrigger;


  @ViewChild('dialogTemplate', { read: TemplateRef }) 
  dialogTemplate:TemplateRef<any>;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private jsfFLService:FrameworkLibraryService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private changeDetector:ChangeDetectorRef
  ) { 


  }
  ngAfterViewInit(): void {

  }

  utf8ToB64(str) {
    // Encode the string as a UTF-8 byte array
    const utf8Bytes = new Uint8Array([...str].map(char => char.charCodeAt(0)));
    
    // Create a binary string from the byte array
    const binaryString = Array.from(utf8Bytes, byte => String.fromCharCode(byte)).join('');
    
    // Encode the binary string using btoa
    return btoa(binaryString);
}

b64ToUtf8(b64) {
    // Decode the base64 string to binary string
    const binaryString = atob(b64);
    
    // Convert the binary string to a byte array
    const utf8Bytes = new Uint8Array([...binaryString].map(char => char.charCodeAt(0)));
    
    // Decode the byte array to a UTF-8 string
    return new TextDecoder().decode(utf8Bytes);
}

 asBase64Encoded(jsonData) {
  // Convert the JSON object to a JSON string
  const jsonString = JSON.stringify(jsonData);

  // Encode the JSON string to a Base64 string
  const base64String = 
  //btoa(unescape(encodeURIComponent(jsonString)));
  btoa(encodeURIComponent(jsonString)
  .replace(/%([0-9A-F]{2})/g,(match,p1)=>{return String.fromCharCode(parseInt('0x'+p1))})
  );

  // Encode the Base64 string to be URI-safe
  const uriSafeBase64String = base64String.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return uriSafeBase64String;
}

 fromBase64Decoded(base64DataEncoded) {
  // Decode the URI-safe Base64 string to a standard Base64 string
  const base64String = base64DataEncoded
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .concat('='.repeat((4 - base64DataEncoded.length % 4) % 4)); // Add padding if necessary

  // Decode the Base64 string to a URI-encoded JSON string
  const jsonString = decodeURIComponent(atob(base64String));

  // Parse the JSON string to a JSON object
  let jsonData;
  try {
      jsonData = JSON.parse(jsonString);
  } catch (error) {
      throw new Error("Invalid JSON format: " + error.message);
  }

  return jsonData;
}
  


  ngOnInit() {
    // Subscribe to query string to detect schema to load
    this.frameworks=this.jsfFLService.getFrameworkList()
    .reduce((acc,item)=>{acc[item.name]=item.text;return acc},{});
    this.frameworkList=Object.keys(this.frameworks);
    this.route.queryParams.subscribe(
      params => {
        if (params['set']) {
          this.selectedSet = params['set'];
          this.selectedSetName = ({
            'ng-jsf': '',
            'asf': 'Angular Schema Form:',
            'rsf': 'React Schema Form:',
            'jsf': 'JSONForm:'
          })[this.selectedSet];
        }
        if (params['example']) {
          this.selectedExample = params['example'];
          this.selectedExampleName = this.examples[this.selectedSet].schemas
            .find(schema => schema.file === this.selectedExample).name;
        }
        if (params['framework']) {
          this.selectedFramework = params['framework'];
        }
        if (params['language']) {
          this.selectedLanguage = params['language'];
        }
        if (params['theme']) {
          this.selectedTheme = params['theme'];
        }
        if (params['formData']){
          this.formDataEncoded=params['formData'];
            let formData=this.fromBase64Decoded(this.formDataEncoded);
            this.jsonFormSchema = JSON.stringify(formData,null,2);
          this.generateForm(this.jsonFormSchema);
        }else{
          this.loadSelectedExample();
        }
        
      }
    );
    
    //TODO review-throwing ExpressionChangedAfterItHasBeenCheckedError 
    //for now wrapped in setTimeout
    this.jsfFLService.activeFrameworkName$.subscribe((afName=>{
      let activeFramework:Framework& { [key: string]: any; }=this.jsfFLService.activeFramework;
      if(activeFramework.getConfig){
        let cssfwConfig=activeFramework.getConfig();
        setTimeout(()=>{
          let tlist=cssfwConfig?.widgetstyles?.__themes__||[]
          //append the demo app theme to the list
          if(activeFramework.name=="material-design"){
            tlist=[].concat({name:"demo-theme",text:"Demo Theme"},tlist);
          }
          this.themeList=tlist;
          ///this.requestThemeChange(tlist[0]||"no-theme");
          if(this.selectedTheme){//if theme was set in params
            let themeNames=tlist.map(thm=>{return thm.name});
            //if selectedTheme not from this framework, set to first in framework
            if(themeNames.indexOf(this.selectedTheme)<0){
              this.selectedTheme=tlist[0]?.name||"no-theme"
            }
          }else{
            this.selectedTheme=tlist[0]?.name||"no-theme"
          }
          //this.changeDetector.detectChanges();
        },0)
        
       
      }
    }))
    //

  }

  onSubmit(data: any) {
    this.submittedFormData = data;
  }

  get prettySubmittedFormData() {
    return JSON.stringify(this.submittedFormData, null, 2);
  }

  onChanges(data: any) {
    this.liveFormData = data;
  }

  get prettyLiveFormData() {
    return JSON.stringify(this.liveFormData, null, 2);
  }

  isValid(isValid: boolean): void {
    this.formIsValid = isValid;
  }

  validationErrors(data: any): void {
    this.formValidationErrors = data;
  }

  get prettyValidationErrors() {
    if (!this.formValidationErrors) { return null; }
    const errorArray = [];
    for (const error of this.formValidationErrors) {
      const message = error.message;
      const dataPathArray = JsonPointer.parse(error.instacePath||"");
      if (dataPathArray.length) {
        let field = dataPathArray[0];
        for (let i = 1; i < dataPathArray.length; i++) {
          const key = dataPathArray[i];
          field += /^\d+$/.test(key) ? `[${key}]` : `.${key}`;
        }
        errorArray.push(`${field}: ${message}`);
      } else {
        errorArray.push(message);
      }
    }
    return errorArray.join('<br>');
  }

  loadSelectedExample(
    selectedSet: string = this.selectedSet,
    selectedSetName: string = this.selectedSetName,
    selectedExample: string = this.selectedExample,
    selectedExampleName: string = this.selectedExampleName
  ) {
    if (this.menuTrigger.menuOpen) { this.menuTrigger.closeMenu(); }
    if (selectedExample !== this.selectedExample) {
      this.formActive = false;
      this.selectedSet = selectedSet;
      this.selectedSetName = selectedSetName;
      this.selectedExample = selectedExample;
      this.selectedExampleName = selectedExampleName;
      this.router.navigateByUrl(
        '/?set=' + selectedSet +
        '&example=' + selectedExample +
        '&framework=' + this.selectedFramework +
        '&language=' + this.selectedLanguage+
        '&theme=' + this.selectedTheme+
        '&formData='+this.formDataEncoded

      );
      this.liveFormData = {};
      this.submittedFormData = null;
      this.formIsValid = null;
      this.formValidationErrors = null;
    }
    const exampleURL = `assets/example-schemas/${this.selectedExample}.json`;
    this.http
      .get(exampleURL, { responseType: 'text' })
      .subscribe(schema => {
        this.jsonFormSchema = schema;
        this.generateForm(this.jsonFormSchema);
      });
  }

  loadSelectedLanguage() {
    window.location.href = `${window.location.pathname}?set=${this.selectedSet}&example=${this.selectedExample}&framework=${this.selectedFramework}&language=${this.selectedLanguage}&theme=${this.selectedTheme}`;
  }



  // Display the form entered by the user
  // (runs whenever the user changes the jsonform object in the ACE input field)
  generateForm(newFormString: string) {
    if (!newFormString) { return; }
    this.jsonFormStatusMessage = 'Loading form...';
    this.formActive = false;
    this.liveFormData = {};
    this.submittedFormData = null;

    // Most examples should be written in pure JSON,
    // but if an example schema includes a function,
    // it will be compiled it as Javascript instead
    try {

      // Parse entered content as JSON
      this.jsonFormObject = JSON.parse(newFormString);
      this.jsonFormValid = true;
      this.formDataEncoded=this.asBase64Encoded(this.jsonFormObject);

    } catch (jsonError) {
      try {

        // If entered content is not valid JSON,
        // parse as JavaScript instead to include functions
        const newFormObject: any = null;
        /* tslint:disable */
        //commented out to use indirect eval
        //see https://esbuild.github.io/link/direct-eval
        //eval('newFormObject = ' + newFormString);
        (0, eval)('newFormObject = ' + newFormString)
        /* tslint:enable */
        this.jsonFormObject = newFormObject;
        this.jsonFormValid = true;
      } catch (javascriptError) {

        // If entered content is not valid JSON or JavaScript, show error
        this.jsonFormValid = false;
        this.jsonFormStatusMessage =
          'Entered content is not currently a valid JSON Form object.\n' +
          'As soon as it is, you will see your form here. So keep typing. :-)\n\n' +
          'JavaScript parser returned:\n\n' + jsonError;
        return;
      }
    }
    this.formActive = true;
  }

  toggleVisible(item: string) {
    this.visible[item] = !this.visible[item];
  }

  toggleFormOption(option: string) {
    if (option === 'feedback') {
      this.jsonFormOptions.defaultWidgetOptions.feedback =
        !this.jsonFormOptions.defaultWidgetOptions.feedback;
    } else {
      this.jsonFormOptions[option] = !this.jsonFormOptions[option];
    }
    this.generateForm(this.jsonFormSchema);
  }

  onDialogConfirm(e){
    if(this.dialogRef){
      this.dialogRef.close();
      this.dialogRef=null;
    }
  }

  appendUrlParameters(params) {
    // Get the current URL
    const currentUrl = new URL(window.location.href);
    
    // Iterate over the params object and append each parameter
    for (const [key, value] of Object.entries<string>(params)) {
        currentUrl.searchParams.append(key, value);
    }
    
    return currentUrl;
}

  copyUrlToClipBoard(e){
    let formData=this.jsonFormObject;
    if(this.liveFormData && Object.keys(this.liveFormData).length > 0){
      formData.data=this.liveFormData;
    }
    this.formDataEncoded=this.asBase64Encoded(formData);

//need to replace new line chars 
    let url=this.appendUrlParameters({
      set:this.selectedSet,
      example:this.selectedExample,
      framework:this.selectedFramework,
      language:this.selectedLanguage,
      theme:this.selectedTheme,
      formData:this.formDataEncoded
    })
    //document.location.protocol+"//"+ document.location.host+"/"+path.replace(/\n/g, '');
    navigator.clipboard.writeText(url.toString()).then(copyRes=>{

        this._snackBar.open('Form link copied to clipboard',null,{duration:4000});
      }).catch(err=>{
      //alert(`Form link copied not copied to clipboard, manually copy it:${url}`);
      this.dialogOptions.msg=url;
      this.dialogOptions.toolbar_color="warn";
      this.dialogOptions.title="Unable to copy form link, please copy the link manually";
      this.dialogRef=this.dialogRef|| this.dialog.open(this.dialogTemplate,
        {//disableClose:this.dialogOptions?.disableClose
        enterAnimationDuration:500,
        exitAnimationDuration:500
        }
        );
    })
  }



}
