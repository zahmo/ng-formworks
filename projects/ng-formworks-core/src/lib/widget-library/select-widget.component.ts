import { Component, ComponentRef, OnChanges, OnInit, ViewContainerRef, inject, input, viewChild } from '@angular/core';

import { JsonSchemaFormService } from '../json-schema-form.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'select-widget-widget',
    template: `<div #widgetContainer></div>`,
    standalone: false
})
export class SelectWidgetComponent implements OnChanges, OnInit {

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
    if (widgetContainer && !this.newComponent && (this.layoutNode() || {}).widget) {
      this.newComponent = widgetContainer.createComponent((this.layoutNode().widget)
      );
    }
    if (this.newComponent) {
      for (const input of ['layoutNode', 'layoutIndex', 'dataIndex']) {
        this.newComponent.instance[input] = this[input];
      }
    }
  }
}
