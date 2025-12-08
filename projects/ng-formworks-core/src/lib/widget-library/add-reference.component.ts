import { ChangeDetectionStrategy, Component, OnInit, inject, input } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'add-reference-widget',
    template: `
    <section [class]="options?.htmlClass || ''" align="end">
      @if (showAddButton) {
        <button
          [class]="options?.fieldHtmlClass || ''"
          [disabled]="options?.readonly"
          (click)="addItem($event)"
          [appStopPropagation]="['mousedown', 'touchstart']"
          >
          @if (options?.icon) {
            <span [class]="options?.icon"></span>
          }
          @if (options?.title) {
            <span [innerHTML]="buttonText"></span>
          }
        </button>
      }
    </section>`,
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false
})
export class AddReferenceComponent implements OnInit {
  private jsf = inject(JsonSchemaFormService);

  options: any;
  itemCount: number;
  previousLayoutIndex: number[];
  previousDataIndex: number[];
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);


  ngOnInit() {
    this.options = this.layoutNode().options || {};
  }

  get showAddButton(): boolean {
    return !this.layoutNode().arrayItem ||
      this.layoutIndex()[this.layoutIndex().length - 1] < this.options.maxItems;
  }

  addItem(event) {
    event.preventDefault();
    this.jsf.addItem(this);
  }

  get buttonText(): string {
    const parent: any = {
      dataIndex: this.dataIndex().slice(0, -1),
      layoutIndex: this.layoutIndex().slice(0, -1),
      layoutNode: this.jsf.getParentNode(this)
    };
    return parent.layoutNode && (parent.layoutNode.add ||
      this.jsf.setArrayItemTitle(parent, this.layoutNode(), this.itemCount));
  }
}
