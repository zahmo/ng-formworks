import { Injectable, inject } from '@angular/core';
import { CssFramework, CssframeworkService } from '@ng-formworks/cssframework';
import { cssFrameworkCfgBootstrap5 } from './bootstrap5-cssframework';
import { Bootstrap5FrameworkComponent } from './bootstrap5-framework.component';

// Bootstrap 4 Framework
// https://github.com/ng-bootstrap/ng-bootstrap

@Injectable()
export class Bootstrap5Framework extends CssFramework {
  cssFWService: CssframeworkService;

  
  framework = Bootstrap5FrameworkComponent;

  constructor(){
    const cssFWService = inject(CssframeworkService);

    //super(cssFrameworkCfgBootstrap5,cssFWService);
    super(cssFrameworkCfgBootstrap5);
    this.cssFWService = cssFWService;
  }
}
