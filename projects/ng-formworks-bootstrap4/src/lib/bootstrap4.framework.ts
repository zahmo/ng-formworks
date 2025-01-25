import { Injectable, inject } from '@angular/core';
import { CssFramework, CssframeworkService } from '@ng-formworks/cssframework';
import { cssFrameworkCfgBootstrap4 } from './bootstrap4-cssframework';
import { Bootstrap4FrameworkComponent } from './bootstrap4-framework.component';

// Bootstrap 4 Framework
// https://github.com/ng-bootstrap/ng-bootstrap

@Injectable()
export class Bootstrap4Framework extends CssFramework {
  cssFWService: CssframeworkService;

  
  framework = Bootstrap4FrameworkComponent;

  constructor(){
    const cssFWService = inject(CssframeworkService);

    super(cssFrameworkCfgBootstrap4,cssFWService);
  
    this.cssFWService = cssFWService;
  }
}
