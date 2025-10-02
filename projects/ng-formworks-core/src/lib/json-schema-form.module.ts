import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonFormsModule } from '@jsonforms/angular';
import { NoFrameworkModule } from './framework-library/no-framework.module';
import { JsonSchemaFormComponent } from './json-schema-form.component';
import { JsonformsFormComponent } from './jsonforms-form/jsonforms-form.component';
import { BASIC_RENDERERS } from './jsonforms-renderers';
import { NGFFormComponent } from './ngf-form.component';
import { WidgetLibraryModule } from './widget-library/widget-library.module';
@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    WidgetLibraryModule, NoFrameworkModule,
    JsonFormsModule
  ],
  declarations: [...BASIC_RENDERERS,JsonSchemaFormComponent,NGFFormComponent, JsonformsFormComponent],
  exports: [...BASIC_RENDERERS,JsonSchemaFormComponent,NGFFormComponent, WidgetLibraryModule,JsonformsFormComponent]
})
export class JsonSchemaFormModule {
}
