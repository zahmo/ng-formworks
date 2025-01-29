import { Inject, Injectable, Optional, inject } from '@angular/core';
import { CssFramework, CssframeworkService } from '@ng-formworks/cssframework';
import { cssFrameworkCfgDaisyUI, getCssFrameworkCfgPrefixed } from './daisui-cssframework';
import { DaisyUIFrameworkComponent } from './daisyui-framework.component';
import { DaisyUIFrameworkComponentPrefixed } from './daisyui-framework.prefixed.component';
import { DUIOPTIONS } from './tokens.defs';
import { DaisyUITabsComponent } from './widgets/daisyui-tabs.component';


@Injectable()
export class DaisyUIFramework extends CssFramework {
cssFWService: CssframeworkService;
//private duiOptions = inject(DUIOPTIONS, { optional: true }) ?? { classPrefix: true };


framework=DaisyUIFrameworkComponent;
  constructor(
    //public cssFWService:CssframeworkService,
    @Inject(DUIOPTIONS) 
  //use class prefix by default-doesn't seem to work angular will inject null
  //for TS to use default value, must be undefined
  //-see https://github.com/angular/angular/issues/37306
  @Optional() private duiOptions:any={classPrefix:true}
  ){
    const cssFWService = inject(CssframeworkService);

    let duiOpts:any=duiOptions===null?{classPrefix:true}:duiOptions;
     let cssFrameworkCfg=cssFrameworkCfgDaisyUI;
    if(duiOpts?.classPrefix ){//added null,see note above
      cssFrameworkCfg=getCssFrameworkCfgPrefixed(cssFrameworkCfgDaisyUI)
    }
    //super(cssFrameworkCfg,cssFWService);
    super(cssFrameworkCfg);
    this.cssFWService = cssFWService;
    //const duiOptions = this.duiOptions;

    if(duiOpts?.classPrefix){
      this.framework=DaisyUIFrameworkComponentPrefixed;
    }
    this.widgets= {

      'tabs': DaisyUITabsComponent,
    
    };
  }

}
