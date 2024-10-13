import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Framework, FrameworkLibraryService, JsonSchemaFormModule, JsonSchemaFormService, WidgetLibraryModule, WidgetLibraryService } from '@ng-formworks/core';
import { CssFrameworkModule } from '@ng-formworks/cssframework';
import { Bootstrap4FrameworkComponent } from './bootstrap4-framework.component';
import { Bootstrap4Framework } from './bootstrap4.framework';
import * as i0 from "@angular/core";
export class Bootstrap4FrameworkModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: Bootstrap4FrameworkModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.7", ngImport: i0, type: Bootstrap4FrameworkModule, declarations: [Bootstrap4FrameworkComponent], imports: [JsonSchemaFormModule,
            CommonModule,
            WidgetLibraryModule,
            CssFrameworkModule], exports: [JsonSchemaFormModule,
            Bootstrap4FrameworkComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: Bootstrap4FrameworkModule, providers: [
            JsonSchemaFormService,
            FrameworkLibraryService,
            WidgetLibraryService,
            { provide: Framework, useClass: Bootstrap4Framework, multi: true },
        ], imports: [JsonSchemaFormModule,
            CommonModule,
            WidgetLibraryModule,
            CssFrameworkModule, JsonSchemaFormModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: Bootstrap4FrameworkModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        JsonSchemaFormModule,
                        CommonModule,
                        WidgetLibraryModule,
                        CssFrameworkModule
                    ],
                    declarations: [
                        Bootstrap4FrameworkComponent,
                    ],
                    exports: [
                        JsonSchemaFormModule,
                        Bootstrap4FrameworkComponent,
                    ],
                    providers: [
                        JsonSchemaFormService,
                        FrameworkLibraryService,
                        WidgetLibraryService,
                        { provide: Framework, useClass: Bootstrap4Framework, multi: true },
                    ]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwNC1mcmFtZXdvcmsubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmctZm9ybXdvcmtzLWJvb3RzdHJhcDQvc3JjL2xpYi9ib290c3RyYXA0LWZyYW1ld29yay5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUNILFNBQVMsRUFDVCx1QkFBdUIsRUFDdkIsb0JBQW9CLEVBQ3BCLHFCQUFxQixFQUNyQixtQkFBbUIsRUFDbkIsb0JBQW9CLEVBQ3ZCLE1BQU0sb0JBQW9CLENBQUM7QUFDNUIsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDaEUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFDaEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7O0FBdUI3RCxNQUFNLE9BQU8seUJBQXlCOzhHQUF6Qix5QkFBeUI7K0dBQXpCLHlCQUF5QixpQkFiOUIsNEJBQTRCLGFBTjVCLG9CQUFvQjtZQUNwQixZQUFZO1lBQ1osbUJBQW1CO1lBQ25CLGtCQUFrQixhQU1sQixvQkFBb0I7WUFDcEIsNEJBQTRCOytHQVN2Qix5QkFBeUIsYUFQdkI7WUFDUCxxQkFBcUI7WUFDckIsdUJBQXVCO1lBQ3ZCLG9CQUFvQjtZQUNwQixFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7U0FDckUsWUFqQkcsb0JBQW9CO1lBQ3BCLFlBQVk7WUFDWixtQkFBbUI7WUFDbkIsa0JBQWtCLEVBTWxCLG9CQUFvQjs7MkZBVWYseUJBQXlCO2tCQXJCckMsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUU7d0JBQ0wsb0JBQW9CO3dCQUNwQixZQUFZO3dCQUNaLG1CQUFtQjt3QkFDbkIsa0JBQWtCO3FCQUNyQjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1YsNEJBQTRCO3FCQUMvQjtvQkFDRCxPQUFPLEVBQUU7d0JBQ0wsb0JBQW9CO3dCQUNwQiw0QkFBNEI7cUJBQy9CO29CQUNELFNBQVMsRUFBRTt3QkFDUCxxQkFBcUI7d0JBQ3JCLHVCQUF1Qjt3QkFDdkIsb0JBQW9CO3dCQUNwQixFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLG1CQUFtQixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7cUJBQ3JFO2lCQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICAgIEZyYW1ld29yayxcbiAgICBGcmFtZXdvcmtMaWJyYXJ5U2VydmljZSxcbiAgICBKc29uU2NoZW1hRm9ybU1vZHVsZSxcbiAgICBKc29uU2NoZW1hRm9ybVNlcnZpY2UsXG4gICAgV2lkZ2V0TGlicmFyeU1vZHVsZSxcbiAgICBXaWRnZXRMaWJyYXJ5U2VydmljZVxufSBmcm9tICdAbmctZm9ybXdvcmtzL2NvcmUnO1xuaW1wb3J0IHsgQ3NzRnJhbWV3b3JrTW9kdWxlIH0gZnJvbSAnQG5nLWZvcm13b3Jrcy9jc3NmcmFtZXdvcmsnO1xuaW1wb3J0IHsgQm9vdHN0cmFwNEZyYW1ld29ya0NvbXBvbmVudCB9IGZyb20gJy4vYm9vdHN0cmFwNC1mcmFtZXdvcmsuY29tcG9uZW50JztcbmltcG9ydCB7IEJvb3RzdHJhcDRGcmFtZXdvcmsgfSBmcm9tICcuL2Jvb3RzdHJhcDQuZnJhbWV3b3JrJztcblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbXG4gICAgICAgIEpzb25TY2hlbWFGb3JtTW9kdWxlLFxuICAgICAgICBDb21tb25Nb2R1bGUsXG4gICAgICAgIFdpZGdldExpYnJhcnlNb2R1bGUsXG4gICAgICAgIENzc0ZyYW1ld29ya01vZHVsZVxuICAgIF0sXG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICAgIEJvb3RzdHJhcDRGcmFtZXdvcmtDb21wb25lbnQsXG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIEpzb25TY2hlbWFGb3JtTW9kdWxlLFxuICAgICAgICBCb290c3RyYXA0RnJhbWV3b3JrQ29tcG9uZW50LFxuICAgIF0sXG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIEpzb25TY2hlbWFGb3JtU2VydmljZSxcbiAgICAgICAgRnJhbWV3b3JrTGlicmFyeVNlcnZpY2UsXG4gICAgICAgIFdpZGdldExpYnJhcnlTZXJ2aWNlLFxuICAgICAgICB7IHByb3ZpZGU6IEZyYW1ld29yaywgdXNlQ2xhc3M6IEJvb3RzdHJhcDRGcmFtZXdvcmssIG11bHRpOiB0cnVlIH0sXG4gICAgXVxufSlcbmV4cG9ydCBjbGFzcyBCb290c3RyYXA0RnJhbWV3b3JrTW9kdWxlIHtcbn1cbiJdfQ==