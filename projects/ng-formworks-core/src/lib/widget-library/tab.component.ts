import { Component, OnInit, input } from '@angular/core';
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
})
export class TabComponent implements OnInit {
  options: any;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  constructor(
    private jsf: JsonSchemaFormService
  ) { }

  ngOnInit() {
    this.options = this.layoutNode().options || {};
  }
}
