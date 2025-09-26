import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TemplateRef
} from '@angular/core';

// Define the type for the class set functions
export type TabsTemplateOptions = {
  getUlClassSet?: (selectedTab: number) => { [key: string]: boolean };
  getLiClassSet?: (tabIndex: number, selectedTab: number) => { [key: string]: boolean };
  getTabLinkClassSet?: (tabIndex: number, selectedTab: number) => { [key: string]: boolean };
  getTabPaneClassSet?: (tabIndex: number, selectedTab: number) => { [key: string]: boolean };
  getTabContentClassSet?: (selectedTab: number) => { [key: string]: boolean };
};

@Component({
  selector: 'tabs-template',
  standalone: false,
  template: `
    <ul [ngClass]="ulClassSet">
      <li *ngFor="let item of tabContentArray; let i = index; trackBy: trackByIdOrIndex" 
        [ngClass]="liClassSets[i]">
        <a [ngClass]="tabLinkClassSets[i]" (click)="selectTab(i)">
          <ng-container *ngTemplateOutlet="titleTemplate; context: { $implicit: item, index: i  }"></ng-container>
        </a>
      </li>
    </ul>
    <div [ngClass]="tabContentClassSet">
      <ng-container *ngFor="let item of tabContentArray; let i = index; trackBy: trackByIdOrIndex">
        <div [ngClass]="tabPaneClassSets[i]">
          <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: item, index: i  }"></ng-container>
        </div>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .nav-link {
        cursor: pointer;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsTemplateComponent implements OnChanges {
  @Input() tabContentArray: any[] = [];
  @Input() selectedTab: number = 0;
  @Input() tabsTemplate?: TabsTemplateOptions;
  @Output() onTabSelect: EventEmitter<number> = new EventEmitter<number>(); // Emit selected tab index

  @ContentChild('tabTitle', { static: true }) titleTemplate!: TemplateRef<any>;
  @ContentChild('tabContent', { static: true }) contentTemplate!: TemplateRef<any>;

  ulClassSet: { [key: string]: boolean } = {};
  liClassSets: { [key: string]: boolean }[] = [];
  tabLinkClassSets: { [key: string]: boolean }[] = [];
  tabPaneClassSets: { [key: string]: boolean }[] = [];
  tabContentClassSet: { [key: string]: boolean } = {};

  private previousSelectedTab: number = -1; // to compare selectedTab changes
  private previousTabContentArray: any[] = []; // to compare tabContentArray changes
  private previousTabsTemplate: TabsTemplateOptions | undefined;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Only recompute if inputs have actually changed
    if (this.shouldUpdateClassSets(changes)) {
      this.updateClassSets();
    }

  }

  private shouldUpdateClassSets(changes: SimpleChanges): boolean {
    const tabContentArrayChanged = changes['tabContentArray'] && this.tabContentArray !== this.previousTabContentArray;
    const selectedTabChanged = changes['selectedTab'] && this.selectedTab !== this.previousSelectedTab;
    const tabsTemplateChanged = changes['tabsTemplate'] && this.tabsTemplate !== this.previousTabsTemplate;

    if (tabContentArrayChanged || selectedTabChanged || tabsTemplateChanged) {
      this.previousTabContentArray = [...this.tabContentArray];
      this.previousSelectedTab = this.selectedTab;
      this.previousTabsTemplate = this.tabsTemplate;
      this.cdr.markForCheck();
      return true;
    }

    return false;
  }

  updateClassSets() {
    if (!this.tabsTemplate) {
      return;
    }

    // Update class sets based on the current selected tab and available templates
    this.ulClassSet = this.tabsTemplate.getUlClassSet?.(this.selectedTab) || {};
    this.tabContentClassSet = this.tabsTemplate.getTabContentClassSet?.(this.selectedTab) || {};

    // Only update arrays if tabContentArray is not empty and is different
    if (this.tabContentArray.length) {
      this.tabContentArray.forEach((_, i) => {
        // Only update the class set for each tab if it's changed
        const liClassSet = this.tabsTemplate?.getLiClassSet?.(i, this.selectedTab) || {};
        if (JSON.stringify(this.liClassSets[i]) !== JSON.stringify(liClassSet)) {
          this.liClassSets[i] = liClassSet;
        }

        const tabLinkClassSet = this.tabsTemplate?.getTabLinkClassSet?.(i, this.selectedTab) || {};
        if (JSON.stringify(this.tabLinkClassSets[i]) !== JSON.stringify(tabLinkClassSet)) {
          this.tabLinkClassSets[i] = tabLinkClassSet;
        }

        const tabPaneClassSet = this.tabsTemplate?.getTabPaneClassSet?.(i, this.selectedTab) || {};
        if (JSON.stringify(this.tabPaneClassSets[i]) !== JSON.stringify(tabPaneClassSet)) {
          this.tabPaneClassSets[i] = tabPaneClassSet;
        }
      });
    }
  }

  // Optimized trackBy function to avoid unnecessary DOM updates
  trackByIdOrIndex(index: number, item: any): any {
    // Check if the item has an _id property, else use the index or fallback value
    return item._id ? item._id : index;  // Fall back to index if no _id
  }

  selectTab(index: number) {
    // Only update if the selectedTab is different
    if (this.selectedTab !== index) {
      this.selectedTab = index;
      this.updateClassSets(); // Update the class sets immediately after changing the selected tab

      // Emit the tab selection event to the parent
      this.onTabSelect.emit(this.selectedTab);

      // Manually trigger change detection to ensure the view is updated
      this.cdr.markForCheck();
    }
  }
}
