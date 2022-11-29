/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { McAppConfig } from './app-config.service';
import { McApiUtils } from '../mc-api-utils';
import { Page } from '../page.model';
import { PageData } from '../page-data.model';
import { Partner } from '../mc-models/partner.model';
import {Bank} from "@mc/core";

@Injectable()
export class PartnersApiService {
  private apiUrl = 'api/partners';
  private apiStatesUrl = 'api/partner-statuses';

  private items = new Array<Partner>();
  private states: any[];

  onStatesChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private http: HttpClient, private config: McAppConfig) {
    this.apiUrl = config.get('api-server') + config.get('api-partners-url');
    this.apiStatesUrl = config.get('api-server') + config.get('api-partner-info-statuses-url');
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

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  public deleteItem(id: number): Promise<boolean> {
    if (id === 0) {
      return Promise.resolve(false);
    }

    const url = this.apiUrl + '/' + id;
    return new Promise((resolve, reject) => {
      this.http.delete(url).subscribe((response: any) => {
        resolve(true);
      }, reject);
    });
  }

  public publishToKafka(id: number): Promise<boolean> {
    if (id === 0) {
      return Promise.resolve(false);
    }

    const url = this.apiUrl + '/' + id + '/publishToKafka';
    return new Promise((resolve, reject) => {
      this.http.put(url, {}).subscribe((response: any) => {
        resolve(true);
      }, reject);
    });
  }

  update(item: Partner): Promise<any> {
    const url = this.apiUrl + (item.id ? '/' + item.id : '');
    const newItem = new Partner(item);
    return new Promise((resolve, reject) => {
      if (item.id) {
        this.http.put(url, { ...newItem }).subscribe(response => {
          resolve(response);
        }, reject);
      } else {
        this.http.post(url, { ...newItem }).subscribe(response => {
          resolve(response);
        }, reject);
      }
    });
  }

  public getItem(id: number): Promise<Partner> {
    if (id === 0) {
      return Promise.resolve(new Partner({}));
    }

    const url = this.apiUrl + '/' + id;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        resolve(new Partner(response));
      }, reject);
    });
  }

  public getItemsOnPagesFrom(page: Page): Promise<Array<Partner>> {
    // partners

    const nextPage = new Page();
    nextPage.filters = page.filters;
    nextPage.pageSize = page.pageSize;
    nextPage.sortField = page.sortField;
    nextPage.sortDirection = page.sortDirection;
    nextPage.searchText = page.searchText;
    nextPage.pageNumber = page.pageNumber + 1;

    return new Promise((resolve, reject) => {
      this.getItemsOnPage(page)
        .then(items => {
          if (items.length < 100) {
            resolve(items);
          } else {
            this.getItemsOnPagesFrom(nextPage)
              .then(moreItems => {
                items.push(...moreItems);
                resolve(items);
              })
              .catch(reason => reject(reason));
          }
        })
        .catch(reason => reject(reason));
    });
  }

  public getItemsOnPagesParallelFrom(page: Page, streams: number): Promise<Array<Partner>> {
    const pages = new Array<Page>();
    let currentPage = page;

    for (let i = 0; i < streams; i++) {
      pages.push(currentPage);
      currentPage = Page.getCopy(currentPage);
      currentPage.pageNumber++;
    }

    const promises = pages.map(p => this.getItemsOnPage(p));

    return new Promise((resolve, reject) => {
      Promise.all(promises)
        .then(results => {
          const items = new Array<Partner>();
          results.forEach(partnerList => items.push(...partnerList));
          if (items.length < page.pageSize * streams) {
            resolve(items);
          } else {
            this.getItemsOnPagesParallelFrom(currentPage, streams)
              .then(moreItems => {
                items.push(...moreItems);
                resolve(items);
              })
              .catch(reason => reject(reason));
          }
        })
        .catch(reason => reject(reason));
    });
  }

  public getItemsOnPage(page: Page): Promise<Array<Partner>> {
    const rawJSON = sessionStorage.getItem('jo1n-partners');
    if (!rawJSON) {
      return Promise.reject();
    }
    const result = JSON.parse(rawJSON).map(i => new Partner(i));
    console.log( 'result partners', result );
    return Promise.resolve(result);
  }

  public setInfoStatus(item: Partner, newInfoStatus: any) {
    if (!item.id) {
      return;
    }

    const url = this.apiUrl + '/' + item.id + '/infoStatus';
    const body = { infoStatusId: newInfoStatus.id || null };

    return new Promise((resolve, reject) => {
      this.http.put(url, { ...body }).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  getStates(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiStatesUrl).subscribe((response: any) => {
        this.states = response;
        this.onStatesChanged.next(this.states);
        resolve(this.states);
      }, reject);
    });
  }

  getTimezones(): Promise<any> {
    const timezones = [
      {
        id: '',
        caption: 'не указан',
      },
      {
        id: 'MSK-1',
        caption: 'МСК-1: Калининград (UTC+2)',
      },
      {
        id: 'MSK',
        caption: 'МСК: Москва (UTC+3)',
      },
      {
        id: 'MSK+1',
        caption: 'МСК+1: Самара (UTC+4)',
      },
      {
        id: 'MSK+2',
        caption: 'МСК+2: Екатеринбург (UTC+5)',
      },
      {
        id: 'MSK+3',
        caption: 'МСК+3: Омск (UTC+6)',
      },
      {
        id: 'MSK+4',
        caption: 'МСК+4: Красноярск (UTC+7)',
      },
      {
        id: 'MSK+5',
        caption: 'МСК+5: Иркутск (UTC+8)',
      },
      {
        id: 'MSK+6',
        caption: 'МСК+6: Якутск	(UTC+9)',
      },
      {
        id: 'MSK+7',
        caption: 'МСК+7: Владивосток (UTC+10)',
      },
      {
        id: 'MSK+8',
        caption: 'МСК+8: Магадан (UTC+11)',
      },
      {
        id: 'MSK+9',
        caption: 'МСК+9: Камчатка (UTC+12)',
      },
    ];

    return Promise.resolve(timezones);
  }
}
