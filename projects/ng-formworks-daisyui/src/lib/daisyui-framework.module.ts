import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Framework, FrameworkLibraryService, JsonSchemaFormModule, JsonSchemaFormService, WidgetLibraryModule, WidgetLibraryService } from '@ng-formworks/core';

import { FormsModule } from '@angular/forms';
import { CssFrameworkModule } from '@ng-formworks/cssframework';
import { DaisyUIFrameworkComponent } from './daisyui-framework.component';
import { DaisyUIFrameworkComponentPrefixed } from './daisyui-framework.prefixed.component';
import { DaisyUIFramework } from './daisyui.framework';
import { DaisyUIOneOfComponent } from './widgets/daisyui-one-of.component';
import { DaisyUITabsComponent } from './widgets/daisyui-tabs.component';



@NgModule({
  declarations: [
    DaisyUIFrameworkComponent,
    DaisyUIFrameworkComponentPrefixed,
    DaisyUITabsComponent,
    DaisyUIOneOfComponent
  ],
  imports: [
    JsonSchemaFormModule,
    CommonModule,
    FormsModule,
    WidgetLibraryModule,
    CssFrameworkModule
  ],
  exports: [
    DaisyUIFrameworkComponent,
    DaisyUIFrameworkComponentPrefixed,
    JsonSchemaFormModule,
    DaisyUITabsComponent
  ],
  providers: [
    JsonSchemaFormService,
    FrameworkLibraryService,
    WidgetLibraryService,
    
    { provide: Framework, useClass: DaisyUIFramework, multi: true }
]
})
export class DaisyUIFrameworkModule { }
