import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ElementAttributeDirective } from './element-attribute.directive';
import { BASIC_WIDGETS } from './index';
import { OrderableDirective } from './orderable.directive';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    declarations: [...BASIC_WIDGETS, OrderableDirective,ElementAttributeDirective],
    exports: [...BASIC_WIDGETS, OrderableDirective,ElementAttributeDirective]
})
export class WidgetLibraryModule {
}
