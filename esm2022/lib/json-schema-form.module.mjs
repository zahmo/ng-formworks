import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { JsonSchemaFormComponent } from './json-schema-form.component';
import { NoFrameworkModule } from './framework-library/no-framework.module';
import { WidgetLibraryModule } from './widget-library/widget-library.module';
import * as i0 from "@angular/core";
export class JsonSchemaFormModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: JsonSchemaFormModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.7", ngImport: i0, type: JsonSchemaFormModule, declarations: [JsonSchemaFormComponent], imports: [CommonModule, FormsModule, ReactiveFormsModule,
            WidgetLibraryModule, NoFrameworkModule], exports: [JsonSchemaFormComponent, WidgetLibraryModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: JsonSchemaFormModule, imports: [CommonModule, FormsModule, ReactiveFormsModule,
            WidgetLibraryModule, NoFrameworkModule, WidgetLibraryModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: JsonSchemaFormModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule, FormsModule, ReactiveFormsModule,
                        WidgetLibraryModule, NoFrameworkModule
                    ],
                    declarations: [JsonSchemaFormComponent],
                    exports: [JsonSchemaFormComponent, WidgetLibraryModule]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi1zY2hlbWEtZm9ybS5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1mb3Jtd29ya3MtY29yZS9zcmMvbGliL2pzb24tc2NoZW1hLWZvcm0ubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN2RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx5Q0FBeUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx3Q0FBd0MsQ0FBQzs7QUFVN0UsTUFBTSxPQUFPLG9CQUFvQjs4R0FBcEIsb0JBQW9COytHQUFwQixvQkFBb0IsaUJBSGhCLHVCQUF1QixhQUhwQyxZQUFZLEVBQUUsV0FBVyxFQUFFLG1CQUFtQjtZQUM5QyxtQkFBbUIsRUFBRSxpQkFBaUIsYUFHOUIsdUJBQXVCLEVBQUUsbUJBQW1COytHQUUzQyxvQkFBb0IsWUFON0IsWUFBWSxFQUFFLFdBQVcsRUFBRSxtQkFBbUI7WUFDOUMsbUJBQW1CLEVBQUUsaUJBQWlCLEVBR0wsbUJBQW1COzsyRkFFM0Msb0JBQW9CO2tCQVJoQyxRQUFRO21CQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxZQUFZLEVBQUUsV0FBVyxFQUFFLG1CQUFtQjt3QkFDOUMsbUJBQW1CLEVBQUUsaUJBQWlCO3FCQUN2QztvQkFDRCxZQUFZLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztvQkFDdkMsT0FBTyxFQUFFLENBQUMsdUJBQXVCLEVBQUUsbUJBQW1CLENBQUM7aUJBQ3hEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlLCBSZWFjdGl2ZUZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEpzb25TY2hlbWFGb3JtQ29tcG9uZW50IH0gZnJvbSAnLi9qc29uLXNjaGVtYS1mb3JtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOb0ZyYW1ld29ya01vZHVsZSB9IGZyb20gJy4vZnJhbWV3b3JrLWxpYnJhcnkvbm8tZnJhbWV3b3JrLm1vZHVsZSc7XG5pbXBvcnQgeyBXaWRnZXRMaWJyYXJ5TW9kdWxlIH0gZnJvbSAnLi93aWRnZXQtbGlicmFyeS93aWRnZXQtbGlicmFyeS5tb2R1bGUnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLCBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICBXaWRnZXRMaWJyYXJ5TW9kdWxlLCBOb0ZyYW1ld29ya01vZHVsZVxuICBdLFxuICBkZWNsYXJhdGlvbnM6IFtKc29uU2NoZW1hRm9ybUNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtKc29uU2NoZW1hRm9ybUNvbXBvbmVudCwgV2lkZ2V0TGlicmFyeU1vZHVsZV1cbn0pXG5leHBvcnQgY2xhc3MgSnNvblNjaGVtYUZvcm1Nb2R1bGUge1xufVxuIl19