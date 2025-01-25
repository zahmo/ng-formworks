import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { JsonSchemaFormService } from '@ng-formworks/core';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'flex-layout-root-widget',
    template: `
    <div *ngFor="let layoutNode of layout(); let i = index"
      [class.form-flex-item]="isFlexItem()"
      [style.flex-grow]="getFlexAttribute(layoutNode, 'flex-grow')"
      [style.flex-shrink]="getFlexAttribute(layoutNode, 'flex-shrink')"
      [style.flex-basis]="getFlexAttribute(layoutNode, 'flex-basis')"
      [style.align-self]="(layoutNode?.options || {})['align-self']"
      [style.order]="layoutNode?.options?.order"
      [attr.fxFlex]="layoutNode?.options?.fxFlex"
      [attr.fxFlexOrder]="layoutNode?.options?.fxFlexOrder"
      [attr.fxFlexOffset]="layoutNode?.options?.fxFlexOffset"
      [attr.fxFlexAlign]="layoutNode?.options?.fxFlexAlign">
      <select-framework-widget *ngIf="showWidget(layoutNode)"
        [dataIndex]="layoutNode?.arrayItem ? (dataIndex() || []).concat(i) : (dataIndex() || [])"
        [layoutIndex]="(layoutIndex() || []).concat(i)"
        [layoutNode]="layoutNode"></select-framework-widget>
    <div>`,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FlexLayoutRootComponent {
  private jsf = inject(JsonSchemaFormService);

  readonly dataIndex = input<number[]>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly layout = input<any[]>(undefined);
  readonly isFlexItem = input(false);

  removeItem(item) {
    this.jsf.removeItem(item);
  }

  // Set attributes for flexbox child
  // (container attributes are set in flex-layout-section.component)
  getFlexAttribute(node: any, attribute: string) {
    const index = ['flex-grow', 'flex-shrink', 'flex-basis'].indexOf(attribute);
    return ((node.options || {}).flex || '').split(/\s+/)[index] ||
      (node.options || {})[attribute] || ['1', '1', 'auto'][index];
  }

  showWidget(layoutNode: any): boolean {
    return this.jsf.evaluateCondition(layoutNode, this.dataIndex());
  }
}
