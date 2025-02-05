import {
  Component, ComponentFactoryResolver, ComponentRef,
  OnChanges, OnInit, ViewChild, ViewContainerRef,
  input
} from '@angular/core';

import { JsonSchemaFormService } from '../json-schema-form.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'select-widget-widget',
  template: `<div #widgetContainer></div>`,
})
export class SelectWidgetComponent implements OnChanges, OnInit {
  newComponent: ComponentRef<any> = null;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);
  @ViewChild('widgetContainer', { read: ViewContainerRef, static: true })
    widgetContainer: ViewContainerRef;

  constructor(
    private componentFactory: ComponentFactoryResolver,
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.updateComponent();
  }

  ngOnChanges() {
    this.updateComponent();
  }

  updateComponent() {
    if (this.widgetContainer && !this.newComponent && (this.layoutNode() || {}).widget) {
      this.newComponent = this.widgetContainer.createComponent(
        this.componentFactory.resolveComponentFactory(this.layoutNode().widget)
      );
    }
    if (this.newComponent) {
      for (const input of ['layoutNode', 'layoutIndex', 'dataIndex']) {
        this.newComponent.instance[input] = this[input];
      }
    }
  }
}
