import { Injectable } from '@angular/core';
import { CssFramework } from '@ng-formworks/cssframework';
import { cssFrameworkCfgMaterialDesign } from './material-design-cssframework';
import { FlexLayoutRootComponent, FlexLayoutSectionComponent, MaterialAddReferenceComponent, MaterialButtonComponent, MaterialButtonGroupComponent, MaterialCheckboxComponent, MaterialCheckboxesComponent, MaterialChipListComponent, MaterialDatepickerComponent, MaterialDesignFrameworkComponent, MaterialFileComponent, MaterialInputComponent, MaterialNumberComponent, MaterialOneOfComponent, MaterialRadiosComponent, MaterialSelectComponent, MaterialSliderComponent, MaterialStepperComponent, MaterialTabsComponent, MaterialTextareaComponent } from './widgets/public_api';
import * as i0 from "@angular/core";
import * as i1 from "@ng-formworks/cssframework";
// Material Design Framework
// https://github.com/angular/material2
export class MaterialDesignFramework extends CssFramework {
    constructor(cssFWService) {
        super(cssFrameworkCfgMaterialDesign, cssFWService);
        this.cssFWService = cssFWService;
        this.name = 'material-design';
        this.framework = MaterialDesignFrameworkComponent;
        this.stylesheets = [
            '//fonts.googleapis.com/icon?family=Material+Icons',
            '//fonts.googleapis.com/css?family=Roboto:300,400,500,700',
        ];
        this._widgets = {
            'root': FlexLayoutRootComponent,
            'section': FlexLayoutSectionComponent,
            '$ref': MaterialAddReferenceComponent,
            'button': MaterialButtonComponent,
            'button-group': MaterialButtonGroupComponent,
            'checkbox': MaterialCheckboxComponent,
            'checkboxes': MaterialCheckboxesComponent,
            'chip-list': MaterialChipListComponent,
            'date': MaterialDatepickerComponent,
            'file': MaterialFileComponent,
            'number': MaterialNumberComponent,
            'one-of': MaterialOneOfComponent,
            'radios': MaterialRadiosComponent,
            'select': MaterialSelectComponent,
            'slider': MaterialSliderComponent,
            'stepper': MaterialStepperComponent,
            'tabs': MaterialTabsComponent,
            'text': MaterialInputComponent,
            'textarea': MaterialTextareaComponent,
            'alt-date': 'date',
            'any-of': 'one-of',
            'card': 'section',
            'color': 'text',
            'expansion-panel': 'section',
            'hidden': 'none',
            'image': 'none',
            'integer': 'number',
            'radiobuttons': 'button-group',
            'range': 'slider',
            'submit': 'button',
            'tagsinput': 'chip-list',
            'wizard': 'stepper',
        };
        this.widgets = this._widgets;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: MaterialDesignFramework, deps: [{ token: i1.CssframeworkService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: MaterialDesignFramework }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: MaterialDesignFramework, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CssframeworkService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwtZGVzaWduLmZyYW1ld29yay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLWZvcm13b3Jrcy1tYXRlcmlhbC9zcmMvbGliL21hdGVyaWFsLWRlc2lnbi5mcmFtZXdvcmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUF1QixNQUFNLDRCQUE0QixDQUFDO0FBQy9FLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQy9FLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsMEJBQTBCLEVBQzFCLDZCQUE2QixFQUM3Qix1QkFBdUIsRUFDdkIsNEJBQTRCLEVBQzVCLHlCQUF5QixFQUN6QiwyQkFBMkIsRUFDM0IseUJBQXlCLEVBQ3pCLDJCQUEyQixFQUMzQixnQ0FBZ0MsRUFDaEMscUJBQXFCLEVBQ3JCLHNCQUFzQixFQUN0Qix1QkFBdUIsRUFDdkIsc0JBQXNCLEVBQ3RCLHVCQUF1QixFQUN2Qix1QkFBdUIsRUFDdkIsdUJBQXVCLEVBQ3ZCLHdCQUF3QixFQUN4QixxQkFBcUIsRUFDckIseUJBQXlCLEVBQzFCLE1BQU0sc0JBQXNCLENBQUM7OztBQUc5Qiw0QkFBNEI7QUFDNUIsdUNBQXVDO0FBR3ZDLE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxZQUFZO0lBNkN2RCxZQUFtQixZQUFnQztRQUNqRCxLQUFLLENBQUMsNkJBQTZCLEVBQUMsWUFBWSxDQUFDLENBQUM7UUFEakMsaUJBQVksR0FBWixZQUFZLENBQW9CO1FBNUNuRCxTQUFJLEdBQUcsaUJBQWlCLENBQUM7UUFFekIsY0FBUyxHQUFHLGdDQUFnQyxDQUFDO1FBRTdDLGdCQUFXLEdBQUc7WUFDWixtREFBbUQ7WUFDbkQsMERBQTBEO1NBQzNELENBQUM7UUFFRixhQUFRLEdBQUc7WUFDVCxNQUFNLEVBQUUsdUJBQXVCO1lBQy9CLFNBQVMsRUFBRSwwQkFBMEI7WUFDckMsTUFBTSxFQUFFLDZCQUE2QjtZQUNyQyxRQUFRLEVBQUUsdUJBQXVCO1lBQ2pDLGNBQWMsRUFBRSw0QkFBNEI7WUFDNUMsVUFBVSxFQUFFLHlCQUF5QjtZQUNyQyxZQUFZLEVBQUUsMkJBQTJCO1lBQ3pDLFdBQVcsRUFBRSx5QkFBeUI7WUFDdEMsTUFBTSxFQUFFLDJCQUEyQjtZQUNuQyxNQUFNLEVBQUUscUJBQXFCO1lBQzdCLFFBQVEsRUFBRSx1QkFBdUI7WUFDakMsUUFBUSxFQUFFLHNCQUFzQjtZQUNoQyxRQUFRLEVBQUUsdUJBQXVCO1lBQ2pDLFFBQVEsRUFBRSx1QkFBdUI7WUFDakMsUUFBUSxFQUFFLHVCQUF1QjtZQUNqQyxTQUFTLEVBQUUsd0JBQXdCO1lBQ25DLE1BQU0sRUFBRSxxQkFBcUI7WUFDN0IsTUFBTSxFQUFFLHNCQUFzQjtZQUM5QixVQUFVLEVBQUUseUJBQXlCO1lBQ3JDLFVBQVUsRUFBRSxNQUFNO1lBQ2xCLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLE9BQU8sRUFBRSxNQUFNO1lBQ2YsaUJBQWlCLEVBQUUsU0FBUztZQUM1QixRQUFRLEVBQUUsTUFBTTtZQUNoQixPQUFPLEVBQUUsTUFBTTtZQUNmLFNBQVMsRUFBRSxRQUFRO1lBQ25CLGNBQWMsRUFBRSxjQUFjO1lBQzlCLE9BQU8sRUFBRSxRQUFRO1lBQ2pCLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLFFBQVEsRUFBRSxTQUFTO1NBQ3BCLENBQUM7UUFJQSxJQUFJLENBQUMsT0FBTyxHQUFDLElBQUksQ0FBQyxRQUFRLENBQUE7SUFDNUIsQ0FBQzsrR0FoRFUsdUJBQXVCO21IQUF2Qix1QkFBdUI7OzRGQUF2Qix1QkFBdUI7a0JBRG5DLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDc3NGcmFtZXdvcmssIENzc2ZyYW1ld29ya1NlcnZpY2UgfSBmcm9tICdAbmctZm9ybXdvcmtzL2Nzc2ZyYW1ld29yayc7XG5pbXBvcnQgeyBjc3NGcmFtZXdvcmtDZmdNYXRlcmlhbERlc2lnbiB9IGZyb20gJy4vbWF0ZXJpYWwtZGVzaWduLWNzc2ZyYW1ld29yayc7XG5pbXBvcnQge1xuICBGbGV4TGF5b3V0Um9vdENvbXBvbmVudCxcbiAgRmxleExheW91dFNlY3Rpb25Db21wb25lbnQsXG4gIE1hdGVyaWFsQWRkUmVmZXJlbmNlQ29tcG9uZW50LFxuICBNYXRlcmlhbEJ1dHRvbkNvbXBvbmVudCxcbiAgTWF0ZXJpYWxCdXR0b25Hcm91cENvbXBvbmVudCxcbiAgTWF0ZXJpYWxDaGVja2JveENvbXBvbmVudCxcbiAgTWF0ZXJpYWxDaGVja2JveGVzQ29tcG9uZW50LFxuICBNYXRlcmlhbENoaXBMaXN0Q29tcG9uZW50LFxuICBNYXRlcmlhbERhdGVwaWNrZXJDb21wb25lbnQsXG4gIE1hdGVyaWFsRGVzaWduRnJhbWV3b3JrQ29tcG9uZW50LFxuICBNYXRlcmlhbEZpbGVDb21wb25lbnQsXG4gIE1hdGVyaWFsSW5wdXRDb21wb25lbnQsXG4gIE1hdGVyaWFsTnVtYmVyQ29tcG9uZW50LFxuICBNYXRlcmlhbE9uZU9mQ29tcG9uZW50LFxuICBNYXRlcmlhbFJhZGlvc0NvbXBvbmVudCxcbiAgTWF0ZXJpYWxTZWxlY3RDb21wb25lbnQsXG4gIE1hdGVyaWFsU2xpZGVyQ29tcG9uZW50LFxuICBNYXRlcmlhbFN0ZXBwZXJDb21wb25lbnQsXG4gIE1hdGVyaWFsVGFic0NvbXBvbmVudCxcbiAgTWF0ZXJpYWxUZXh0YXJlYUNvbXBvbmVudFxufSBmcm9tICcuL3dpZGdldHMvcHVibGljX2FwaSc7XG5cblxuLy8gTWF0ZXJpYWwgRGVzaWduIEZyYW1ld29ya1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvbWF0ZXJpYWwyXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNYXRlcmlhbERlc2lnbkZyYW1ld29yayBleHRlbmRzIENzc0ZyYW1ld29yayB7XG4gIG5hbWUgPSAnbWF0ZXJpYWwtZGVzaWduJztcblxuICBmcmFtZXdvcmsgPSBNYXRlcmlhbERlc2lnbkZyYW1ld29ya0NvbXBvbmVudDtcblxuICBzdHlsZXNoZWV0cyA9IFtcbiAgICAnLy9mb250cy5nb29nbGVhcGlzLmNvbS9pY29uP2ZhbWlseT1NYXRlcmlhbCtJY29ucycsXG4gICAgJy8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1Sb2JvdG86MzAwLDQwMCw1MDAsNzAwJyxcbiAgXTtcblxuICBfd2lkZ2V0cyA9IHtcbiAgICAncm9vdCc6IEZsZXhMYXlvdXRSb290Q29tcG9uZW50LFxuICAgICdzZWN0aW9uJzogRmxleExheW91dFNlY3Rpb25Db21wb25lbnQsXG4gICAgJyRyZWYnOiBNYXRlcmlhbEFkZFJlZmVyZW5jZUNvbXBvbmVudCxcbiAgICAnYnV0dG9uJzogTWF0ZXJpYWxCdXR0b25Db21wb25lbnQsXG4gICAgJ2J1dHRvbi1ncm91cCc6IE1hdGVyaWFsQnV0dG9uR3JvdXBDb21wb25lbnQsXG4gICAgJ2NoZWNrYm94JzogTWF0ZXJpYWxDaGVja2JveENvbXBvbmVudCxcbiAgICAnY2hlY2tib3hlcyc6IE1hdGVyaWFsQ2hlY2tib3hlc0NvbXBvbmVudCxcbiAgICAnY2hpcC1saXN0JzogTWF0ZXJpYWxDaGlwTGlzdENvbXBvbmVudCxcbiAgICAnZGF0ZSc6IE1hdGVyaWFsRGF0ZXBpY2tlckNvbXBvbmVudCxcbiAgICAnZmlsZSc6IE1hdGVyaWFsRmlsZUNvbXBvbmVudCxcbiAgICAnbnVtYmVyJzogTWF0ZXJpYWxOdW1iZXJDb21wb25lbnQsXG4gICAgJ29uZS1vZic6IE1hdGVyaWFsT25lT2ZDb21wb25lbnQsXG4gICAgJ3JhZGlvcyc6IE1hdGVyaWFsUmFkaW9zQ29tcG9uZW50LFxuICAgICdzZWxlY3QnOiBNYXRlcmlhbFNlbGVjdENvbXBvbmVudCxcbiAgICAnc2xpZGVyJzogTWF0ZXJpYWxTbGlkZXJDb21wb25lbnQsXG4gICAgJ3N0ZXBwZXInOiBNYXRlcmlhbFN0ZXBwZXJDb21wb25lbnQsXG4gICAgJ3RhYnMnOiBNYXRlcmlhbFRhYnNDb21wb25lbnQsXG4gICAgJ3RleHQnOiBNYXRlcmlhbElucHV0Q29tcG9uZW50LFxuICAgICd0ZXh0YXJlYSc6IE1hdGVyaWFsVGV4dGFyZWFDb21wb25lbnQsXG4gICAgJ2FsdC1kYXRlJzogJ2RhdGUnLFxuICAgICdhbnktb2YnOiAnb25lLW9mJyxcbiAgICAnY2FyZCc6ICdzZWN0aW9uJyxcbiAgICAnY29sb3InOiAndGV4dCcsXG4gICAgJ2V4cGFuc2lvbi1wYW5lbCc6ICdzZWN0aW9uJyxcbiAgICAnaGlkZGVuJzogJ25vbmUnLFxuICAgICdpbWFnZSc6ICdub25lJyxcbiAgICAnaW50ZWdlcic6ICdudW1iZXInLFxuICAgICdyYWRpb2J1dHRvbnMnOiAnYnV0dG9uLWdyb3VwJyxcbiAgICAncmFuZ2UnOiAnc2xpZGVyJyxcbiAgICAnc3VibWl0JzogJ2J1dHRvbicsXG4gICAgJ3RhZ3NpbnB1dCc6ICdjaGlwLWxpc3QnLFxuICAgICd3aXphcmQnOiAnc3RlcHBlcicsXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHVibGljIGNzc0ZXU2VydmljZTpDc3NmcmFtZXdvcmtTZXJ2aWNlKXtcbiAgICBzdXBlcihjc3NGcmFtZXdvcmtDZmdNYXRlcmlhbERlc2lnbixjc3NGV1NlcnZpY2UpO1xuICAgIHRoaXMud2lkZ2V0cz10aGlzLl93aWRnZXRzXG4gIH1cblxuXG59XG4iXX0=