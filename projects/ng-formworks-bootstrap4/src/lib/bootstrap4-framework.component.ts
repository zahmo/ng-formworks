import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  ViewEncapsulation,
  input
} from '@angular/core';
import { JsonSchemaFormService } from '@ng-formworks/core';

/**
 * Bootstrap 4 framework for Angular JSON Schema Form.
 *
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bootstrap-4-framework',
    template: `
  <div>
    <css-framework [layoutNode]="layoutNode()" 
    [layoutIndex]="layoutIndex()" 
    [dataIndex]="dataIndex()">
    </css-framework>
  </div>
  `,
    styleUrls: ['./bootstrap4-framework.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class Bootstrap4FrameworkComponent implements OnInit, OnChanges {
  frameworkInitialized = false;
  widgetOptions: any; // Options passed to child widget
  widgetLayoutNode: any; // layoutNode passed to child widget
  options: any; // Options used in this framework
  formControl: any = null;
  debugOutput: any = '';
  debug: any = '';
  parentArray: any = null;
  isOrderable = false;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);
  
  
  constructor(
    public changeDetector: ChangeDetectorRef,
    public jsf: JsonSchemaFormService
  ) {
  }
  
  
  
  ngOnInit() {
  
  }
  
  ngOnChanges() {
  
  }
  
  
  
  
  
  
  }
  