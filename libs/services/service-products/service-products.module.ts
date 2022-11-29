/* eslint-disable */
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { McMenuService, MenuItem, SharedModule } from '@mc/core';
import {Mc2021ItemListModule} from "@mc/design/mc2021";

import { McServiceProductsListComponent } from './components/service-products-list.component';
import { McServiceProductFormComponent } from './components/product-form/product-form.component';
import { ServiceProductsApiService } from './services/service-products-api.service';
import { ServiceProductsTemplateApiService } from './services/service-products-template-api.service';
import { McServiceProductsCopyButtonComponent } from './components/copy-button.component';

const routes = [
  { path: 'service-products/items', component: McServiceProductsListComponent, pathMatch: 'full' },
  { path: 'service-products/items/:id', component: McServiceProductFormComponent },
  { path: 'service-products/items/:id/:sourceId', component: McServiceProductFormComponent },
];

@NgModule({
  declarations: [
    McServiceProductsListComponent,
    McServiceProductFormComponent,
    McServiceProductsCopyButtonComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes), Mc2021ItemListModule],
  providers: [ServiceProductsApiService, ServiceProductsTemplateApiService],
})
export class McServiceProductsModule {
  constructor(private menuService: McMenuService) {
    const menuItems: MenuItem[] = [];
    menuItems.push({
      title: 'VAS products',
      icon: 'layers',
      type: 'item',
      url: 'service-products/items',
    });

    this.menuService.addMenuItem({
      type: 'group',
      title: 'VAS',
      children: menuItems,
    });
  }
}
