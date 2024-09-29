import { Injectable } from '@angular/core';
import { CssFramework } from '@ng-formworks/cssframework';
import { cssFrameworkCfgBootstrap4 } from './bootstrap4-cssframework';
import { Bootstrap4FrameworkComponent } from './bootstrap4-framework.component';
import * as i0 from "@angular/core";
import * as i1 from "@ng-formworks/cssframework";
// Bootstrap 4 Framework
// https://github.com/ng-bootstrap/ng-bootstrap
export class Bootstrap4Framework extends CssFramework {
    constructor(cssFWService) {
        super(cssFrameworkCfgBootstrap4, cssFWService);
        this.cssFWService = cssFWService;
        this.framework = Bootstrap4FrameworkComponent;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: Bootstrap4Framework, deps: [{ token: i1.CssframeworkService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: Bootstrap4Framework }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.3.12", ngImport: i0, type: Bootstrap4Framework, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.CssframeworkService }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwNC5mcmFtZXdvcmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1mb3Jtd29ya3MtYm9vdHN0cmFwNC9zcmMvbGliL2Jvb3RzdHJhcDQuZnJhbWV3b3JrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBdUIsTUFBTSw0QkFBNEIsQ0FBQztBQUMvRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7O0FBRWhGLHdCQUF3QjtBQUN4QiwrQ0FBK0M7QUFHL0MsTUFBTSxPQUFPLG1CQUFvQixTQUFRLFlBQVk7SUFJbkQsWUFBbUIsWUFBZ0M7UUFDakQsS0FBSyxDQUFDLHlCQUF5QixFQUFDLFlBQVksQ0FBQyxDQUFDO1FBRDdCLGlCQUFZLEdBQVosWUFBWSxDQUFvQjtRQUZuRCxjQUFTLEdBQUcsNEJBQTRCLENBQUM7SUFJekMsQ0FBQzsrR0FOVSxtQkFBbUI7bUhBQW5CLG1CQUFtQjs7NEZBQW5CLG1CQUFtQjtrQkFEL0IsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENzc0ZyYW1ld29yaywgQ3NzZnJhbWV3b3JrU2VydmljZSB9IGZyb20gJ0BuZy1mb3Jtd29ya3MvY3NzZnJhbWV3b3JrJztcbmltcG9ydCB7IGNzc0ZyYW1ld29ya0NmZ0Jvb3RzdHJhcDQgfSBmcm9tICcuL2Jvb3RzdHJhcDQtY3NzZnJhbWV3b3JrJztcbmltcG9ydCB7IEJvb3RzdHJhcDRGcmFtZXdvcmtDb21wb25lbnQgfSBmcm9tICcuL2Jvb3RzdHJhcDQtZnJhbWV3b3JrLmNvbXBvbmVudCc7XG5cbi8vIEJvb3RzdHJhcCA0IEZyYW1ld29ya1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL25nLWJvb3RzdHJhcC9uZy1ib290c3RyYXBcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEJvb3RzdHJhcDRGcmFtZXdvcmsgZXh0ZW5kcyBDc3NGcmFtZXdvcmsge1xuICBcbiAgZnJhbWV3b3JrID0gQm9vdHN0cmFwNEZyYW1ld29ya0NvbXBvbmVudDtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY3NzRldTZXJ2aWNlOkNzc2ZyYW1ld29ya1NlcnZpY2Upe1xuICAgIHN1cGVyKGNzc0ZyYW1ld29ya0NmZ0Jvb3RzdHJhcDQsY3NzRldTZXJ2aWNlKTtcbiAgfVxufVxuIl19