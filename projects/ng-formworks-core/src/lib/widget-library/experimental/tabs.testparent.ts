import { Component } from '@angular/core';
import { TabsTemplateOptions } from './tabs.template';

@Component({
  selector: 'tabs-testparent',
  standalone: false,
  template: `
    <tabs-template [tabsTemplate]="tabsTemplate" [tabContentArray]="products" [selectedTab]="activeTab">
      <ng-template #tabTitle let-product>
        <span class="fw-bold">{{ product.name }}</span>
      </ng-template>
      <ng-template #tabContent let-product let-i="index">
        <h3>{{ product.name }} Details</h3>
        <p>
          Price: <strong>{{ product.price | currency }}</strong>
        </p>
        <p>{{ product.description }}</p>
        <button (click)="remove(i)">remove entry</button>
      </ng-template>
    </tabs-template>
    <button (click)="add($event)">add entry</button>
  `,
})
export class TabsTestParentComponent {
   tabsTemplate:TabsTemplateOptions={
    getUlClassSet:(selectedTab)=>{
        return {"nav nav-tabs":true}
    },
    getLiClassSet:(index,selectedTab)=>{
        return {
            "nav-item":true
        }
    },
    getTabPaneClassSet(index,selectedTab){
        return {
            "tab-pane fade":true,
            "show active": selectedTab === index
        } 
    },
    getTabLinkClassSet(index,selectedTab){
        return {
            "nav-link":true,
            "active": selectedTab === index
        } 
    },
    getTabContentClassSet:(selectedTab)=>{
         return {"tab-content mt-3":true}
    }
   } 
  products = [
    { id: 1, name: 'Product A', price: 19.99, description: 'Description for Product A.' },
    { id: 2, name: 'Product B', price: 29.99, description: 'Description for Product B.' },
    { id: 3, name: 'Product C', price: 39.99, description: 'Description for Product C.' },
  ];
  activeTab = 0;
  add(e){
    this.products=[...this.products,
      { id: this.products.length, name: `Product P${this.products.length}`, price: Math.round(Math.random()*100), description: 'Description for Product' }
    ]
  }
  remove(ind){
    this.products= [
      ...this.products.slice(0, ind),
      ...this.products.slice(ind + 1)
    ];
  }

}