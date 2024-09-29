import { Injectable } from '@angular/core';
import { CssFramework } from '@ng-formworks/cssframework';
import { cssFrameworkCfgBootstrap3 } from './bootstrap3-cssframework';
import { Bootstrap3FrameworkComponent } from './bootstrap3-framework.component';
import * as i0 from "@angular/core";
import * as i1 from "@ng-formworks/cssframework";
// Bootstrap 3 Framework
// https://github.com/valor-software/ng2-bootstrap
export class Bootstrap3Framework extends CssFramework {
    constructor(cssFWService) {
        super(cssFrameworkCfgBootstrap3, cssFWService);
        this.cssFWService = cssFWService;
        this.name = 'bootstrap-3';
        this.framework = Bootstrap3FrameworkComponent;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: Bootstrap3Framework, deps: [{ token: i1.CssframeworkService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: Bootstrap3Framework }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: Bootstrap3Framework, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CssframeworkService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwMy5mcmFtZXdvcmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1mb3Jtd29ya3MtYm9vdHN0cmFwMy9zcmMvbGliL2Jvb3RzdHJhcDMuZnJhbWV3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBdUIsTUFBTSw0QkFBNEIsQ0FBQztBQUMvRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7O0FBRWhGLHdCQUF3QjtBQUN4QixrREFBa0Q7QUFHbEQsTUFBTSxPQUFPLG1CQUFvQixTQUFRLFlBQVk7SUFLbkQsWUFBbUIsWUFBZ0M7UUFDakQsS0FBSyxDQUFDLHlCQUF5QixFQUFDLFlBQVksQ0FBQyxDQUFDO1FBRDdCLGlCQUFZLEdBQVosWUFBWSxDQUFvQjtRQUpuRCxTQUFJLEdBQUcsYUFBYSxDQUFDO1FBRXJCLGNBQVMsR0FBRyw0QkFBNEIsQ0FBQztJQUl6QyxDQUFDOytHQVBVLG1CQUFtQjttSEFBbkIsbUJBQW1COzs0RkFBbkIsbUJBQW1CO2tCQUQvQixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ3NzRnJhbWV3b3JrLCBDc3NmcmFtZXdvcmtTZXJ2aWNlIH0gZnJvbSAnQG5nLWZvcm13b3Jrcy9jc3NmcmFtZXdvcmsnO1xuaW1wb3J0IHsgY3NzRnJhbWV3b3JrQ2ZnQm9vdHN0cmFwMyB9IGZyb20gJy4vYm9vdHN0cmFwMy1jc3NmcmFtZXdvcmsnO1xuaW1wb3J0IHsgQm9vdHN0cmFwM0ZyYW1ld29ya0NvbXBvbmVudCB9IGZyb20gJy4vYm9vdHN0cmFwMy1mcmFtZXdvcmsuY29tcG9uZW50JztcblxuLy8gQm9vdHN0cmFwIDMgRnJhbWV3b3JrXG4vLyBodHRwczovL2dpdGh1Yi5jb20vdmFsb3Itc29mdHdhcmUvbmcyLWJvb3RzdHJhcFxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQm9vdHN0cmFwM0ZyYW1ld29yayBleHRlbmRzIENzc0ZyYW1ld29yayB7XG4gIG5hbWUgPSAnYm9vdHN0cmFwLTMnO1xuXG4gIGZyYW1ld29yayA9IEJvb3RzdHJhcDNGcmFtZXdvcmtDb21wb25lbnQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGNzc0ZXU2VydmljZTpDc3NmcmFtZXdvcmtTZXJ2aWNlKXtcbiAgICBzdXBlcihjc3NGcmFtZXdvcmtDZmdCb290c3RyYXAzLGNzc0ZXU2VydmljZSk7XG4gIH1cbn1cbiJdfQ==