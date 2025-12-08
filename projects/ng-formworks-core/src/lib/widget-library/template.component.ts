import { Component, ComponentRef, OnChanges, OnInit, ViewContainerRef, inject, input, viewChild } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'template-widget',
    template: `<div #widgetContainer></div>`,
    standalone: false
})
export class TemplateComponent implements OnInit, OnChanges {
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
    const layoutNode = this.layoutNode();
    const widgetContainer = this.widgetContainer();
    if (widgetContainer && !this.newComponent && layoutNode.options.template) {
      this.newComponent = widgetContainer.createComponent((layoutNode.options.template)
      );
    }
    if (this.newComponent) {
      for (const input of ['layoutNode', 'layoutIndex', 'dataIndex']) {
        this.newComponent.instance[input] = this[input];
      }
    }
  }
}
