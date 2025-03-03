import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule, REMOVE_STYLES_ON_COMPONENT_DESTROY } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { Bootstrap3FrameworkModule } from '@ng-formworks/bootstrap3';
import { Bootstrap4FrameworkModule } from '@ng-formworks/bootstrap4';
import { JsonSchemaFormModule } from '@ng-formworks/core';


import { DUIOPTIONS, DaisyUIFrameworkModule } from '@ng-formworks/daisyui';
import { MaterialDesignFrameworkModule } from '@ng-formworks/material';

import { Bootstrap5FrameworkModule } from '@ng-formworks/bootstrap5';
import { CssFrameworkModule } from '@ng-formworks/cssframework';
import { environment } from '../environments/environment';
import { AceEditorDirective } from './ace-editor.directive';
import { DemoRootComponent } from './demo-root.component';
import { DemoComponent } from './demo.component';
import { routes } from './demo.routes';



@NgModule({ declarations: [AceEditorDirective, DemoComponent, DemoRootComponent],
    bootstrap: [DemoRootComponent], imports: [BrowserModule, BrowserAnimationsModule, FormsModule,
        MatButtonModule, MatCardModule, MatCheckboxModule,
        MatIconModule, MatMenuModule, MatSelectModule, MatToolbarModule,
        MatDialogModule,
        MatSnackBarModule,
        RouterModule.forRoot(routes, {}),
        Bootstrap4FrameworkModule,
        Bootstrap3FrameworkModule,
        MaterialDesignFrameworkModule,
        DaisyUIFrameworkModule,
        Bootstrap5FrameworkModule,
        CssFrameworkModule,
        JsonSchemaFormModule], providers: [{ provide: REMOVE_STYLES_ON_COMPONENT_DESTROY, useValue: true }
        //uncomment to disable daisyui class name prefixing
        ,
        { provide: DUIOPTIONS, useValue: { classPrefix: environment.cssClassPrefix } }, provideHttpClient(withInterceptorsFromDi())] })

export class DemoModule { }
