/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
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
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  JsonFormsAngularService,
  JsonFormsArrayControl,
} from '@jsonforms/angular';
import {
  ArrayControlProps,
  arrayDefaultTranslations,
  ArrayTranslations,
  ControlElement,
  createDefaultValue,
  decode,
  defaultJsonFormsI18nState,
  findUISchema,
  getArrayTranslations,
  getFirstPrimitiveProp,
  JsonFormsState,
  mapDispatchToArrayControlProps,
  mapStateToArrayControlProps,
  RankedTester,
  rankWith,
  setReadonly,
  StatePropsOfArrayControl,
  uiTypeIs,
} from '@jsonforms/core';
import get from 'lodash/get';
import some from 'lodash/some';

const keywords = ['#', 'properties', 'items'];

export const removeSchemaKeywords = (path: string) => {
  return decode(
    path
      .split('/')
      .filter((s) => !some(keywords, (key) => key === s))
      .join('.')
  );
};

@Component({
  selector: 'jsonforms-list-with-detail-master-core',
  template: `
        <div class="d-flex">
      <!-- Sidebar (Sidenav) -->
      <div class="bg-light border-end" [ngStyle]="{ display: hidden ? 'none' : '' }" style="width: 250px; height: 100vh; position: fixed;">
        <ul class="nav flex-column">
          <!-- No data message -->
          <li class="nav-item" *ngIf="masterItems.length === 0">
            <span class="nav-link">{{ translations.noDataMessage }}</span>
          </li>

          <!-- Master items -->
          <li
            class="nav-item"
            *ngFor="let item of masterItems; let i = index; trackBy: trackElement"
            [class.active]="item === selectedItem"
          >
            <a
              class="nav-link"
              href="javascript:void(0)"
              (click)="onSelect(item, i)"
              (mouseover)="onListItemHover(i)"
              (mouseout)="onListItemHover(undefined)"
            >
              {{ item.label || 'No label set' }}
            </a>

            <!-- Delete button -->
            <button
              class="btn btn-danger btn-sm position-absolute end-0 top-50 translate-middle-y"
              *ngIf="isEnabled() && highlightedIdx === i"
              (click)="onDeleteClick(i)"
            >
              <i class="bi bi-trash"></i>
            </button>
          </li>
        </ul>

        <!-- Add button -->
        <button
          class="btn btn-primary position-fixed bottom-0 end-0 m-3"
          (click)="onAddClick()"
          *ngIf="isEnabled()"
        >
          <i class="bi bi-plus"></i>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-grow-1 ms-250" style="padding-left: 250px;">
        <jsonforms-detailcore *ngIf="selectedItem" [item]="selectedItem"></jsonforms-detailcore>
      </div>
    </div>

  `,
  styles: [
    `
      /* TODO(mdc-migration): The following rule targets internal classes of list that may no longer apply for the MDC version. */
      mat-list-item.selected {
        background: rgba(0, 0, 0, 0.04);
      }
      .container {
        height: 100vh;
      }
      .content {
        padding: 15px;
        background-color: #fff;
      }
      .add-button {
        float: right;
        margin-top: 0.5em;
        margin-right: 0.25em;
      }
      .button {
        float: right;
        margin-right: 0.25em;
      }
      .item-button {
        position: absolute;
        top: 0;
        right: 0;
      }
      .hide {
        display: none;
      }
      .show {
        display: inline-block;
      }
      mat-sidenav {
        width: 20%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MasterListComponentCore
  extends JsonFormsArrayControl
  implements OnInit
{
  masterItems: any[];
  selectedItem: any;
  selectedItemIdx: number;
  addItem: (path: string, value: any) => () => void;
  removeItems: (path: string, toDelete: number[]) => () => void;
  highlightedIdx: number;
  translations: ArrayTranslations;

  constructor(
    jsonformsService: JsonFormsAngularService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(jsonformsService);
  }

  onListItemHover(idx: number) {
    this.highlightedIdx = idx;
  }

  trackElement(_index: number, element: any) {
    return element ? element.label : null;
  }

  ngOnInit() {
    super.ngOnInit();
    const dispatch = this.jsonFormsService.updateCore.bind(
      this.jsonFormsService
    );
    const { addItem, removeItems } = mapDispatchToArrayControlProps(dispatch);
    this.addItem = addItem;
    this.removeItems = removeItems;
  }

  mapAdditionalProps(
    props: ArrayControlProps & { translations: ArrayTranslations }
  ) {
    const { data, path, schema, uischema } = props;
    const controlElement = uischema as ControlElement;
    this.propsPath = props.path;
    const detailUISchema = findUISchema(
      props.uischemas,
      schema,
      `${controlElement.scope}/items`,
      props.path,
      'VerticalLayout',
      controlElement,
      props.rootSchema
    );

    if (!this.isEnabled()) {
      setReadonly(detailUISchema);
    }

    this.translations = props.translations;

    const masterItems = (data || []).map((d: any, index: number) => {
      const labelRefInstancePath =
        controlElement.options?.labelRef &&
        removeSchemaKeywords(controlElement.options.labelRef);
      const isPrimitive = d !== undefined && typeof d !== 'object';
      const masterItem = {
        label: isPrimitive
          ? d.toString()
          : get(d, labelRefInstancePath ?? getFirstPrimitiveProp(schema)),
        data: d,
        path: `${path}.${index}`,
        schema,
        uischema: detailUISchema,
      };
      return masterItem;
    });
    this.masterItems = masterItems;
    let newSelectedIdx = -1;
    let newSelectedItem;
    if (this.masterItems.length === 0) {
      // unset select if no elements anymore
      this.selectedItem = undefined;
      this.selectedItemIdx = -1;
    } else if (this.selectedItemIdx >= this.masterItems.length) {
      // the previous index is to high, reduce it to the maximal possible
      newSelectedIdx = this.masterItems.length - 1;
      newSelectedItem = this.masterItems[newSelectedIdx];
    } else if (
      this.selectedItemIdx !== -1 &&
      this.selectedItemIdx < this.masterItems.length
    ) {
      newSelectedIdx = this.selectedItemIdx;
      newSelectedItem = this.masterItems[this.selectedItemIdx];
    }

    if (
      newSelectedItem !== undefined &&
      this.selectedItem !== undefined &&
      (newSelectedItem.label === this.selectedItem.label ||
        newSelectedItem.path === this.selectedItem.path)
    ) {
      // after checking that we are on the same path, set selection
      this.selectedItem = newSelectedItem;
      this.selectedItemIdx = newSelectedIdx;
    } else if (this.masterItems.length > 0) {
      // pre-select 1st entry if the previous selected element as fallback
      this.selectedItem = this.masterItems[0];
      this.selectedItemIdx = 0;
    }
    this.changeDetectorRef.markForCheck();
  }

  onSelect(item: any, idx: number): void {
    this.selectedItem = item;
    this.selectedItemIdx = idx;
  }

  onAddClick() {
    this.addItem(
      this.propsPath,
      createDefaultValue(this.scopedSchema, this.rootSchema)
    )();
  }

  onDeleteClick(item: number) {
    this.removeItems(this.propsPath, [item])();
  }

  protected mapToProps(
    state: JsonFormsState
  ): StatePropsOfArrayControl & { translations: ArrayTranslations } {
    const props = mapStateToArrayControlProps(state, this.getOwnProps());
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
}

export const masterDetailTester: RankedTester = rankWith(
  4,
  uiTypeIs('ListWithDetail')
);
