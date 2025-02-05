import { Component, input } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'none-widget',
  template: ``,
})
export class NoneComponent {
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);
}
