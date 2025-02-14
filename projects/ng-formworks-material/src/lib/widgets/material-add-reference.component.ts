import { ChangeDetectionStrategy, Component, OnInit, input, inject } from '@angular/core';
import { JsonSchemaFormService } from '@ng-formworks/core';


@Component({
    // tslint:disable-next-line:component-selector
    selector: 'material-add-reference-widget',
    template: `
    <section [class]="options?.htmlClass || ''" align="end">
      <button mat-raised-button *ngIf="showAddButton"
        [color]="options?.color || 'accent'"
        [disabled]="options?.readonly"
        (click)="addItem($event)">
        <span *ngIf="options?.icon" [class]="options?.icon"></span>
        <span *ngIf="options?.title" [innerHTML]="buttonText"></span>
      </button>
    </section>`,
    changeDetection: ChangeDetectionStrategy.Default,
    standalone: false
})
export class MaterialAddReferenceComponent implements OnInit {
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
      layoutNode: this.jsf.getParentNode(this),
    };
    return parent.layoutNode.add ||
      this.jsf.setArrayItemTitle(parent, this.layoutNode(), this.itemCount);
  }
}
