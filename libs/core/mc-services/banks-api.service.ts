/* eslint-disable */
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {McAppConfig} from './app-config.service';
import {Bank} from '../mc-models/bank.model';

@Injectable()
export class BanksApiService {
  private apiUrl = 'api/test-banks'; // URL to web api
  private items = new Array<Bank>();

  constructor(private http: HttpClient, private config: McAppConfig) {
    this.apiUrl = config.get('api-server') + config.get('api-banks-url');
  }

  public getItems(activeOnly = true): Promise<Array<Bank>> {
    const productsJSON = sessionStorage.getItem('jo1n-service-products');
    if (!productsJSON) {
      return Promise.reject();
    }
    this.items = JSON.parse(productsJSON).map(i => new Bank(i));
    return Promise.resolve(this.filterItemsByActivity(activeOnly));
  }

  private filterItemsByActivity(activeOnly: boolean) {
    return activeOnly ? this.items.filter(item => item.status !== 'off') : this.items;
  }
}
