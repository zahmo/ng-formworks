import { enableProdMode } from '@angular/core';

import { platformBrowser } from '@angular/platform-browser';
import { DemoModule } from './app/demo.module';
import { environment } from './environments/environment';

if (environment.production) { enableProdMode(); }

platformBrowser().bootstrapModule(DemoModule);
