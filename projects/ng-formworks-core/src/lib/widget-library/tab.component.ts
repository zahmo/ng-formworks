import { Component, OnInit, input, inject } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'tab-widget',
    template: `
    <div [class]="options?.htmlClass || ''">
      <root-widget
        [dataIndex]="dataIndex()"
        [layoutIndex]="layoutIndex()"
        [layout]="layoutNode().items"></root-widget>
    </div>`,
    standalone: false
})
export class TabComponent implements OnInit {
  private jsf = inject(JsonSchemaFormService);

  options: any;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  ngOnInit() {
    this.options = this.layoutNode().options || {};
  }
}
