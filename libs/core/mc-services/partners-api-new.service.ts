/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map } from 'rxjs';

import { McAppConfig } from './app-config.service';
import { McApiUtils } from '../mc-api-utils';
import { Page } from '../page.model';
import { PageData } from '../page-data.model';
import { PartnerBase } from '../mc-models/partner-base.model';

@Injectable({
  providedIn: 'root',
})
export class PartnersApiNewService {
  private apiUrl = 'api/partners/v2';
  private apiStatesUrl = 'api/partner-statuses';

  private items = new Array<PartnerBase>();
  private states: any[];

  onStatesChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private http: HttpClient, private config: McAppConfig) {
    this.apiUrl = config.get('api-server') + config.get('api-partners-url') + '/v2';
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

  public async getMcPartner(): Promise<PartnerBase> {
    const page = new Page();
    page.searchText = 'MC (наша компания)';
    page.sortField = 'changeStamp';
    let candidates = await this.getItemsOnPagesFrom(page);
    candidates = candidates.filter(item => item.caption === 'MC (наша компания)');
    return candidates.length > 0 ? candidates[0] : null;
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

  update(item: PartnerBase, newInfoStatusCode: string = null, salesTerritoryId): Promise<any> {
    const url = this.apiUrl + (item.id ? '/' + item.id : '');
    return new Promise((resolve, reject) => {
      if (item.id) {
        this.http.put(url, { ...item }).subscribe(response => {
          resolve({ id: item.id });
        }, reject);
      } else {
        this.http
          .post(url + '?infoStatusCode=' + newInfoStatusCode + '&salesTerritoryId=' + salesTerritoryId, { ...item })
          .subscribe(response => {
            resolve(response);
          }, reject);
      }
    });
  }

  public getItem(id: number): Promise<any> {
    if (id === 0) {
      return Promise.resolve(new PartnerBase({}));
    }

    const url = this.apiUrl + '/' + id;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        resolve(new PartnerBase(response));
      }, reject);
    });
  }

  public getItemsOnPagesFrom(page: Page): Promise<Array<PartnerBase>> {
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

  public getItemsOnPagesParallelFrom(page: Page, streams: number): Promise<Array<PartnerBase>> {
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
          const items = new Array<PartnerBase>();
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

  public getItemsOnPage(page: Page): Promise<Array<PartnerBase>> {
    let params = McApiUtils.getHttpParamsForPage(page);

    if (page.searchText) {
      params = params.set('query', page.searchText);
    }

    const url = this.apiUrl + '?' + params.toString();

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        this.items = response;

        if (this.items) {
          this.items = this.items.map(item => new PartnerBase(item));
        } else {
          this.items = new Array<PartnerBase>();
        }
        resolve(this.items);
      }, reject);
    });
  }

  public setInfoStatus(item: PartnerBase, newInfoStatus: any) {
    if (!item.id) {
      return;
    }
    const url = this.apiUrl + '/' + item.id + '/' + 'infoStatus?infoStatusCode=' + newInfoStatus;
    return new Promise((resolve, reject) => {
      this.http.put(url, {}, { responseType: 'text' }).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  public async setTerritory(item: PartnerBase, newTerritoryId: number) {
    if (!item.id) {
      return;
    }
    const url = this.apiUrl + '/' + item.id + '/' + 'territory?salesTerritoryId=' + newTerritoryId;
    return await this.http.put(url, {}, { responseType: 'text' }).toPromise();
  }

  getStates(): Promise<any[]> {
    if (this.states) {
      return Promise.resolve(this.states);
    }
    return new Promise((resolve, reject) => {
      this.http.get(this.apiStatesUrl).subscribe((response: any) => {
        this.states = response;
        this.onStatesChanged.next(this.states);
        resolve(this.states);
      }, reject);
    });
  }

  async getStatesMap(): Promise<Map<string, string>> {
    const map = new Map<string, string>();
    const states = await this.getStates();
    states.forEach(state => map.set(state.code, state.caption));
    return map;
  }

  getTimezones(): Promise<any> {
    const timezones = [
      {
        id: 'UTC+0',
        caption: 'Las Palmas (UTC+0)',
      },
      {
        id: 'UTC+1',
        caption: 'Madrid (UTC+1)',
      },
    ];

    return Promise.resolve(timezones);
  }
}
