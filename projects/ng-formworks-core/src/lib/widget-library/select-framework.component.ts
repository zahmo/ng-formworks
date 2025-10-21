import {
  Component,
  ComponentRef, Input,
  OnChanges, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';

import { JsonSchemaFormService } from '../json-schema-form.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-framework-widget',
  template: `<div #widgetContainer></div>`,
})
export class SelectFrameworkComponent implements OnChanges, OnInit {


  newComponent: ComponentRef<any> = null;
  @Input() layoutNode: any;
  @Input() layoutIndex: number[];
  @Input() dataIndex: number[];
  @ViewChild('widgetContainer', {
      read: ViewContainerRef,
      static: true })
    widgetContainer: ViewContainerRef;

  constructor(
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.updateComponent();
  }

  ngOnChanges(changes) {
    this.updateComponent();
  }

  updateComponent() {
    const widgetContainer = this.widgetContainer;
    if (widgetContainer && !this.newComponent && this.jsf.framework) {
      this.newComponent = widgetContainer.createComponent((this.jsf.framework)
      );
      //TODO fix all deprecated calls and test 
      //this.widgetContainer.createComponent<any>(this.jsf.framework)
    }
    if (this.newComponent) {
      for (const inp of ['layoutNode', 'layoutIndex', 'dataIndex']) {
        //this.newComponent.instance[inp] = this[inp];
        this.newComponent.setInput(inp,this[inp]);
      }
      // Manually trigger change detection after updating inputs
      //this.changeDetectorRef.detectChanges();
    }
  }
}
