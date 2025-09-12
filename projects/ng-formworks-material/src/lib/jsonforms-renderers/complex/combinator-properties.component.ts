import { Component, Input, OnInit } from '@angular/core';
import { Generate, isLayout, JsonSchema, UISchemaElement } from '@jsonforms/core';
import { omit } from 'lodash';

@Component({
  selector: 'app-combinator-properties',
  template: `
 <div *ngIf="showJsonFormsDispatch">
    
    <jsonforms [schema]="otherProps"  [uischema]="foundUISchema">
    </jsonforms>
    
    <!--
    <jsonforms-outlet
        [uischema]="foundUISchema"
        [path]="path"
        [schema]="otherProps"
    ></jsonforms-outlet>
    -->
</div>`,
  styles: [
    `.combinator-properties {
              padding: 16px;
              border: 1px solid #ccc;
              margin-top: 16px;
              background-color: #f9f9f9;
          }

          h3 {
              color: #3f51b5;
          }`
        ],
        "standalone":false
})
export class CombinatorPropertiesComponent implements OnInit {
  @Input() schema: JsonSchema;
  @Input() combinatorKeyword: 'oneOf' | 'anyOf';
  @Input() path: string;
  @Input() rootSchema: JsonSchema;

  // Initialize otherProps as an empty object
  otherProps:any={} //JsonSchema = {};
  foundUISchema: UISchemaElement | null = null;
  isLayoutWithElements: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // Omit the combinator keyword (oneOf, anyOf) from the schema
    this.otherProps = omit(this.schema, [this.combinatorKeyword]);

    // Generate the UI schema
    this.foundUISchema = Generate.uiSchema(this.otherProps, 'VerticalLayout', undefined, this.rootSchema);

    // Check if the UI schema is a layout with elements
    if (this.foundUISchema !== null && isLayout(this.foundUISchema)) {
      this.isLayoutWithElements = this.foundUISchema.elements.length > 0;
    }
  }

  // Conditional rendering: if it's a layout with elements, display the JsonFormsDispatch component
  get showJsonFormsDispatch(): boolean {
    return this.isLayoutWithElements && this.foundUISchema !== null;
  }
}
