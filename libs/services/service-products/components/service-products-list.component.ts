/* eslint-disable */
import { Component, ComponentFactoryResolver } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";

import { Page } from '@mc/core';
import { McItemListSpecs } from '@mc/common';

import { ServiceProductsApiService } from '../services/service-products-api.service';
import { ServiceProduct } from '../models/service-product.model';
import { McServiceProductsCopyButtonComponent } from './copy-button.component';

@Component({
  selector: 'mc-service-products-list',
  template: '<mc-2021-item-list [specs]="specs"></mc-2021-item-list>',
  styleUrls: [],
})
export class McServiceProductsListComponent implements McItemListSpecs {
  itemsListType = 'additional-services-products';
  caption = 'Продукты';

  freeTextQueryEnabled = true;
  freeTextQueryPlaceholder = 'Наименование';

  addItemEnabled = true;
  addItemDisableReason = null;

  filters = [];

  columns = [
    {
      id: 'code',
      caption: 'Код',
      showByDefault: true,
      sort: true,
      content: (item: any) => item.code,
      width: 100,
    },
    {
      id: 'caption',
      caption: 'Наименование',
      showByDefault: true,
      sort: false,
      content: (item: any) => item.getTitle(),
      width: 150,
    },
    {
      id: 'actions',
      caption: 'Действия',
      showByDefault: true,
      sort: false,
      component: (item: any) => this.factoryResolver.resolveComponentFactory(McServiceProductsCopyButtonComponent),
      content: (item: any) => '',
      width: 160,
    },
  ];

  get specs(): any {
    return this;
  }

  constructor(
    private itemsApiService: ServiceProductsApiService,
    private factoryResolver: ComponentFactoryResolver,
    private dialog: MatDialog,
  ) {}

  rowStyle(item: any) {
    return null;
  }

  getItemsOnPage(page: Page): Promise<any[]> {
    return this.itemsApiService.getItemsOnPage(page);
  }

  addItemRoute() {
    return new ServiceProduct({ id: 0 }).getEditRoute();
  }

  async editItemRoute(item: ServiceProduct): Promise<any[]> {
    return item.getEditRoute();
  }
}
