/*
  The MIT License

  Copyright (c) 2017-2020 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  JsonFormsAbstractControl,
  JsonFormsAngularService,
} from '@jsonforms/angular';
import {
  arrayDefaultTranslations,
  ArrayLayoutProps,
  ArrayTranslations,
  createDefaultValue,
  defaultJsonFormsI18nState,
  findUISchema,
  getArrayTranslations,
  isObjectArrayWithNesting,
  JsonFormsState,
  mapDispatchToArrayControlProps,
  mapStateToArrayLayoutProps,
  OwnPropsOfRenderer,
  Paths,
  RankedTester,
  rankWith,
  setReadonly,
  StatePropsOfArrayLayout,
  UISchemaElement,
  UISchemaTester,
  unsetReadonly,
} from '@jsonforms/core';

@Component({
  selector: 'app-array-layout-renderer',
  template: `
      <div [ngStyle]="{ display: hidden ? 'none' : '' }" class="array-layout">
        <div class="array-layout-toolbar d-flex justify-content-between align-items-center">
          <h2 class="h2 array-layout-title">{{ label }}</h2>
          <div class="d-flex align-items-center">
            <span></span>

            <!-- Error Icon -->
            <div *ngIf="this.error?.length">
              <button class="btn btn-danger" 
            
                >
                <i class="bi bi-exclamation-circle"></i>
              </button>
            </div>

            <span></span>

            <!-- Add Button -->
            <button class="btn btn-primary" 
              [disabled]="!isEnabled()" 
              (click)="add()" 
              [attr.aria-label]="translations.addAriaLabel" 
    
              >
              <i class="bi bi-plus-circle"></i>
            </button>
          </div>
        </div>

        <!-- No Data Message -->
        <p *ngIf="noData">{{ translations.noDataMessage }}</p>

        <!-- Array Items -->
        <div *ngFor="
            let item of [].constructor(data);
            let idx = index;
            trackBy: trackByFn;
            last as last;
            first as first
          ">
          <div class="card array-item mb-3">
            <div class="card-body">
              <jsonforms-outlet [renderProps]="GetPropsCore(idx)"></jsonforms-outlet>
            </div>

            <div *ngIf="isEnabled()" class="card-footer d-flex justify-content-between">
              <div class="d-flex">
                <!-- Sort Up Button -->
                <button 
                  *ngIf="uischema?.options?.showSortButtons" 
                  class="btn btn-outline-secondary me-2" 
                  [disabled]="first" 
                  (click)="up(idx)" 
                  [attr.aria-label]="translations.upAriaLabel" 

                  >
                  <i class="bi bi-arrow-up-circle"></i>
                </button>

                <!-- Sort Down Button -->
                <button 
                  *ngIf="uischema?.options?.showSortButtons" 
                  class="btn btn-outline-secondary" 
                  [disabled]="last" 
                  (click)="down(idx)" 
                  [attr.aria-label]="translations.downAriaLabel" 

                  >
                  <i class="bi bi-arrow-down-circle"></i>
                </button>
              </div>

              <!-- Remove Button -->
              <button 
                class="btn btn-danger" 
                (click)="remove(idx)" 
                [attr.aria-label]="translations.removeAriaLabel" 

                >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

  `,
  styles: [
    `
      .array-layout {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .array-layout > * {
        flex: 1 1 auto;
      }
      .array-layout-toolbar {
        display: flex;
        align-items: center;
      }
      .array-layout-title {
        margin: 0;
      }
      .array-layout-toolbar > span {
        flex: 1 1 auto;
      }
      .array-item {
        padding: 16px;
      }
      ::ng-deep .error-message-tooltip {
        white-space: pre-line;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ArrayLayoutRendererCore
  extends JsonFormsAbstractControl<StatePropsOfArrayLayout>
  implements OnInit
{
  noData: boolean;
  translations: ArrayTranslations = {};
  addItem: (path: string, value: any) => () => void;
  moveItemUp: (path: string, index: number) => () => void;
  moveItemDown: (path: string, index: number) => () => void;
  removeItems: (path: string, toDelete: number[]) => () => void;
  uischemas: {
    tester: UISchemaTester;
    uischema: UISchemaElement;
  }[];
  constructor(jsonFormsService: JsonFormsAngularService) {
    super(jsonFormsService);
  }
  mapToProps(
    state: JsonFormsState
  ): StatePropsOfArrayLayout & { translations: ArrayTranslations } {
    const props = mapStateToArrayLayoutProps(state, this.getOwnProps());
    const t =
      state.jsonforms.i18n?.translate ?? defaultJsonFormsI18nState.translate;
    const translations = getArrayTranslations(
      t,
      arrayDefaultTranslations,
      props.i18nKeyPrefix,
      props.label
    );
    return { ...props, translations };
  }
  remove(index: number): void {
    this.removeItems(this.propsPath, [index])();
  }
  add(): void {
    this.addItem(
      this.propsPath,
      createDefaultValue(this.scopedSchema, this.rootSchema)
    )();
  }
  up(index: number): void {
    this.moveItemUp(this.propsPath, index)();
  }
  down(index: number): void {
    this.moveItemDown(this.propsPath, index)();
  }
  ngOnInit() {
    super.ngOnInit();
    const { addItem, removeItems, moveUp, moveDown } =
      mapDispatchToArrayControlProps(
        this.jsonFormsService.updateCore.bind(this.jsonFormsService)
      );
    this.addItem = addItem;
    this.moveItemUp = moveUp;
    this.moveItemDown = moveDown;
    this.removeItems = removeItems;
  }
  mapAdditionalProps(
    props: ArrayLayoutProps & { translations: ArrayTranslations }
  ) {
    this.noData = !props.data || props.data === 0;
    this.uischemas = props.uischemas;
    this.translations = props.translations;
  }
  GetPropsCore(index: number): OwnPropsOfRenderer {
    const uischema = findUISchema(
      this.uischemas,
      this.scopedSchema,
      this.uischema.scope,
      this.propsPath,
      undefined,
      this.uischema,
      this.rootSchema
    );
    if (this.isEnabled()) {
      unsetReadonly(uischema);
    } else {
      setReadonly(uischema);
    }
    return {
      schema: this.scopedSchema,
      path: Paths.compose(this.propsPath, `${index}`),
      uischema,
    };
  }
  trackByFn(index: number) {
    return index;
  }
}

export const ArrayLayoutRendererCoreTester: RankedTester = rankWith(
  4,
  isObjectArrayWithNesting
);
