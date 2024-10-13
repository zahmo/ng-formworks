import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Framework, FrameworkLibraryService, JsonSchemaFormModule, JsonSchemaFormService, WidgetLibraryModule, WidgetLibraryService } from '@ng-formworks/core';
import { CssFrameworkModule } from '@ng-formworks/cssframework';
import { MaterialDesignFramework } from './material-design.framework';
import { MATERIAL_FRAMEWORK_COMPONENTS } from './widgets/public_api';
import * as i0 from "@angular/core";
import * as i1 from "./widgets/flex-layout-root.component";
import * as i2 from "./widgets/flex-layout-section.component";
import * as i3 from "./widgets/material-add-reference.component";
import * as i4 from "./widgets/material-one-of.component";
import * as i5 from "./widgets/material-button.component";
import * as i6 from "./widgets/material-button-group.component";
import * as i7 from "./widgets/material-checkbox.component";
import * as i8 from "./widgets/material-checkboxes.component";
import * as i9 from "./widgets/material-chip-list.component";
import * as i10 from "./widgets/material-datepicker.component";
import * as i11 from "./widgets/material-file.component";
import * as i12 from "./widgets/material-input.component";
import * as i13 from "./widgets/material-number.component";
import * as i14 from "./widgets/material-radios.component";
import * as i15 from "./widgets/material-select.component";
import * as i16 from "./widgets/material-slider.component";
import * as i17 from "./widgets/material-stepper.component";
import * as i18 from "./widgets/material-tabs.component";
import * as i19 from "./widgets/material-textarea.component";
import * as i20 from "./material-design-framework.component";
/**
 * unused @angular/material modules:
 * MatDialogModule, MatGridListModule, MatListModule, MatMenuModule,
 * MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule,
 * MatSidenavModule, MatSnackBarModule, MatSortModule, MatTableModule,
 * ,
 */
export const ANGULAR_MATERIAL_MODULES = [
    MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule,
    MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatExpansionModule,
    MatFormFieldModule, MatIconModule, MatInputModule, MatNativeDateModule,
    MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule,
    MatStepperModule, MatTabsModule, MatTooltipModule,
    MatToolbarModule, MatMenuModule, MatToolbarModule,
];
export class MaterialDesignFrameworkModule {
    constructor() {
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: MaterialDesignFrameworkModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "18.2.7", ngImport: i0, type: MaterialDesignFrameworkModule, declarations: [i1.FlexLayoutRootComponent, i2.FlexLayoutSectionComponent, i3.MaterialAddReferenceComponent, i4.MaterialOneOfComponent, i5.MaterialButtonComponent, i6.MaterialButtonGroupComponent, i7.MaterialCheckboxComponent, i8.MaterialCheckboxesComponent, i9.MaterialChipListComponent, i10.MaterialDatepickerComponent, i11.MaterialFileComponent, i12.MaterialInputComponent, i13.MaterialNumberComponent, i14.MaterialRadiosComponent, i15.MaterialSelectComponent, i16.MaterialSliderComponent, i17.MaterialStepperComponent, i18.MaterialTabsComponent, i19.MaterialTextareaComponent, i20.MaterialDesignFrameworkComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule, MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCardModule,
            MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatExpansionModule,
            MatFormFieldModule, MatIconModule, MatInputModule, MatNativeDateModule,
            MatRadioModule, MatSelectModule, MatSliderModule, MatSlideToggleModule,
            MatStepperModule, MatTabsModule, MatTooltipModule,
            MatToolbarModule, MatMenuModule, MatToolbarModule, WidgetLibraryModule,
            JsonSchemaFormModule,
            CssFrameworkModule], exports: [JsonSchemaFormModule, i1.FlexLayoutRootComponent, i2.FlexLayoutSectionComponent, i3.MaterialAddReferenceComponent, i4.MaterialOneOfComponent, i5.MaterialButtonComponent, i6.MaterialButtonGroupComponent, i7.MaterialCheckboxComponent, i8.MaterialCheckboxesComponent, i9.MaterialChipListComponent, i10.MaterialDatepickerComponent, i11.MaterialFileComponent, i12.MaterialInputComponent, i13.MaterialNumberComponent, i14.MaterialRadiosComponent, i15.MaterialSelectComponent, i16.MaterialSliderComponent, i17.MaterialStepperComponent, i18.MaterialTabsComponent, i19.MaterialTextareaComponent, i20.MaterialDesignFrameworkComponent] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: MaterialDesignFrameworkModule, providers: [
            JsonSchemaFormService,
            FrameworkLibraryService,
            WidgetLibraryService,
            { provide: Framework, useClass: MaterialDesignFramework, multi: true },
        ], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule, ANGULAR_MATERIAL_MODULES, WidgetLibraryModule,
            JsonSchemaFormModule,
            CssFrameworkModule, JsonSchemaFormModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: MaterialDesignFrameworkModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        ...ANGULAR_MATERIAL_MODULES,
                        WidgetLibraryModule,
                        JsonSchemaFormModule,
                        CssFrameworkModule
                    ],
                    declarations: [
                        ...MATERIAL_FRAMEWORK_COMPONENTS,
                    ],
                    exports: [
                        JsonSchemaFormModule,
                        ...MATERIAL_FRAMEWORK_COMPONENTS,
                    ],
                    providers: [
                        JsonSchemaFormService,
                        FrameworkLibraryService,
                        WidgetLibraryService,
                        { provide: Framework, useClass: MaterialDesignFramework, multi: true },
                    ]
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtZGVzaWduLWZyYW1ld29yay5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1mb3Jtd29ya3MtbWF0ZXJpYWwvc3JjL2xpYi9tYXRlcmlhbC1kZXNpZ24tZnJhbWV3b3JrLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFDdkUsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzNELE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMvRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDekQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDN0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDbkUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDakUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFDbEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0s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cEIsR0FBRyw2QkFBNkI7cUJBQ25DO29CQUNELFNBQVMsRUFBRTt3QkFDUCxxQkFBcUI7d0JBQ3JCLHVCQUF1Qjt3QkFDdkIsb0JBQW9CO3dCQUNwQixFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLHVCQUF1QixFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7cUJBQ3pFO2lCQUNKIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSwgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE1hdEF1dG9jb21wbGV0ZU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2F1dG9jb21wbGV0ZSc7XG5pbXBvcnQgeyBNYXRCdXR0b25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9idXR0b24nO1xuaW1wb3J0IHsgTWF0QnV0dG9uVG9nZ2xlTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvYnV0dG9uLXRvZ2dsZSc7XG5pbXBvcnQgeyBNYXRDYXJkTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY2FyZCc7XG5pbXBvcnQgeyBNYXRDaGVja2JveE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NoZWNrYm94JztcbmltcG9ydCB7IE1hdENoaXBzTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY2hpcHMnO1xuaW1wb3J0IHsgTWF0TmF0aXZlRGF0ZU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2NvcmUnO1xuaW1wb3J0IHsgTWF0RGF0ZXBpY2tlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RhdGVwaWNrZXInO1xuaW1wb3J0IHsgTWF0RXhwYW5zaW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvZXhwYW5zaW9uJztcbmltcG9ydCB7IE1hdEZvcm1GaWVsZE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2Zvcm0tZmllbGQnO1xuaW1wb3J0IHsgTWF0SWNvbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2ljb24nO1xuaW1wb3J0IHsgTWF0SW5wdXRNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9pbnB1dCc7XG5pbXBvcnQgeyBNYXRNZW51TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvbWVudSc7XG5pbXBvcnQgeyBNYXRSYWRpb01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3JhZGlvJztcbmltcG9ydCB7IE1hdFNlbGVjdE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NlbGVjdCc7XG5pbXBvcnQgeyBNYXRTbGlkZVRvZ2dsZU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3NsaWRlLXRvZ2dsZSc7XG5pbXBvcnQgeyBNYXRTbGlkZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9zbGlkZXInO1xuaW1wb3J0IHsgTWF0U3RlcHBlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3N0ZXBwZXInO1xuaW1wb3J0IHsgTWF0VGFic01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3RhYnMnO1xuaW1wb3J0IHsgTWF0VG9vbGJhck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3Rvb2xiYXInO1xuaW1wb3J0IHsgTWF0VG9vbHRpcE1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL3Rvb2x0aXAnO1xuaW1wb3J0IHtcbiAgICBGcmFtZXdvcmssXG4gICAgRnJhbWV3b3JrTGlicmFyeVNlcnZpY2UsXG4gICAgSnNvblNjaGVtYUZvcm1Nb2R1bGUsXG4gICAgSnNvblNjaGVtYUZvcm1TZXJ2aWNlLFxuICAgIFdpZGdldExpYnJhcnlNb2R1bGUsIFdpZGdldExpYnJhcnlTZXJ2aWNlXG59IGZyb20gJ0BuZy1mb3Jtd29ya3MvY29yZSc7XG5pbXBvcnQgeyBDc3NGcmFtZXdvcmtNb2R1bGUgfSBmcm9tICdAbmctZm9ybXdvcmtzL2Nzc2ZyYW1ld29yayc7XG5pbXBvcnQgeyBNYXRlcmlhbERlc2lnbkZyYW1ld29yayB9IGZyb20gJy4vbWF0ZXJpYWwtZGVzaWduLmZyYW1ld29yayc7XG5pbXBvcnQgeyBNQVRFUklBTF9GUkFNRVdPUktfQ09NUE9ORU5UUyB9IGZyb20gJy4vd2lkZ2V0cy9wdWJsaWNfYXBpJztcblxuXG4vKipcbiAqIHVudXNlZCBAYW5ndWxhci9tYXRlcmlhbCBtb2R1bGVzOlxuICogTWF0RGlhbG9nTW9kdWxlLCBNYXRHcmlkTGlzdE1vZHVsZSwgTWF0TGlzdE1vZHVsZSwgTWF0TWVudU1vZHVsZSxcbiAqIE1hdFBhZ2luYXRvck1vZHVsZSwgTWF0UHJvZ3Jlc3NCYXJNb2R1bGUsIE1hdFByb2dyZXNzU3Bpbm5lck1vZHVsZSxcbiAqIE1hdFNpZGVuYXZNb2R1bGUsIE1hdFNuYWNrQmFyTW9kdWxlLCBNYXRTb3J0TW9kdWxlLCBNYXRUYWJsZU1vZHVsZSxcbiAqICxcbiAqL1xuZXhwb3J0IGNvbnN0IEFOR1VMQVJfTUFURVJJQUxfTU9EVUxFUyA9IFtcbiAgTWF0QXV0b2NvbXBsZXRlTW9kdWxlLCBNYXRCdXR0b25Nb2R1bGUsIE1hdEJ1dHRvblRvZ2dsZU1vZHVsZSwgTWF0Q2FyZE1vZHVsZSxcbiAgTWF0Q2hlY2tib3hNb2R1bGUsIE1hdENoaXBzTW9kdWxlLCBNYXREYXRlcGlja2VyTW9kdWxlLCBNYXRFeHBhbnNpb25Nb2R1bGUsXG4gIE1hdEZvcm1GaWVsZE1vZHVsZSwgTWF0SWNvbk1vZHVsZSwgTWF0SW5wdXRNb2R1bGUsIE1hdE5hdGl2ZURhdGVNb2R1bGUsXG4gIE1hdFJhZGlvTW9kdWxlLCBNYXRTZWxlY3RNb2R1bGUsIE1hdFNsaWRlck1vZHVsZSwgTWF0U2xpZGVUb2dnbGVNb2R1bGUsXG4gIE1hdFN0ZXBwZXJNb2R1bGUsIE1hdFRhYnNNb2R1bGUsIE1hdFRvb2x0aXBNb2R1bGUsXG4gIE1hdFRvb2xiYXJNb2R1bGUsIE1hdE1lbnVNb2R1bGUsIE1hdFRvb2xiYXJNb2R1bGUsXG5dO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtcbiAgICAgICAgQ29tbW9uTW9kdWxlLFxuICAgICAgICBGb3Jtc01vZHVsZSxcbiAgICAgICAgUmVhY3RpdmVGb3Jtc01vZHVsZSxcbiAgICAgICAgLi4uQU5HVUxBUl9NQVRFUklBTF9NT0RVTEVTLFxuICAgICAgICBXaWRnZXRMaWJyYXJ5TW9kdWxlLFxuICAgICAgICBKc29uU2NoZW1hRm9ybU1vZHVsZSxcbiAgICAgICAgQ3NzRnJhbWV3b3JrTW9kdWxlXG4gICAgXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtcbiAgICAgICAgLi4uTUFURVJJQUxfRlJBTUVXT1JLX0NPTVBPTkVOVFMsXG4gICAgXSxcbiAgICBleHBvcnRzOiBbXG4gICAgICAgIEpzb25TY2hlbWFGb3JtTW9kdWxlLFxuICAgICAgICAuLi5NQVRFUklBTF9GUkFNRVdPUktfQ09NUE9ORU5UUyxcbiAgICBdLFxuICAgIHByb3ZpZGVyczogW1xuICAgICAgICBKc29uU2NoZW1hRm9ybVNlcnZpY2UsXG4gICAgICAgIEZyYW1ld29ya0xpYnJhcnlTZXJ2aWNlLFxuICAgICAgICBXaWRnZXRMaWJyYXJ5U2VydmljZSxcbiAgICAgICAgeyBwcm92aWRlOiBGcmFtZXdvcmssIHVzZUNsYXNzOiBNYXRlcmlhbERlc2lnbkZyYW1ld29yaywgbXVsdGk6IHRydWUgfSxcbiAgICBdXG59KVxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsRGVzaWduRnJhbWV3b3JrTW9kdWxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgfVxufVxuIl19