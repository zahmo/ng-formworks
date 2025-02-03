import { Component, ComponentFactoryResolver, ComponentRef, OnChanges, OnInit, ViewContainerRef, input, inject, viewChild } from '@angular/core';

import { JsonSchemaFormService } from '../json-schema-form.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-framework-widget',
  template: `<div #widgetContainer></div>`,
})
export class SelectFrameworkComponent implements OnChanges, OnInit {
  private componentFactory = inject(ComponentFactoryResolver);
  private jsf = inject(JsonSchemaFormService);

  newComponent: ComponentRef<any> = null;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);
  readonly widgetContainer = viewChild('widgetContainer', { read: ViewContainerRef });

  ngOnInit() {
    this.updateComponent();
  }

  ngOnChanges() {
    this.updateComponent();
  }

  updateComponent() {
    const widgetContainer = this.widgetContainer();
    if (widgetContainer && !this.newComponent && this.jsf.framework) {
      this.newComponent = widgetContainer.createComponent(
        this.componentFactory.resolveComponentFactory(this.jsf.framework)
      );
      //TODO fix all deprecated calls and test 
      //this.widgetContainer.createComponent<any>(this.jsf.framework)
    }
    if (this.newComponent) {
      for (const input of ['layoutNode', 'layoutIndex', 'dataIndex']) {
        this.newComponent.instance[input] = this[input];
      }
    }
  }
}
