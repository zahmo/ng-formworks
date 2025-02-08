import { ChangeDetectorRef, Component, OnChanges, OnInit, ViewEncapsulation, input, inject } from '@angular/core';
import { JsonSchemaFormService } from '@ng-formworks/core';

/**
 * Bootstrap 5 framework for Angular JSON Schema Form.
 *
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'bootstrap-5-framework',
    template: `
  <div>
    <css-framework [layoutNode]="layoutNode()" 
    [layoutIndex]="layoutIndex()" 
    [dataIndex]="dataIndex()">
    </css-framework>
  </div>
  `,
    styleUrls: ['./bootstrap5-framework.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class Bootstrap5FrameworkComponent implements OnInit, OnChanges {
  changeDetector = inject(ChangeDetectorRef);
  jsf = inject(JsonSchemaFormService);

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
  
  
  
  ngOnInit() {
  
  }
  
  ngOnChanges() {
  
  }
  
  
  
  
  
  
  }
  