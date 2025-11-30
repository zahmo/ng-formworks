import { ChangeDetectorRef, Component, OnChanges, OnInit, ViewEncapsulation, inject, input } from '@angular/core';
import { JsonSchemaFormService } from '@ng-formworks/core';

/**
* DaisyUI framework for Angular JSON Schema Form.
*
*/
@Component({
// tslint:disable-next-line:component-selector
selector: 'daisyui-framework-prefixed',
template: `
<div>
  <css-framework [layoutNode]="layoutNode()" 
  [layoutIndex]="layoutIndex()" 
  [dataIndex]="dataIndex()"
  >
  </css-framework>
</div>
`,
    //styleUrls: ['./daisyui-framework.prefixed.component.scss'],
    styleUrls: [
      './daisyui-framework.prefixed.component.css',
      './tailwind-output-prefixed.css',
      './daisyui-ng-formworks-themes-prefixed.css'
    ],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class DaisyUIFrameworkComponentPrefixed implements OnInit, OnChanges {
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
