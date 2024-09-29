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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: FrameworkLibraryService, deps: [{ token: Framework }, { token: WidgetLibraryService }, { token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: FrameworkLibraryService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: FrameworkLibraryService, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWV3b3JrLWxpYnJhcnkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLWZvcm13b3Jrcy1jb3JlL3NyYy9saWIvZnJhbWV3b3JrLWxpYnJhcnkvZnJhbWV3b3JrLWxpYnJhcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRCxPQUFPLEVBQWMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDckQsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sMENBQTBDLENBQUM7QUFDaEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7OztBQUV4Qyw4QkFBOEI7QUFDOUIsa0JBQWtCO0FBQ2xCLHNFQUFzRTtBQUN0RSw2Q0FBNkM7QUFDN0MsaUJBQWlCO0FBQ2pCLGlEQUFpRDtBQUNqRCxpREFBaUQ7QUFLakQsTUFBTSxPQUFPLHVCQUF1QjtJQVlsQyxZQUM2QixVQUFpQixFQUNOLGFBQW1DLEVBQ2pFLElBQWdCO1FBRkcsZUFBVSxHQUFWLFVBQVUsQ0FBTztRQUNOLGtCQUFhLEdBQWIsYUFBYSxDQUFzQjtRQUNqRSxTQUFJLEdBQUosSUFBSSxDQUFZO1FBZDFCLG9CQUFlLEdBQWMsSUFBSSxDQUFDO1FBR2xDLHVCQUFrQixHQUFHLEtBQUssQ0FBQztRQUUzQixxQkFBZ0IsR0FBa0MsRUFBRSxDQUFDO1FBV25ELElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQ2xDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUNsRCxDQUFDO1FBQ0YsSUFBSSxDQUFDLGdCQUFnQixHQUFH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QixTQUFTLGFBQ1Qsb0JBQW9CO21IQWRuQix1QkFBdUIsY0FGdEIsTUFBTTs7NEZBRVAsdUJBQXVCO2tCQUhuQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQjs7MEJBY0ksTUFBTTsyQkFBQyxTQUFTOzswQkFDaEIsTUFBTTsyQkFBQyxvQkFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uL2h0dHAnO1xuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0LCBsYXN0VmFsdWVGcm9tIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBoYXNPd24gfSBmcm9tICcuLi9zaGFyZWQvdXRpbGl0eS5mdW5jdGlvbnMnO1xuaW1wb3J0IHsgV2lkZ2V0TGlicmFyeVNlcnZpY2UgfSBmcm9tICcuLi93aWRnZXQtbGlicmFyeS93aWRnZXQtbGlicmFyeS5zZXJ2aWNlJztcbmltcG9ydCB7IEZyYW1ld29yayB9IGZyb20gJy4vZnJhbWV3b3JrJztcblxuLy8gUG9zc2libGUgZnV0dXJlIGZyYW1ld29ya3M6XG4vLyAtIEZvdW5kYXRpb24gNjpcbi8vICAgaHR0cDovL2p1c3RpbmRhdmlzLmNvLzIwMTcvMDYvMTUvdXNpbmctZm91bmRhdGlvbi02LWluLWFuZ3VsYXItNC9cbi8vICAgaHR0cHM6Ly9naXRodWIuY29tL3p1cmIvZm91bmRhdGlvbi1zaXRlc1xuLy8gLSBTZW1hbnRpYyBVSTpcbi8vICAgaHR0cHM6Ly9naXRodWIuY29tL2VkY2Fycm9sbC9uZzItc2VtYW50aWMtdWlcbi8vICAgaHR0cHM6Ly9naXRodWIuY29tL3ZsYWRvdGVzYW5vdmljL25nU2VtYW50aWNcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG59KVxuZXhwb3J0IGNsYXNzIEZyYW1ld29ya0xpYnJhcnlTZXJ2aWNlIHtcbiAgYWN0aXZlRnJhbWV3b3JrOiBGcmFtZXdvcmsgPSBudWxsO1xuICBzdHlsZXNoZWV0czogKEhUTUxTdHlsZUVsZW1lbnR8SFRNTExpbmtFbGVtZW50KVtdO1xuICBzY3JpcHRzOiBIVE1MU2NyaXB0RWxlbWVudFtdO1xuICBsb2FkRXh0ZXJuYWxBc3NldHMgPSBmYWxzZTtcbiAgZGVmYXVsdEZyYW1ld29yazogc3RyaW5nO1xuICBmcmFtZXdvcmtMaWJyYXJ5OiB7IFtuYW1lOiBzdHJpbmddOiBGcmFtZXdvcmsgfSA9IHt9O1xuXG4gIGFjdGl2ZUZyYW1ld29ya05hbWUkOiBPYnNlcnZhYmxlPHN0cmluZz47XG4gIHByaXZhdGUgYWN0aXZlRnJhbWV3b3JrTmFtZVN1YmplY3Q6IFN1YmplY3Q8c3RyaW5nPjtcbiAgcHJpdmF0ZSBhY3RpdmVGcmFtZXdvcmtOYW1lOnN0cmluZztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KEZyYW1ld29yaykgcHJpdmF0ZSBmcmFtZXdvcmtzOiBhbnlbXSxcbiAgICBASW5qZWN0KFdpZGdldExpYnJhcnlTZXJ2aWNlKSBwcml2YXRlIHdpZGdldExpYnJhcnk6IFdpZGdldExpYnJhcnlTZXJ2aWNlLFxuICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcbiAgKSB7XG4gICAgdGhpcy5mcmFtZXdvcmtzLmZvckVhY2goZnJhbWV3b3JrID0+XG4gICAgICB0aGlzLmZyYW1ld29ya0xpYnJhcnlbZnJhbWV3b3JrLm5hbWVdID0gZnJhbWV3b3JrXG4gICAgKTtcbiAgICB0aGlzLmRlZmF1bHRGcmFtZXdvcmsgPSB0aGlzLmZyYW1ld29ya3NbMF0ubmFtZTtcbiAgICAvL3RoaXMuc2V0RnJhbWV3b3JrKHRoaXMuZGVmYXVsdEZyYW1ld29yayk7XG4gICAgXG4gICAgdGhpcy5hY3RpdmVGcmFtZXdvcmtOYW1lPXRoaXMuZGVmYXVsdEZyYW1ld29yaztcbiAgICB0aGlzLmFjdGl2ZUZyYW1ld29ya05hbWVTdWJqZWN0ID0gbmV3IFN1YmplY3Q8c3RyaW5nPigpO1xuICAgIHRoaXMuYWN0aXZlRnJhbWV3b3JrTmFtZSQgPSB0aGlzLmFjdGl2ZUZyYW1ld29ya05hbWVTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICAgIHRoaXMuc2V0RnJhbWV3b3JrKHRoaXMuZGVmYXVsdEZyYW1ld29yayk7XG4gIH1cblxuICBwdWJsaWMgc2V0TG9hZEV4dGVybmFsQXNzZXRzKGxvYWRFeHRlcm5hbEFzc2V0cyA9IHRydWUpOiB2b2lkIHtcbiAgICB0aGlzLmxvYWRFeHRlcm5hbEFzc2V0cyA9ICEhbG9hZEV4dGVybmFsQXNzZXRzO1xuICB9XG5cbiAgcHVibGljIHNldEZyYW1ld29yayhcbiAgICBmcmFtZXdvcms6IHN0cmluZ3xGcmFtZXdvcmsgPSB0aGlzLmRlZmF1bHRGcmFtZXdvcmssXG4gICAgbG9hZEV4dGVybmFsQXNzZXRzID0gdGhpcy5sb2FkRXh0ZXJuYWxBc3NldHNcbiAgKTogYm9vbGVhbiB7XG4gICAgdGhpcy5hY3RpdmVGcmFtZXdvcmsgPVxuICAgICAgdHlwZW9mIGZyYW1ld29yayA9PT0gJ3N0cmluZycgJiYgdGhpcy5oYXNGcmFtZXdvcmsoZnJhbWV3b3JrKSA/XG4gICAgICAgIHRoaXMuZnJhbWV3b3JrTGlicmFyeVtmcmFtZXdvcmtdIDpcbiAgICAgIHR5cGVvZiBmcmFtZXdvcmsgPT09ICdvYmplY3QnICYmIGhhc093bihmcmFtZXdvcmssICdmcmFtZXdvcmsnKSA/XG4gICAgICAgIGZyYW1ld29yayA6XG4gICAgICAgIHRoaXMuZnJhbWV3b3JrTGlicmFyeVt0aGlzLmRlZmF1bHRGcmFtZXdvcmtdO1xuICAgIGlmKHRoaXMuYWN0aXZlRnJhbWV3b3JrLm5hbWUgIT10aGlzLmFjdGl2ZUZyYW1ld29ya05hbWUpe1xuICAgICAgdGhpcy5hY3RpdmVGcmFtZXdvcmtOYW1lPXRoaXMuYWN0aXZlRnJhbWV3b3JrLm5hbWU7XG4gICAgICB0aGlzLmFjdGl2ZUZyYW1ld29ya05hbWVTdWJqZWN0Lm5leHQodGhpcy5hY3RpdmVGcmFtZXdvcmtOYW1lKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucmVnaXN0ZXJGcmFtZXdvcmtXaWRnZXRzKHRoaXMuYWN0aXZlRnJhbWV3b3JrKTtcbiAgfVxuXG4gIHJlZ2lzdGVyRnJhbWV3b3JrV2lkZ2V0cyhmcmFtZXdvcms6IEZyYW1ld29yayk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBoYXNPd24oZnJhbWV3b3JrLCAnd2lkZ2V0cycpID9cbiAgICAgIHRoaXMud2lkZ2V0TGlicmFyeS5yZWdpc3RlckZyYW1ld29ya1dpZGdldHMoZnJhbWV3b3JrLndpZGdldHMpIDpcbiAgICAgIHRoaXMud2lkZ2V0TGlicmFyeS51blJlZ2lzdGVyRnJhbWV3b3JrV2lkZ2V0cygpO1xuICB9XG5cbiAgcHVibGljIGhhc0ZyYW1ld29yayh0eXBlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaGFzT3duKHRoaXMuZnJhbWV3b3JrTGlicmFyeSwgdHlwZSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0RnJhbWV3b3JrKCk6IGFueSB7XG4gICAgaWYgKCF0aGlzLmFjdGl2ZUZyYW1ld29yaykgeyB0aGlzLnNldEZyYW1ld29yaygnZGVmYXVsdCcsIHRydWUpOyB9XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlRnJhbWV3b3JrLmZyYW1ld29yaztcbiAgfVxuXG4gIHB1YmxpYyBnZXRGcmFtZXdvcmtMaXN0KCk6e25hbWU6c3RyaW5nLHRleHQ6c3RyaW5nfVtdIHtcbiAgICByZXR1cm4gdGhpcy5mcmFtZXdvcmtzLm1hcChmdz0+e1xuICAgICAgcmV0dXJuIHtuYW1lOmZ3Lm5hbWUsdGV4dDpmdy50ZXh0fTtcbiAgICB9KVxuICAgIFxuICB9XG5cbiAgcHVibGljIGdldEZyYW1ld29ya1dpZGdldHMoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVGcmFtZXdvcmsud2lkZ2V0cyB8fCB7fTtcbiAgfVxuXG4gIFxuXG4gIHB1YmxpYyBnZXRGcmFtZXdvcmtTdHlsZXNoZWV0cyhsb2FkOiBib29sZWFuID0gdGhpcy5sb2FkRXh0ZXJuYWxBc3NldHMpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIChsb2FkICYmIHRoaXMuYWN0aXZlRnJhbWV3b3JrLnN0eWxlc2hlZXRzKSB8fCBbXTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRGcmFtZXdvcmtTY3JpcHRzKGxvYWQ6IGJvb2xlYW4gPSB0aGlzLmxvYWRFeHRlcm5hbEFzc2V0cyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gKGxvYWQgJiYgdGhpcy5hY3RpdmVGcmFtZXdvcmsuc2NyaXB0cykgfHwgW107XG4gIH1cblxuICAvL2FwcGxpZXMgdG8gQ3NzRnJhbWV3b3JrIGNsYXNzZXNcbiAgcHVibGljIGdldEZyYW1ld29ya0NvbmZpZyhleGlzdGluZ0ZyYW1ld29yaz86YW55KTogYW55IHtcbiAgICBsZXQgYWN0RnJhbWV3b3JrOkZyYW1ld29yayYgeyBba2V5OiBzdHJpbmddOiBhbnk7IH09ZXhpc3RpbmdGcmFtZXdvcmt8fHRoaXMuYWN0aXZlRnJhbWV3b3JrO1xuICAgIHJldHVybiBhY3RGcmFtZXdvcmsuY29uZmlnO1xuICB9XG5cbiAgLy90aGlzIHdpbGwgbG9hZCB0aGUgbGlzdCBvZiBhc3NldHMgdG8gYmUgbG9hZGVkIGF0IHJ1bnRpbWUgaW4gY2FzZSB0aGUgZGVwZW5kZW50IGZyYW1ld29ya1xuICAvL3NjcmlwdHMgYW5kIHN0eWxlcyBhcmUgaW5jbHVkZSBsb2NhbGx5IHdpdGggdGhlIHBhcmVudCBhcHBcbiAgcHVibGljIGdldEZyYW1ld29ya0Fzc2V0Q29uZmlnKGV4aXN0aW5nRnJhbWV3b3JrPzphbnksdXNlQXNzZXRSZWxQYXRoPXRydWUpOlByb21pc2U8e3N0eWxlc2hlZXRzOnN0cmluZ1tdLHNjcmlwdHM6c3RyaW5nW119PntcbiAgICBsZXQgYWN0RnJhbWV3b3JrOkZyYW1ld29yayYgeyBba2V5OiBzdHJpbmddOiBhbnk7IH09ZXhpc3RpbmdGcmFtZXdvcmt8fHRoaXMuYWN0aXZlRnJhbWV3b3JrO1xuICAgIC8vVE9ETyBtb3ZlIHRoaXMgaW50byBjb25maWdcbiAgICBjb25zdCBhc3NldENvbmZpZ1BhdGggPSBgYXNzZXRzLyR7YWN0RnJhbWV3b3JrLm5hbWV9L2Nzc2ZyYW1ld29ya2BcbiAgICBjb25zdCBhc3NldENvbmZpZ1VSTCA9IGAke2Fzc2V0Q29uZmlnUGF0aH0vYXNzZXRzLmpzb25gO1xuICAgIGxldCBzdWJzPXRoaXMuaHR0cFxuICAgICAgLmdldChhc3NldENvbmZpZ1VSTCwgeyByZXNwb25zZVR5cGU6ICd0ZXh0JyB9KVxuICAgICAgLy8uc3Vic2NyaWJlKGFzc2V0Q29uZmlnID0+IHtcbiAgICAgIC8vICBhc3NldENvbmZpZ1xuICAgICAgLy99KVxuICAgICAgXG4gICAgICByZXR1cm4gbGFzdFZhbHVlRnJvbShzdWJzKS50aGVuKGFzc2V0Q2ZnVGV4dD0+e1xuICAgICAgICBsZXQgYXNzZXRDZmc9SlNPTi5wYXJzZShhc3NldENmZ1RleHQpO1xuICAgICAgICBpZih1c2VBc3NldFJlbFBhdGgpe1xuICAgICAgICAgIGFzc2V0Q2ZnLnN0eWxlc2hlZXRzPWFzc2V0Q2ZnLnN0eWxlc2hlZXRzLm1hcChzdHlsZUxpbms9PntcbiAgICAgICAgICAgIC8vaWdub3JlIHJlbGF0aXZlIHBhdGggaWYgdXJsIHN0YXJ0cyB3aXRoIGtub3duIHByb3RvY29sIG9yIC8vXG4gICAgICAgICAgICBsZXQgbm9uUmVsUHJlZml4ZXM9W1wiL1wiLFwiLy9cIixcImh0dHA6XCIsXCJodHRwczpcIl07Ly9cIi8vXCIgbGlzdCBmb3IgY29tcGxldGVuZXNzIFxuICAgICAgICAgICAgbGV0IGlzTm9uUmVsPWZhbHNlO1xuICAgICAgICAgICAgbm9uUmVsUHJlZml4ZXMuZm9yRWFjaChwcmVmaXg9PntcbiAgICAgICAgICAgICAgaXNOb25SZWw9aXNOb25SZWx8fHN0eWxlTGluay5pbmRleE9mKHByZWZpeCk9PTA7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgaWYoaXNOb25SZWwpe1xuICAgICAgICAgICAgICByZXR1cm4gc3R5bGVMaW5rO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGAke2Fzc2V0Q29uZmlnUGF0aH0vJHtzdHlsZUxpbmt9YDtcbiAgICAgICAgICB9KVxuICAgICAgICAgIGFzc2V0Q2ZnLnNjcmlwdHM9YXNzZXRDZmcuc2NyaXB0cy5tYXAoc2NyaXB0TGluaz0+e1xuICAgICAgICAgICAgcmV0dXJuIGAke2Fzc2V0Q29uZmlnUGF0aH0vJHtzY3JpcHRMaW5rfWA7XG4gICAgICAgICAgfSlcbiAgICAgICAgfSAgIFxuICAgICAgICByZXR1cm4gYXNzZXRDZmdcbiAgICAgIH0pO1xuICB9XG5cbiAgLy9hcHBsaWVzIHRvIENzc0ZyYW1ld29yayBjbGFzc2VzXG4gIHB1YmxpYyBnZXRGcmFtZXdvcmtUaGVtZXMoKTp7bmFtZTpzdHJpbmcsdGV4dDpzdHJpbmd9W10ge1xuICAgIGxldCBjc3Nmd0NvbmZpZz10aGlzLmdldEZyYW1ld29ya0NvbmZpZygpO1xuICAgIGxldCB0aGVtZXM7XG4gICAgaWYoY3NzZndDb25maWcpe1xuICAgICAgdGhlbWVzPWNzc2Z3Q29uZmlnPy53aWRnZXRzdHlsZXM/Ll9fdGhlbWVzX198fFtdXG4gICAgfVxuICAgIHJldHVybiB0aGVtZXNcbiAgfVxuXG4gIC8vYXBwbGllcyB0byBDc3NGcmFtZXdvcmsgY2xhc3Nlc1xuICBwdWJsaWMgcmVxdWVzdFRoZW1lQ2hhbmdlKG5hbWU6c3RyaW5nLHZhbGlkYXRlVGhlbWVFeGlzdHM6Ym9vbGVhbj1mYWxzZSxleGlzdGluZ0ZyYW1ld29yaz86YW55KXtcbiAgICBsZXQgYWN0RnJhbWV3b3JrOkZyYW1ld29yayYgeyBba2V5OiBzdHJpbmddOiBhbnk7IH09ZXhpc3RpbmdGcmFtZXdvcmt8fHRoaXMuYWN0aXZlRnJhbWV3b3JrO1xuICAgIGlmKGFjdEZyYW1ld29yay5yZXF1ZXN0VGhlbWVDaGFuZ2Upe1xuICAgICAgaWYodmFsaWRhdGVUaGVtZUV4aXN0cyl7ICBcbiAgICAgICAgbGV0IHRoZW1lcz10aGlzLmdldEZyYW1ld29ya1RoZW1lcygpO1xuICAgICAgICBsZXQgZm91bmRUaGVtZXM9dGhlbWVzLmZpbHRlcih0aG09PntyZXR1cm4gdGhtLm5hbWU9PW5hbWV9KTtcbiAgICAgICAgaWYoIWZvdW5kVGhlbWVzfHwgZm91bmRUaGVtZXMubGVuZ3RoPT0wKXtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGFjdEZyYW1ld29yay5yZXF1ZXN0VGhlbWVDaGFuZ2UobmFtZSk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgLy9hcHBsaWVzIHRvIENzc0ZyYW1ld29yayBjbGFzc2VzXG4gIHB1YmxpYyBnZXRBY3RpdmVUaGVtZShleGlzdGluZ0ZyYW1ld29yaz86YW55KTp7bmFtZTpzdHJpbmcsdGV4dDpzdHJpbmd9e1xuICAgIGxldCBhY3RGcmFtZXdvcms6RnJhbWV3b3JrJiB7IFtrZXk6IHN0cmluZ106IGFueTsgfT1leGlzdGluZ0ZyYW1ld29ya3x8dGhpcy5hY3RpdmVGcmFtZXdvcms7XG4gICAgaWYoYWN0RnJhbWV3b3JrLmdldEFjdGl2ZVRoZW1lKXtcbiAgICAgIHJldHVybiBhY3RGcmFtZXdvcmsuZ2V0QWN0aXZlVGhlbWUoKTtcbiAgICB9XG4gIH1cblxuICAvL2FwcGxpZXMgdG8gQ3NzRnJhbWV3b3JrIGNsYXNzZXNcbiAgcHVibGljIHJlZ2lzdGVyVGhlbWUobmV3VGhlbWU6e25hbWU6c3RyaW5nLHRleHQ6c3RyaW5nfSxleGlzdGluZ0ZyYW1ld29yaz86YW55KTpib29sZWFue1xuICAgIGxldCBhY3RGcmFtZXdvcms6RnJhbWV3b3JrJiB7IFtrZXk6IHN0cmluZ106IGFueTsgfT1leGlzdGluZ0ZyYW1ld29ya3x8dGhpcy5hY3RpdmVGcmFtZXdvcms7XG4gICAgaWYoYWN0RnJhbWV3b3JrLnJlZ2lzdGVyVGhlbWUpe1xuICAgICAgcmV0dXJuIGFjdEZyYW1ld29yay5yZWdpc3RlclRoZW1lKG5ld1RoZW1lKTtcbiAgICB9XG4gIH1cblxuICAgIC8vYXBwbGllcyB0byBDc3NGcmFtZXdvcmsgY2xhc3Nlc1xuICAgIHB1YmxpYyB1bnJlZ2lzdGVyVGhlbWUobmFtZTpzdHJpbmcsZXhpc3RpbmdGcmFtZXdvcms/OmFueSk6Ym9vbGVhbntcbiAgICAgIGxldCBhY3RGcmFtZXdvcms6RnJhbWV3b3JrJiB7IFtrZXk6IHN0cmluZ106IGFueTsgfT1leGlzdGluZ0ZyYW1ld29ya3x8dGhpcy5hY3RpdmVGcmFtZXdvcms7XG4gICAgICBpZihhY3RGcmFtZXdvcmsucmVnaXN0ZXJUaGVtZSl7XG4gICAgICAgIHJldHVybiBhY3RGcmFtZXdvcmsudW5yZWdpc3RlclRoZW1lKG5hbWUpO1xuICAgICAgfVxuICAgIH1cbn1cbiJdfQ==