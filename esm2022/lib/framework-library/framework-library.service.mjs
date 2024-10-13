import { Inject, Injectable } from '@angular/core';
import { Subject, lastValueFrom } from 'rxjs';
import { hasOwn } from '../shared/utility.functions';
import { WidgetLibraryService } from '../widget-library/widget-library.service';
import { Framework } from './framework';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../widget-library/widget-library.service";
// Possible future frameworks:
// - Foundation 6:
//   http://justindavis.co/2017/06/15/using-foundation-6-in-angular-4/
//   https://github.com/zurb/foundation-sites
// - Semantic UI:
//   https://github.com/edcarroll/ng2-semantic-ui
//   https://github.com/vladotesanovic/ngSemantic
export class FrameworkLibraryService {
    constructor(frameworks, widgetLibrary, http) {
        this.frameworks = frameworks;
        this.widgetLibrary = widgetLibrary;
        this.http = http;
        this.activeFramework = null;
        this.loadExternalAssets = false;
        this.frameworkLibrary = {};
        this.frameworks.forEach(framework => this.frameworkLibrary[framework.name] = framework);
        this.defaultFramework = this.frameworks[0].name;
        //this.setFramework(this.defaultFramework);
        this.activeFrameworkName = this.defaultFramework;
        this.activeFrameworkNameSubject = new Subject();
        this.activeFrameworkName$ = this.activeFrameworkNameSubject.asObservable();
        this.setFramework(this.defaultFramework);
    }
    setLoadExternalAssets(loadExternalAssets = true) {
        this.loadExternalAssets = !!loadExternalAssets;
    }
    setFramework(framework = this.defaultFramework, loadExternalAssets = this.loadExternalAssets) {
        this.activeFramework =
            typeof framework === 'string' && this.hasFramework(framework) ?
                this.frameworkLibrary[framework] :
                typeof framework === 'object' && hasOwn(framework, 'framework') ?
                    framework :
                    this.frameworkLibrary[this.defaultFramework];
        if (this.activeFramework.name != this.activeFrameworkName) {
            this.activeFrameworkName = this.activeFramework.name;
            this.activeFrameworkNameSubject.next(this.activeFrameworkName);
        }
        return this.registerFrameworkWidgets(this.activeFramework);
    }
    registerFrameworkWidgets(framework) {
        return hasOwn(framework, 'widgets') ?
            this.widgetLibrary.registerFrameworkWidgets(framework.widgets) :
            this.widgetLibrary.unRegisterFrameworkWidgets();
    }
    hasFramework(type) {
        return hasOwn(this.frameworkLibrary, type);
    }
    getFramework() {
        if (!this.activeFramework) {
            this.setFramework('default', true);
        }
        return this.activeFramework.framework;
    }
    getFrameworkList() {
        return this.frameworks.map(fw => {
            return { name: fw.name, text: fw.text };
        });
    }
    getFrameworkWidgets() {
        return this.activeFramework.widgets || {};
    }
    getFrameworkStylesheets(load = this.loadExternalAssets) {
        return (load && this.activeFramework.stylesheets) || [];
    }
    getFrameworkScripts(load = this.loadExternalAssets) {
        return (load && this.activeFramework.scripts) || [];
    }
    //applies to CssFramework classes
    getFrameworkConfig(existingFramework) {
        let actFramework = existingFramework || this.activeFramework;
        return actFramework.config;
    }
    //this will load the list of assets to be loaded at runtime in case the dependent framework
    //scripts and styles are include locally with the parent app
    getFrameworkAssetConfig(existingFramework, useAssetRelPath = true) {
        let actFramework = existingFramework || this.activeFramework;
        //TODO move this into config
        const assetConfigPath = `assets/${actFramework.name}/cssframework`;
        const assetConfigURL = `${assetConfigPath}/assets.json`;
        let subs = this.http
            .get(assetConfigURL, { responseType: 'text' });
        //.subscribe(assetConfig => {
        //  assetConfig
        //})
        return lastValueFrom(subs).then(assetCfgText => {
            let assetCfg = JSON.parse(assetCfgText);
            if (useAssetRelPath) {
                assetCfg.stylesheets = assetCfg.stylesheets.map(styleLink => {
                    //ignore relative path if url starts with known protocol or //
                    let nonRelPrefixes = ["/", "//", "http:", "https:"]; //"//" list for completeness 
                    let isNonRel = false;
                    nonRelPrefixes.forEach(prefix => {
                        isNonRel = isNonRel || styleLink.indexOf(prefix) == 0;
                    });
                    if (isNonRel) {
                        return styleLink;
                    }
                    return `${assetConfigPath}/${styleLink}`;
                });
                assetCfg.scripts = assetCfg.scripts.map(scriptLink => {
                    return `${assetConfigPath}/${scriptLink}`;
                });
            }
            return assetCfg;
        });
    }
    //applies to CssFramework classes
    getFrameworkThemes() {
        let cssfwConfig = this.getFrameworkConfig();
        let themes;
        if (cssfwConfig) {
            themes = cssfwConfig?.widgetstyles?.__themes__ || [];
        }
        return themes;
    }
    //applies to CssFramework classes
    requestThemeChange(name, validateThemeExists = false, existingFramework) {
        let actFramework = existingFramework || this.activeFramework;
        if (actFramework.requestThemeChange) {
            if (validateThemeExists) {
                let themes = this.getFrameworkThemes();
                let foundThemes = themes.filter(thm => { return thm.name == name; });
                if (!foundThemes || foundThemes.length == 0) {
                    return false;
                }
            }
            actFramework.requestThemeChange(name);
            return true;
        }
    }
    //applies to CssFramework classes
    getActiveTheme(existingFramework) {
        let actFramework = existingFramework || this.activeFramework;
        if (actFramework.getActiveTheme) {
            return actFramework.getActiveTheme();
        }
    }
    //applies to CssFramework classes
    registerTheme(newTheme, existingFramework) {
        let actFramework = existingFramework || this.activeFramework;
        if (actFramework.registerTheme) {
            return actFramework.registerTheme(newTheme);
        }
    }
    //applies to CssFramework classes
    unregisterTheme(name, existingFramework) {
        let actFramework = existingFramework || this.activeFramework;
        if (actFramework.registerTheme) {
            return actFramework.unregisterTheme(name);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: FrameworkLibraryService, deps: [{ token: Framework }, { token: WidgetLibraryService }, { token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: FrameworkLibraryService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.7", ngImport: i0, type: FrameworkLibraryService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [Framework]
                }] }, { type: i2.WidgetLibraryService, decorators: [{
                    type: Inject,
                    args: [WidgetLibraryService]
                }] }, { type: i1.HttpClient }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWV3b3JrLWxpYnJhcnkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLWZvcm13b3Jrcy1jb3JlL3NyYy9saWIvZnJhbWV3b3JrLWxpYnJhcnkvZnJhbWV3b3JrLWxpYnJhcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQWMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDckQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDaEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7OztBQUV4Qyw4QkFBOEI7QUFDOUIsa0JBQWtCO0FBQ2xCLHNFQUFzRTtBQUN0RSw2Q0FBNkM7QUFDN0MsaUJBQWlCO0FBQ2pCLGlEQUFpRDtBQUNqRCxpREFBaUQ7QUFLakQsTUFBTSxPQUFPLHVCQUF1QjtJQVlsQyxZQUM2QixVQUFpQixFQUNOLGFBQW1DLEVBQ2pFLElBQWdCO1FBRkcsZUFBVSxHQUFWLFVBQVUsQ0FBTztRQUNOLGtCQUFhLEdBQWIsYUFBYSxDQUFzQjtRQUNqRSxTQUFJLEdBQUosSUFBSSxDQUFZO1FBZDFCLG9CQUFlLEdBQWMsSUFBSSxDQUFDO1FBR2xDLHVCQUFrQixHQUFHLEtBQUssQ0FBQztRQUUzQixxQkFBZ0IsR0FBa0MsRUFBRSxDQUFDO1FBV25ELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQ2xDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUNsRCxDQUFDO1FBQ0YsSUFBSSxDQUFDLGdCQUFnQixHQUFH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QUFZLENBQUMsYUFBYSxFQUFDLENBQUM7WUFDN0IsT0FBTyxZQUFZLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVDLENBQUM7SUFDSCxDQUFDOzhHQS9LUSx1QkFBdUIsa0JBYXhCLFNBQVMsYUFDVCxvQkFBb0I7a0hBZG5CLHVCQUF1QixjQUZ0QixNQUFNOzsyRkFFUCx1QkFBdUI7a0JBSG5DLFVBQVU7bUJBQUM7b0JBQ1YsVUFBVSxFQUFFLE1BQU07aUJBQ25COzswQkFjSSxNQUFNOzJCQUFDLFNBQVM7OzBCQUNoQixNQUFNOzJCQUFDLG9CQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQgfSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIGxhc3RWYWx1ZUZyb20gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGhhc093biB9IGZyb20gJy4uL3NoYXJlZC91dGlsaXR5LmZ1bmN0aW9ucyc7XG5pbXBvcnQgeyBXaWRnZXRMaWJyYXJ5U2VydmljZSB9IGZyb20gJy4uL3dpZGdldC1saWJyYXJ5L3dpZGdldC1saWJyYXJ5LnNlcnZpY2UnO1xuaW1wb3J0IHsgRnJhbWV3b3JrIH0gZnJvbSAnLi9mcmFtZXdvcmsnO1xuXG4vLyBQb3NzaWJsZSBmdXR1cmUgZnJhbWV3b3Jrczpcbi8vIC0gRm91bmRhdGlvbiA2OlxuLy8gICBodHRwOi8vanVzdGluZGF2aXMuY28vMjAxNy8wNi8xNS91c2luZy1mb3VuZGF0aW9uLTYtaW4tYW5ndWxhci00L1xuLy8gICBodHRwczovL2dpdGh1Yi5jb20venVyYi9mb3VuZGF0aW9uLXNpdGVzXG4vLyAtIFNlbWFudGljIFVJOlxuLy8gICBodHRwczovL2dpdGh1Yi5jb20vZWRjYXJyb2xsL25nMi1zZW1hbnRpYy11aVxuLy8gICBodHRwczovL2dpdGh1Yi5jb20vdmxhZG90ZXNhbm92aWMvbmdTZW1hbnRpY1xuXG5ASW5qZWN0YWJsZSh7XG4gIHByb3ZpZGVkSW46ICdyb290Jyxcbn0pXG5leHBvcnQgY2xhc3MgRnJhbWV3b3JrTGlicmFyeVNlcnZpY2Uge1xuICBhY3RpdmVGcmFtZXdvcms6IEZyYW1ld29yayA9IG51bGw7XG4gIHN0eWxlc2hlZXRzOiAoSFRNTFN0eWxlRWxlbWVudHxIVE1MTGlua0VsZW1lbnQpW107XG4gIHNjcmlwdHM6IEhUTUxTY3JpcHRFbGVtZW50W107XG4gIGxvYWRFeHRlcm5hbEFzc2V0cyA9IGZhbHNlO1xuICBkZWZhdWx0RnJhbWV3b3JrOiBzdHJpbmc7XG4gIGZyYW1ld29ya0xpYnJhcnk6IHsgW25hbWU6IHN0cmluZ106IEZyYW1ld29yayB9ID0ge307XG5cbiAgYWN0aXZlRnJhbWV3b3JrTmFtZSQ6IE9ic2VydmFibGU8c3RyaW5nPjtcbiAgcHJpdmF0ZSBhY3RpdmVGcmFtZXdvcmtOYW1lU3ViamVjdDogU3ViamVjdDxzdHJpbmc+O1xuICBwcml2YXRlIGFjdGl2ZUZyYW1ld29ya05hbWU6c3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoRnJhbWV3b3JrKSBwcml2YXRlIGZyYW1ld29ya3M6IGFueVtdLFxuICAgIEBJbmplY3QoV2lkZ2V0TGlicmFyeVNlcnZpY2UpIHByaXZhdGUgd2lkZ2V0TGlicmFyeTogV2lkZ2V0TGlicmFyeVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxuICApIHtcbiAgICB0aGlzLmZyYW1ld29ya3MuZm9yRWFjaChmcmFtZXdvcmsgPT5cbiAgICAgIHRoaXMuZnJhbWV3b3JrTGlicmFyeVtmcmFtZXdvcmsubmFtZV0gPSBmcmFtZXdvcmtcbiAgICApO1xuICAgIHRoaXMuZGVmYXVsdEZyYW1ld29yayA9IHRoaXMuZnJhbWV3b3Jrc1swXS5uYW1lO1xuICAgIC8vdGhpcy5zZXRGcmFtZXdvcmsodGhpcy5kZWZhdWx0RnJhbWV3b3JrKTtcbiAgICBcbiAgICB0aGlzLmFjdGl2ZUZyYW1ld29ya05hbWU9dGhpcy5kZWZhdWx0RnJhbWV3b3JrO1xuICAgIHRoaXMuYWN0aXZlRnJhbWV3b3JrTmFtZVN1YmplY3QgPSBuZXcgU3ViamVjdDxzdHJpbmc+KCk7XG4gICAgdGhpcy5hY3RpdmVGcmFtZXdvcmtOYW1lJCA9IHRoaXMuYWN0aXZlRnJhbWV3b3JrTmFtZVN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XG4gICAgdGhpcy5zZXRGcmFtZXdvcmsodGhpcy5kZWZhdWx0RnJhbWV3b3JrKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRMb2FkRXh0ZXJuYWxBc3NldHMobG9hZEV4dGVybmFsQXNzZXRzID0gdHJ1ZSk6IHZvaWQge1xuICAgIHRoaXMubG9hZEV4dGVybmFsQXNzZXRzID0gISFsb2FkRXh0ZXJuYWxBc3NldHM7XG4gIH1cblxuICBwdWJsaWMgc2V0RnJhbWV3b3JrKFxuICAgIGZyYW1ld29yazogc3RyaW5nfEZyYW1ld29yayA9IHRoaXMuZGVmYXVsdEZyYW1ld29yayxcbiAgICBsb2FkRXh0ZXJuYWxBc3NldHMgPSB0aGlzLmxvYWRFeHRlcm5hbEFzc2V0c1xuICApOiBib29sZWFuIHtcbiAgICB0aGlzLmFjdGl2ZUZyYW1ld29yayA9XG4gICAgICB0eXBlb2YgZnJhbWV3b3JrID09PSAnc3RyaW5nJyAmJiB0aGlzLmhhc0ZyYW1ld29yayhmcmFtZXdvcmspID9cbiAgICAgICAgdGhpcy5mcmFtZXdvcmtMaWJyYXJ5W2ZyYW1ld29ya10gOlxuICAgICAgdHlwZW9mIGZyYW1ld29yayA9PT0gJ29iamVjdCcgJiYgaGFzT3duKGZyYW1ld29yaywgJ2ZyYW1ld29yaycpID9cbiAgICAgICAgZnJhbWV3b3JrIDpcbiAgICAgICAgdGhpcy5mcmFtZXdvcmtMaWJyYXJ5W3RoaXMuZGVmYXVsdEZyYW1ld29ya107XG4gICAgaWYodGhpcy5hY3RpdmVGcmFtZXdvcmsubmFtZSAhPXRoaXMuYWN0aXZlRnJhbWV3b3JrTmFtZSl7XG4gICAgICB0aGlzLmFjdGl2ZUZyYW1ld29ya05hbWU9dGhpcy5hY3RpdmVGcmFtZXdvcmsubmFtZTtcbiAgICAgIHRoaXMuYWN0aXZlRnJhbWV3b3JrTmFtZVN1YmplY3QubmV4dCh0aGlzLmFjdGl2ZUZyYW1ld29ya05hbWUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5yZWdpc3RlckZyYW1ld29ya1dpZGdldHModGhpcy5hY3RpdmVGcmFtZXdvcmspO1xuICB9XG5cbiAgcmVnaXN0ZXJGcmFtZXdvcmtXaWRnZXRzKGZyYW1ld29yazogRnJhbWV3b3JrKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGhhc093bihmcmFtZXdvcmssICd3aWRnZXRzJykgP1xuICAgICAgdGhpcy53aWRnZXRMaWJyYXJ5LnJlZ2lzdGVyRnJhbWV3b3JrV2lkZ2V0cyhmcmFtZXdvcmsud2lkZ2V0cykgOlxuICAgICAgdGhpcy53aWRnZXRMaWJyYXJ5LnVuUmVnaXN0ZXJGcmFtZXdvcmtXaWRnZXRzKCk7XG4gIH1cblxuICBwdWJsaWMgaGFzRnJhbWV3b3JrKHR5cGU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBoYXNPd24odGhpcy5mcmFtZXdvcmtMaWJyYXJ5LCB0eXBlKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRGcmFtZXdvcmsoKTogYW55IHtcbiAgICBpZiAoIXRoaXMuYWN0aXZlRnJhbWV3b3JrKSB7IHRoaXMuc2V0RnJhbWV3b3JrKCdkZWZhdWx0JywgdHJ1ZSk7IH1cbiAgICByZXR1cm4gdGhpcy5hY3RpdmVGcmFtZXdvcmsuZnJhbWV3b3JrO1xuICB9XG5cbiAgcHVibGljIGdldEZyYW1ld29ya0xpc3QoKTp7bmFtZTpzdHJpbmcsdGV4dDpzdHJpbmd9W10ge1xuICAgIHJldHVybiB0aGlzLmZyYW1ld29ya3MubWFwKGZ3PT57XG4gICAgICByZXR1cm4ge25hbWU6ZncubmFtZSx0ZXh0OmZ3LnRleHR9O1xuICAgIH0pXG4gICAgXG4gIH1cblxuICBwdWJsaWMgZ2V0RnJhbWV3b3JrV2lkZ2V0cygpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLmFjdGl2ZUZyYW1ld29yay53aWRnZXRzIHx8IHt9O1xuICB9XG5cbiAgXG5cbiAgcHVibGljIGdldEZyYW1ld29ya1N0eWxlc2hlZXRzKGxvYWQ6IGJvb2xlYW4gPSB0aGlzLmxvYWRFeHRlcm5hbEFzc2V0cyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gKGxvYWQgJiYgdGhpcy5hY3RpdmVGcmFtZXdvcmsuc3R5bGVzaGVldHMpIHx8IFtdO1xuICB9XG5cbiAgcHVibGljIGdldEZyYW1ld29ya1NjcmlwdHMobG9hZDogYm9vbGVhbiA9IHRoaXMubG9hZEV4dGVybmFsQXNzZXRzKTogc3RyaW5nW10ge1xuICAgIHJldHVybiAobG9hZCAmJiB0aGlzLmFjdGl2ZUZyYW1ld29yay5zY3JpcHRzKSB8fCBbXTtcbiAgfVxuXG4gIC8vYXBwbGllcyB0byBDc3NGcmFtZXdvcmsgY2xhc3Nlc1xuICBwdWJsaWMgZ2V0RnJhbWV3b3JrQ29uZmlnKGV4aXN0aW5nRnJhbWV3b3JrPzphbnkpOiBhbnkge1xuICAgIGxldCBhY3RGcmFtZXdvcms6RnJhbWV3b3JrJiB7IFtrZXk6IHN0cmluZ106IGFueTsgfT1leGlzdGluZ0ZyYW1ld29ya3x8dGhpcy5hY3RpdmVGcmFtZXdvcms7XG4gICAgcmV0dXJuIGFjdEZyYW1ld29yay5jb25maWc7XG4gIH1cblxuICAvL3RoaXMgd2lsbCBsb2FkIHRoZSBsaXN0IG9mIGFzc2V0cyB0byBiZSBsb2FkZWQgYXQgcnVudGltZSBpbiBjYXNlIHRoZSBkZXBlbmRlbnQgZnJhbWV3b3JrXG4gIC8vc2NyaXB0cyBhbmQgc3R5bGVzIGFyZSBpbmNsdWRlIGxvY2FsbHkgd2l0aCB0aGUgcGFyZW50IGFwcFxuICBwdWJsaWMgZ2V0RnJhbWV3b3JrQXNzZXRDb25maWcoZXhpc3RpbmdGcmFtZXdvcms/OmFueSx1c2VBc3NldFJlbFBhdGg9dHJ1ZSk6UHJvbWlzZTx7c3R5bGVzaGVldHM6c3RyaW5nW10sc2NyaXB0czpzdHJpbmdbXX0+e1xuICAgIGxldCBhY3RGcmFtZXdvcms6RnJhbWV3b3JrJiB7IFtrZXk6IHN0cmluZ106IGFueTsgfT1leGlzdGluZ0ZyYW1ld29ya3x8dGhpcy5hY3RpdmVGcmFtZXdvcms7XG4gICAgLy9UT0RPIG1vdmUgdGhpcyBpbnRvIGNvbmZpZ1xuICAgIGNvbnN0IGFzc2V0Q29uZmlnUGF0aCA9IGBhc3NldHMvJHthY3RGcmFtZXdvcmsubmFtZX0vY3NzZnJhbWV3b3JrYFxuICAgIGNvbnN0IGFzc2V0Q29uZmlnVVJMID0gYCR7YXNzZXRDb25maWdQYXRofS9hc3NldHMuanNvbmA7XG4gICAgbGV0IHN1YnM9dGhpcy5odHRwXG4gICAgICAuZ2V0KGFzc2V0Q29uZmlnVVJMLCB7IHJlc3BvbnNlVHlwZTogJ3RleHQnIH0pXG4gICAgICAvLy5zdWJzY3JpYmUoYXNzZXRDb25maWcgPT4ge1xuICAgICAgLy8gIGFzc2V0Q29uZmlnXG4gICAgICAvL30pXG4gICAgICBcbiAgICAgIHJldHVybiBsYXN0VmFsdWVGcm9tKHN1YnMpLnRoZW4oYXNzZXRDZmdUZXh0PT57XG4gICAgICAgIGxldCBhc3NldENmZz1KU09OLnBhcnNlKGFzc2V0Q2ZnVGV4dCk7XG4gICAgICAgIGlmKHVzZUFzc2V0UmVsUGF0aCl7XG4gICAgICAgICAgYXNzZXRDZmcuc3R5bGVzaGVldHM9YXNzZXRDZmcuc3R5bGVzaGVldHMubWFwKHN0eWxlTGluaz0+e1xuICAgICAgICAgICAgLy9pZ25vcmUgcmVsYXRpdmUgcGF0aCBpZiB1cmwgc3RhcnRzIHdpdGgga25vd24gcHJvdG9jb2wgb3IgLy9cbiAgICAgICAgICAgIGxldCBub25SZWxQcmVmaXhlcz1bXCIvXCIsXCIvL1wiLFwiaHR0cDpcIixcImh0dHBzOlwiXTsvL1wiLy9cIiBsaXN0IGZvciBjb21wbGV0ZW5lc3MgXG4gICAgICAgICAgICBsZXQgaXNOb25SZWw9ZmFsc2U7XG4gICAgICAgICAgICBub25SZWxQcmVmaXhlcy5mb3JFYWNoKHByZWZpeD0+e1xuICAgICAgICAgICAgICBpc05vblJlbD1pc05vblJlbHx8c3R5bGVMaW5rLmluZGV4T2YocHJlZml4KT09MDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBpZihpc05vblJlbCl7XG4gICAgICAgICAgICAgIHJldHVybiBzdHlsZUxpbms7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYCR7YXNzZXRDb25maWdQYXRofS8ke3N0eWxlTGlua31gO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgYXNzZXRDZmcuc2NyaXB0cz1hc3NldENmZy5zY3JpcHRzLm1hcChzY3JpcHRMaW5rPT57XG4gICAgICAgICAgICByZXR1cm4gYCR7YXNzZXRDb25maWdQYXRofS8ke3NjcmlwdExpbmt9YDtcbiAgICAgICAgICB9KVxuICAgICAgICB9ICAgXG4gICAgICAgIHJldHVybiBhc3NldENmZ1xuICAgICAgfSk7XG4gIH1cblxuICAvL2FwcGxpZXMgdG8gQ3NzRnJhbWV3b3JrIGNsYXNzZXNcbiAgcHVibGljIGdldEZyYW1ld29ya1RoZW1lcygpOntuYW1lOnN0cmluZyx0ZXh0OnN0cmluZ31bXSB7XG4gICAgbGV0IGNzc2Z3Q29uZmlnPXRoaXMuZ2V0RnJhbWV3b3JrQ29uZmlnKCk7XG4gICAgbGV0IHRoZW1lcztcbiAgICBpZihjc3Nmd0NvbmZpZyl7XG4gICAgICB0aGVtZXM9Y3NzZndDb25maWc/LndpZGdldHN0eWxlcz8uX190aGVtZXNfX3x8W11cbiAgICB9XG4gICAgcmV0dXJuIHRoZW1lc1xuICB9XG5cbiAgLy9hcHBsaWVzIHRvIENzc0ZyYW1ld29yayBjbGFzc2VzXG4gIHB1YmxpYyByZXF1ZXN0VGhlbWVDaGFuZ2UobmFtZTpzdHJpbmcsdmFsaWRhdGVUaGVtZUV4aXN0czpib29sZWFuPWZhbHNlLGV4aXN0aW5nRnJhbWV3b3JrPzphbnkpe1xuICAgIGxldCBhY3RGcmFtZXdvcms6RnJhbWV3b3JrJiB7IFtrZXk6IHN0cmluZ106IGFueTsgfT1leGlzdGluZ0ZyYW1ld29ya3x8dGhpcy5hY3RpdmVGcmFtZXdvcms7XG4gICAgaWYoYWN0RnJhbWV3b3JrLnJlcXVlc3RUaGVtZUNoYW5nZSl7XG4gICAgICBpZih2YWxpZGF0ZVRoZW1lRXhpc3RzKXsgIFxuICAgICAgICBsZXQgdGhlbWVzPXRoaXMuZ2V0RnJhbWV3b3JrVGhlbWVzKCk7XG4gICAgICAgIGxldCBmb3VuZFRoZW1lcz10aGVtZXMuZmlsdGVyKHRobT0+e3JldHVybiB0aG0ubmFtZT09bmFtZX0pO1xuICAgICAgICBpZighZm91bmRUaGVtZXN8fCBmb3VuZFRoZW1lcy5sZW5ndGg9PTApe1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgYWN0RnJhbWV3b3JrLnJlcXVlc3RUaGVtZUNoYW5nZShuYW1lKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICAvL2FwcGxpZXMgdG8gQ3NzRnJhbWV3b3JrIGNsYXNzZXNcbiAgcHVibGljIGdldEFjdGl2ZVRoZW1lKGV4aXN0aW5nRnJhbWV3b3JrPzphbnkpOntuYW1lOnN0cmluZyx0ZXh0OnN0cmluZ317XG4gICAgbGV0IGFjdEZyYW1ld29yazpGcmFtZXdvcmsmIHsgW2tleTogc3RyaW5nXTogYW55OyB9PWV4aXN0aW5nRnJhbWV3b3JrfHx0aGlzLmFjdGl2ZUZyYW1ld29yaztcbiAgICBpZihhY3RGcmFtZXdvcmsuZ2V0QWN0aXZlVGhlbWUpe1xuICAgICAgcmV0dXJuIGFjdEZyYW1ld29yay5nZXRBY3RpdmVUaGVtZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vYXBwbGllcyB0byBDc3NGcmFtZXdvcmsgY2xhc3Nlc1xuICBwdWJsaWMgcmVnaXN0ZXJUaGVtZShuZXdUaGVtZTp7bmFtZTpzdHJpbmcsdGV4dDpzdHJpbmd9LGV4aXN0aW5nRnJhbWV3b3JrPzphbnkpOmJvb2xlYW57XG4gICAgbGV0IGFjdEZyYW1ld29yazpGcmFtZXdvcmsmIHsgW2tleTogc3RyaW5nXTogYW55OyB9PWV4aXN0aW5nRnJhbWV3b3JrfHx0aGlzLmFjdGl2ZUZyYW1ld29yaztcbiAgICBpZihhY3RGcmFtZXdvcmsucmVnaXN0ZXJUaGVtZSl7XG4gICAgICByZXR1cm4gYWN0RnJhbWV3b3JrLnJlZ2lzdGVyVGhlbWUobmV3VGhlbWUpO1xuICAgIH1cbiAgfVxuXG4gICAgLy9hcHBsaWVzIHRvIENzc0ZyYW1ld29yayBjbGFzc2VzXG4gICAgcHVibGljIHVucmVnaXN0ZXJUaGVtZShuYW1lOnN0cmluZyxleGlzdGluZ0ZyYW1ld29yaz86YW55KTpib29sZWFue1xuICAgICAgbGV0IGFjdEZyYW1ld29yazpGcmFtZXdvcmsmIHsgW2tleTogc3RyaW5nXTogYW55OyB9PWV4aXN0aW5nRnJhbWV3b3JrfHx0aGlzLmFjdGl2ZUZyYW1ld29yaztcbiAgICAgIGlmKGFjdEZyYW1ld29yay5yZWdpc3RlclRoZW1lKXtcbiAgICAgICAgcmV0dXJuIGFjdEZyYW1ld29yay51bnJlZ2lzdGVyVGhlbWUobmFtZSk7XG4gICAgICB9XG4gICAgfVxufVxuIl19