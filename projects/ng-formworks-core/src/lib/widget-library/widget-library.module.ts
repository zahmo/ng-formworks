import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ElementAttributeDirective } from './element-attribute.directive';
import { BASIC_WIDGETS } from './index';
import { OrderableDirective } from './orderable.directive';
import { StopPropagationDirective } from './stop-propagation.directive';
import { TextTemplatePipe } from './text-template.pipe';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule,DragDropModule
 ],
    declarations: [...BASIC_WIDGETS, OrderableDirective,ElementAttributeDirective,StopPropagationDirective,TextTemplatePipe],
    exports: [...BASIC_WIDGETS, OrderableDirective,ElementAttributeDirective,StopPropagationDirective,TextTemplatePipe]
})
export class WidgetLibraryModule {
}
