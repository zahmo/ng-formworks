import { ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, inject, input } from '@angular/core';
import { FrameworkLibraryService, JsonSchemaFormService, isDefined } from '@ng-formworks/core';
import { CssframeworkService } from '@ng-formworks/cssframework';
import cloneDeep from 'lodash/cloneDeep';
import { Subscription } from 'rxjs';
import { cssFrameworkCfgMaterialDesign } from './material-design-cssframework';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'material-design-framework',
  templateUrl: './material-design-framework.component.html',
  styleUrls: ['./material-design-framework.component.scss'],
  standalone: false
})
export class MaterialDesignFrameworkComponent implements OnInit, OnChanges, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private jsf = inject(JsonSchemaFormService);
  jsfFLService = inject(FrameworkLibraryService);
  cssFWService = inject(CssframeworkService);

  frameworkInitialized = false;
  inputType: string;
  options: any; // Options used in this framework
  widgetLayoutNode: any; // layoutNode passed to child widget
  widgetOptions: any; // Options passed to child widget
  formControl: any = null;
  parentArray: any = null;
  isOrderable = false;
  dynamicTitle: string = null;
  readonly layoutNode = input<any>(undefined);
  readonly layoutIndex = input<number[]>(undefined);
  readonly dataIndex = input<number[]>(undefined);

  theme: string = "material-default-theme";
  frameworkThemeSubs: Subscription;
  constructor() {



  }
  ngOnDestroy(): void {
    this.frameworkThemeSubs.unsubscribe();
    this.frameworkThemeSubs = null;
  }

  get showRemoveButton(): boolean {
    const layoutNode = this.layoutNode();
    if (!layoutNode || !this.widgetOptions.removable ||
      this.widgetOptions.readonly || layoutNode.type === '$ref'
    ) {
      return false;
    }
    if (layoutNode.recursiveReference) {
      return true;
    }
    if (!layoutNode.arrayItem || !this.parentArray) {
      return false;
    }
    // If array length <= minItems, don't allow removing any items
    return this.parentArray.items.length - 1 <= this.parentArray.options.minItems ? false :
      // For removable list items, allow removing any item
      layoutNode.arrayItemType === 'list' ? true :
        // For removable tuple items, only allow removing last item in list
        this.layoutIndex()[this.layoutIndex().length - 1] === this.parentArray.items.length - 2;
  }

  ngOnInit() {
    const cssFWService = this.cssFWService;

    let activeFramework: any = this.jsfFLService.activeFramework;
    let fwcfg = activeFramework.config || {};
    let defaultTheme = cssFrameworkCfgMaterialDesign.widgetstyles?.__themes__[0];
    let defaultThemeName = cssFWService.activeRequestedTheme || defaultTheme.name;
    this.theme = this.options?.theme || defaultThemeName;
    this.frameworkThemeSubs = cssFWService.frameworkTheme$.subscribe(
      newTheme => {
        this.theme = newTheme;
        this.cdr.detectChanges();
      }
    )
    this.initializeFramework();
  }

  ngOnChanges(changes) {
    if (!this.frameworkInitialized) {
      this.initializeFramework();
    }
    if (this.dynamicTitle) {
      this.updateTitle();
    }
  }

  initializeFramework() {
    const layoutNode = this.layoutNode();
    if (layoutNode) {
      this.options = cloneDeep(layoutNode.options || {});
      this.widgetLayoutNode = {
        ...layoutNode,
        options: cloneDeep(layoutNode.options || {})
      };
      this.widgetOptions = this.widgetLayoutNode.options;
      this.formControl = this.jsf.getFormControl(this);

      if (
        isDefined(this.widgetOptions.minimum) &&
        isDefined(this.widgetOptions.maximum) &&
        this.widgetOptions.multipleOf >= 1
      ) {
        layoutNode.type = 'range';
      }

      if (
        !['$ref', 'advancedfieldset', 'authfieldset', 'button', 'card',
          'checkbox', 'expansion-panel', 'help', 'message', 'msg', 'section',
          'submit', 'tabarray', 'tabs'].includes(layoutNode.type) &&
        /{{.+?}}/.test(this.widgetOptions.title || '')
      ) {
        this.dynamicTitle = this.options?.title;//this.widgetOptions.title;
        this.updateTitle();
      }

      if (layoutNode.arrayItem && layoutNode.type !== '$ref') {
        this.parentArray = this.jsf.getParentNode(this);
        if (this.parentArray) {
          this.isOrderable =
            this.parentArray.type.slice(0, 3) !== 'tab' &&
            layoutNode.arrayItemType === 'list' &&
            !this.widgetOptions.readonly &&
            this.parentArray.options.orderable;
        }
      }

      this.frameworkInitialized = true;
    } else {
      this.options = {};
    }
  }

  updateTitle() {
    this.widgetLayoutNode.options.title=
    //let newTitle = 
    this.jsf.parseText(
      this.dynamicTitle,
      this.jsf.getFormControlValue(this),
      this.jsf.getFormControlGroup(this).value,
      this.dataIndex()[this.dataIndex().length - 1]
    );
    //this.widgetLayoutNode.options ={ ...this.widgetLayoutNode.options, title: newTitle }
   //attempt to trigger change detection by changing widgetLayoutNode ref
   // const newLayoutNode = { ...this.widgetLayoutNode, options: { ...this.widgetLayoutNode.options, title: newTitle } };
  //this.widgetLayoutNode = newLayoutNode;
  }

  removeItem() {
    this.jsf.removeItem(this);
  }
}
