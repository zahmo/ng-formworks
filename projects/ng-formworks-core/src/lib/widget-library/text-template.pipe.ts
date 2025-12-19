import { inject, Pipe, PipeTransform } from '@angular/core';
import { JsonSchemaFormService } from '../json-schema-form.service';


@Pipe({
  name: 'textTemplate',
  standalone:false
})
export class TextTemplatePipe implements PipeTransform {
  private jsf=inject(JsonSchemaFormService);
  transform(tpl: string, tplCtx: any): string {
      return this.jsf.parseText(tpl,tplCtx.value,tplCtx.values,tplCtx.key)
  }

}