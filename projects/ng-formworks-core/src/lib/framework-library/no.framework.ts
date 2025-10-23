import { Injectable } from '@angular/core';
import { Framework } from './framework';
import { NoFrameworkComponent } from './no-framework.component';
// No framework - plain HTML controls (styles from form layout only)

@Injectable()
export class NoFramework extends Framework {
  override name = 'no-framework';
  override text ='None (plain HTML)';
  override framework = NoFrameworkComponent;
}
