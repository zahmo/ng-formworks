import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { JsonFormsAngularService, JsonFormsControl } from '@jsonforms/angular';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { createCombinatorRenderInfos } from '@jsonforms/core';
import { Subscription } from 'rxjs';
import { TabSwitchConfirmDialogComponent } from './tab-switch-confirm-dialog.component';


@Component({
  selector: 'app-material-one-of-renderer',
  template:`
              <!--  maybe this instead of jsonforms
            <jsonforms-outlet
            *ngIf="selectedIndex === oneOfRenderInfos.indexOf(oneOfRenderInfo)"
                [uischema]="oneOfRenderInfo.uischema"
                [path]="path"
                [schema]="oneOfRenderInfo.schema"
            ></jsonforms-outlet>
            -->
    <!--        
    <div *ngIf="visible">
 
        <mat-tab-group [selectedIndex]="selectedIndex" (selectedTabChange)="handleTabChange($event)">
           
        <mat-tab *ngFor="let oneOfRenderInfo of oneOfRenderInfos;let i = index" 
            [label]="oneOfRenderInfo.label"
            [disabled]="selectedIndex !=i"
            >
            <jsonforms *ngIf="selectedIndex === oneOfRenderInfos.indexOf(oneOfRenderInfo)" 
            [schema]="oneOfRenderInfo.schema" 
            [uischema]="oneOfRenderInfo.uischema" 
            [renderers]="renderers" (dataChange)="onDataChange($event)">
            </jsonforms>
            

            </mat-tab>
            
        </mat-tab-group>

    </div>  
    -->
    <nav mat-tab-nav-bar [tabPanel]="tabPanel"
      [style.width]="'100%'">
      
        <a mat-tab-link *ngFor="let oneOfRenderInfo of oneOfRenderInfos;let i = index"
          [active]="selectedIndex === i"
          (click)="onTabClick(i)">
          
        <mat-radio-button 
          [checked]="selectedIndex === i" 
          [value]="i"
          >
        </mat-radio-button>
            <span [innerHTML]="oneOfRenderInfo.label"></span>
        </a>
        
    </nav>
        <mat-tab-nav-panel #tabPanel>
          <div *ngFor="let oneOfRenderInfo of oneOfRenderInfos;let i = index" >
            <ng-container >
              <jsonforms *ngIf="selectedIndex === oneOfRenderInfos.indexOf(oneOfRenderInfo)" 
              [schema]="oneOfRenderInfo.schema" 
              [uischema]="oneOfRenderInfo.uischema" 
              [renderers]="renderers" (dataChange)="onDataChange($event)">
              </jsonforms>
             </ng-container>      
          </div>
        </mat-tab-nav-panel>
  `,
  "standalone":false
})
export class MaterialOneOfRendererComponent extends JsonFormsControl  {
  @Input() schema: any;
  @Input() path: string;
  @Input() renderers: any[];//=materialRenderers;
  @Input() cells: any[];
  @Input() rootSchema: any;
  @Input() id: string;
  @Input() visible: boolean;
  @Input() indexOfFittingSchema: number = 0;
  @Input() uischema: any;
  @Input() uischemas: any[];
  @Input() data: any;
 
  @Output() handleChange = new EventEmitter<any>();

  dialogRef:MatDialogRef<TabSwitchConfirmDialogComponent>;
  private diaCancelSubs: Subscription;
  private diaConfirmSubs: Subscription;

  selectedIndex: number = this.indexOfFittingSchema;
  newSelectedIndex: number = 0;
  confirmDialogOpen: boolean = false;
  oneOfRenderInfos: any[] = [];

  constructor(jsonFormsService: JsonFormsAngularService,private dialog: MatDialog) {
    super(jsonFormsService);
    this.visible=true;//set for testing
  }

  override ngOnInit(): void {
      super.ngOnInit();
      //this.schema=this.scopedSchema;
      //this.rootSchema=this.schema
      this.renderers=angularMaterialRenderers//materialRenderers;
      this.updateRenderInfos();

  }

  /*
  ngOnChanges(changes: SimpleChanges) {
    if (changes['schema']) {
      this.updateRenderInfos();
    }
  }
*/
onDataChange(event){
  const formData=event
  this.form.setValue(formData);
  this.onChange({value:formData});
}
  updateRenderInfos() {
    // Simulate createCombinatorRenderInfos logic
    this.oneOfRenderInfos = createCombinatorRenderInfos(
      this.scopedSchema.oneOf,
      this.schema,
      'oneOf',
      this.uischema,
      this.path,
      this.uischemas
    )
    // this.createCombinatorRenderInfos(this.scopedSchema.oneOf, this.schema);
  }

  /*
  createCombinatorRenderInfos(oneOfSchemas: any[], rootSchema: any) {

    return oneOfSchemas.map((oneOfSchema: any) => ({
      label: oneOfSchema.title || 'Unknown',
      schema: { ...oneOfSchema, definitions:rootSchema.definitions },//oneOfSchema,
      uischema: {} // Simulate uischema creation
    }));
  }
    */

  openNewTab(newIndex: number) {
    const newSchema = this.oneOfRenderInfos[newIndex].schema;
    const defaultValue = this.createDefaultValue(newSchema, this.rootSchema);
    this.handleChange.emit({ path: this.path, value: defaultValue });
    this.selectedIndex = newIndex;
  }

  createDefaultValue(schema: any, rootSchema: any) {
    // Simulate default value creation
    return {};
  }

  openDialog(): void {
    this.unsubscribeFromDiagEvents()
    this.dialogRef=null;
    this.dialogRef = this.dialog.open(TabSwitchConfirmDialogComponent, {
      data: {},
    });
    this.dialogRef.componentInstance.cancel.subscribe(()=>{
      
      this.cancel();
    })

    this.dialogRef.componentInstance.confirm.subscribe(()=>{
      this.confirm();
    })


  }
  onTabClick(e){
    this.newSelectedIndex = e;
    if (this.isEmpty(this.data)) {
      
      this.openNewTab(this.newSelectedIndex);
    } else {
      this.openDialog();
      //this.confirmDialogOpen = true;
    }
  }

  handleTabChange(event: MatTabChangeEvent) {
    
    if (this.isEmpty(this.data)) {
      this.newSelectedIndex = event.index;
      this.openNewTab(this.newSelectedIndex);
    } else {
      this.openDialog();
      //this.confirmDialogOpen = true;
    }
  }

  isEmpty(data: any): boolean {
    return !data || Object.keys(data).length === 0;
  }

  confirm() {
    //this.selectedIndex=this.newSelectedIndex;
    this.form.setValue(undefined);
    this.onChange({value:undefined});
    this.openNewTab(this.newSelectedIndex);
    this.dialogRef.close();
  }

  cancel() {
    this.confirmDialogOpen = false;
    this.dialogRef.close();
  }

  handleDialogClose() {
    this.confirmDialogOpen = false;
  }

  private unsubscribeFromDiagEvents() {
    if (this.diaCancelSubs) {
      this.diaCancelSubs.unsubscribe();
    }
    if (this.diaConfirmSubs) {
      this.diaConfirmSubs.unsubscribe();
    }
  }
  override ngOnDestroy(): void {
      super.ngOnDestroy();
      this.unsubscribeFromDiagEvents();
      //this.dialogRef.afterClosed().subscribe(result => {

      //});
  }
}
