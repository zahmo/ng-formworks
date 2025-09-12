import { Injectable, inject } from '@angular/core';
import { coreRenderers } from '@ng-formworks/core';
import { CssFramework, CssframeworkService } from '@ng-formworks/cssframework';
import { cloneDeep } from 'lodash';
import { cssFrameworkCfgBootstrap5 } from './bootstrap5-cssframework';
import { Bootstrap5FrameworkComponent } from './bootstrap5-framework.component';

// Bootstrap 4 Framework
// https://github.com/ng-bootstrap/ng-bootstrap

@Injectable()
export class Bootstrap5JsonFormsFramework extends CssFramework {
  cssFWService: CssframeworkService;

  
  framework = Bootstrap5FrameworkComponent;
  renderers = [
    ...coreRenderers
  ]  

  constructor(){
    const cssFWService = inject(CssframeworkService);

    //super(cssFrameworkCfgBootstrap5,cssFWService);
    let cssFrameworkCfgBootstrap5Jsonforms=cloneDeep(cssFrameworkCfgBootstrap5);
    cssFrameworkCfgBootstrap5Jsonforms.name="bootstrap-5-jsonforms";
    cssFrameworkCfgBootstrap5Jsonforms.text="Bootstrap 5 Jsonforms";
    super(cssFrameworkCfgBootstrap5Jsonforms);
    this.cssFWService = cssFWService;
  }
}
