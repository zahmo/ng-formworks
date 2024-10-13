import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WidgetLibraryService } from '../widget-library/widget-library.service';
import { Framework } from './framework';
import * as i0 from "@angular/core";
export declare class FrameworkLibraryService {
    private frameworks;
    private widgetLibrary;
    private http;
    activeFramework: Framework;
    stylesheets: (HTMLStyleElement | HTMLLinkElement)[];
    scripts: HTMLScriptElement[];
    loadExternalAssets: boolean;
    defaultFramework: string;
    frameworkLibrary: {
        [name: string]: Framework;
    };
    activeFrameworkName$: Observable<string>;
    private activeFrameworkNameSubject;
    private activeFrameworkName;
    constructor(frameworks: any[], widgetLibrary: WidgetLibraryService, http: HttpClient);
    setLoadExternalAssets(loadExternalAssets?: boolean): void;
    setFramework(framework?: string | Framework, loadExternalAssets?: boolean): boolean;
    registerFrameworkWidgets(framework: Framework): boolean;
    hasFramework(type: string): boolean;
    getFramework(): any;
    getFrameworkList(): {
        name: string;
        text: string;
    }[];
    getFrameworkWidgets(): any;
    getFrameworkStylesheets(load?: boolean): string[];
    getFrameworkScripts(load?: boolean): string[];
    getFrameworkConfig(existingFramework?: any): any;
    getFrameworkAssetConfig(existingFramework?: any, useAssetRelPath?: boolean): Promise<{
        stylesheets: string[];
        scripts: string[];
    }>;
    getFrameworkThemes(): {
        name: string;
        text: string;
    }[];
    requestThemeChange(name: string, validateThemeExists?: boolean, existingFramework?: any): boolean;
    getActiveTheme(existingFramework?: any): {
        name: string;
        text: string;
    };
    registerTheme(newTheme: {
        name: string;
        text: string;
    }, existingFramework?: any): boolean;
    unregisterTheme(name: string, existingFramework?: any): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<FrameworkLibraryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FrameworkLibraryService>;
}
