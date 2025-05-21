import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SortablejsModule } from 'nxt-sortablejs';
import { ElementAttributeDirective } from './element-attribute.directive';
import { BASIC_WIDGETS } from './index';
import { OrderableDirective } from './orderable.directive';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule,
        SortablejsModule.forRoot({
        //disabled:false,
        //draggable:".draggableitem",//">:not(.nonsort)",//">.draggable-item",//":not(.nonsort)",//">*",//":not(.nonsort)",//":not(.non-draggable)",
        filter:".sortable-filter",//needed to disable dragging on input range elements, class needs to be added to the element or its parent
        preventOnFilter: false,//needed for input range elements slider do still work
        onMove: function (/**Event*/evt, /**Event*/originalEvent) {
               if(evt.related.classList.contains("sortable-fixed")){
                //console.log(evt.related);
                return false;
              }
            }
      })],
    declarations: [...BASIC_WIDGETS, OrderableDirective,ElementAttributeDirective],
    exports: [...BASIC_WIDGETS, OrderableDirective,ElementAttributeDirective]
})
export class WidgetLibraryModule {
}
