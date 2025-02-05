import { Component, input } from '@angular/core';

@Component({
  selector: 'no-framework',
  templateUrl: './no-framework.component.html',
})
export class NoFrameworkComponent {
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);
}
