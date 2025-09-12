/*
 * Public API Surface of json-schema-form
 */

export { Framework } from './lib/framework-library/framework';
export { FrameworkLibraryService } from './lib/framework-library/framework-library.service';
export { JsonSchemaFormComponent } from './lib/json-schema-form.component';
export { JsonSchemaFormModule } from './lib/json-schema-form.module';
export { ErrorMessages, JsonSchemaFormService, TitleMapItem } from './lib/json-schema-form.service';
export { JsonformsFormComponent } from './lib/jsonforms-form/jsonforms-form.component';
export * from './lib/jsonforms-renderers';
export {
  deValidationMessages,
  enValidationMessages,
  esValidationMessages,
  frValidationMessages,
  itValidationMessages,
  ptValidationMessages,
  zhValidationMessages
} from './lib/locale';
export * from './lib/shared';
export * from './lib/widget-library';
export * from './lib/widget-library/widget-library.module';

