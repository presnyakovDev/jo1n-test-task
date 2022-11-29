/* eslint-disable */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {McApiUtils, McAppConfig, Page, PageData} from '@mc/core';

import {ServiceProduct} from '../models/service-product.model';

@Injectable()
export class ServiceProductsApiService {
  private apiUrl = 'api/service';

  constructor(private http: HttpClient, private config: McAppConfig) {
    this.apiUrl = config.get('api-server') + config.get('api-services-url');
  }

  public getItem(id: number): Promise<ServiceProduct> {
    if (id === 0) {
      return Promise.resolve(new ServiceProduct({}));
    }
    const productsJSON = sessionStorage.getItem('jo1n-service-products');
    if (!productsJSON) {
      return Promise.reject();
    }
    let products = JSON.parse(productsJSON).map(i => new ServiceProduct(i));
    const index = products.findIndex(it => it.id === id);
    if (index === -1) {
      return Promise.reject();
    }
    return Promise.resolve(products[index]);
  }

  public updateItem(item: ServiceProduct): Promise<any> {
    const productsJSON = sessionStorage.getItem('jo1n-service-products');
    if (!productsJSON) {
      return Promise.reject();
    }
    let products = JSON.parse(productsJSON).map(i => new ServiceProduct(i));
    if (item.id) {
      const index = products.findIndex(it => it.id === item.id);
      if (index === -1) {
        products[index] = item;
      }
    } else {
      item.id = Math.floor(Math.random() * 10000);
      products.push(item);
    }
    sessionStorage.setItem('jo1n-service-products', JSON.stringify(products));
    return Promise.resolve({});
  }

  public deleteItem(id: number): Promise<boolean> {
    if (id === 0) {
      return Promise.resolve(false);
    }
    const productsJSON = sessionStorage.getItem('jo1n-service-products');
    if (!productsJSON) {
      return Promise.reject();
    }
    let products = JSON.parse(productsJSON).map(i => new ServiceProduct(i));
    const index = products.findIndex(item => item.id === id);
    if (index === -1) {
      return Promise.reject();
    }
    products.splice(index, 1);
    sessionStorage.setItem('jo1n-service-products', JSON.stringify(products));
    return Promise.resolve(true);
  }

  public getItemsDataOnPage(page: Page): Promise<PageData> {
    return new Promise((resolve, reject) => {
      this.getItemsOnPage(page)
        .then(items => {
          resolve(new PageData({ items: items }));
        })
        .catch(reason => {
          resolve(new PageData({ reason: reason, error: McApiUtils.getErrorFromReason(reason) }));
        });
    });
  }

  public getItemsOnPage(page: Page): Promise<Array<ServiceProduct>> {
    const productsJSON = sessionStorage.getItem('jo1n-service-products');
    if (!productsJSON) {
      return Promise.reject();
    }
    const products = JSON.parse(productsJSON).map(i => new ServiceProduct(i));
    return Promise.resolve(products);
  }
}
