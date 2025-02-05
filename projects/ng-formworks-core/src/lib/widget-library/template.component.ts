import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnChanges,
  OnInit,
  ViewChild,
  ViewContainerRef,
  input
} from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'template-widget',
  template: `<div #widgetContainer></div>`,
})
export class TemplateComponent implements OnInit, OnChanges {
  newComponent: ComponentRef<any> = null;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);
  @ViewChild('widgetContainer', { read: ViewContainerRef , static: true})
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
    const layoutNode = this.layoutNode();
    if (this.widgetContainer && !this.newComponent && layoutNode.options.template) {
      this.newComponent = this.widgetContainer.createComponent(
        this.componentFactory.resolveComponentFactory(layoutNode.options.template)
      );
    }
    if (this.newComponent) {
      for (const input of ['layoutNode', 'layoutIndex', 'dataIndex']) {
        this.newComponent.instance[input] = this[input];
      }
    }
  }
}
