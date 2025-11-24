// item-title.component.ts
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { JsonSchemaFormService } from '../json-schema-form.service';

@Component({
    selector: 'item-title',
    template: `<div>{{ title }}</div>`,
    standalone:false
    // Consider using ChangeDetectionStrategy.OnPush here for maximum efficiency

})
export class ItemTitleComponent implements OnInit, OnChanges,OnDestroy {
    @Input() item: any;
    @Input() index: number;
    @Input() ctx: any;

    title: string;
 dataChangesSubs:Subscription;
    constructor(private jsf: JsonSchemaFormService) {

    }
    ngOnChanges(changes: SimpleChanges): void {
        this.updateTitle();
    }
    ngOnInit() {
        // Calculate the title once on init, or subscribe to changes here
        this.updateTitle();
        this.dataChangesSubs=this.jsf.dataChanges.subscribe((val)=>{
            this.updateTitle();
           
        })
    }

    updateTitle() {
        this.title = this.jsf.setArrayItemTitle(this.ctx, this.item, this.index);
    }
    ngOnDestroy(): void {
        this.dataChangesSubs?.unsubscribe();
      }
}
