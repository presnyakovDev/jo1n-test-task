/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

import { McAppConfig } from './app-config.service';
import { McApiUtils } from '../mc-api-utils';
import { Page } from '../page.model';
import { PageData } from '../page-data.model';
import { Company } from '../mc-models/company.model';
import { Partner } from '../mc-models/partner.model';
import { PartnersApiService } from './partners-api.service';

@Injectable()
export class CompaniesApiService {
  private apiUrl = 'api/companies'; // URL to web api
  private apiStatesUrl = 'api/company-statuses';

  private states: any[];

  onStatesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onCompanyUpdate: Subject<Company> = new Subject<Company>();

  constructor(private http: HttpClient, private partnerService: PartnersApiService, private config: McAppConfig) {
    this.apiUrl = config.get('api-server') + config.get('api-companies-url');
    this.apiStatesUrl = config.get('api-server') + config.get('api-company-info-statuses-url');
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

  getOwnerCrumbs(ownerId: number): Promise<any[]> {
    if (!ownerId || ownerId === null) {
      const item = new Partner({ caption: 'не выбран', id: -1 });
      return Promise.resolve([item]);
    }

    return new Promise((resolve, reject) => {
      this.partnerService
        .getItem(ownerId)
        .then(item => {
          resolve([item]);
        })
        .catch(() => {
          reject();
        });
    });
  }

  bankParamsAuthorizationStatus(
    item: Company,
    bankId: number,
    regionalOfficeId: number,
    newStatus: string,
    fillRegionalOfficeIfEmpty = false
  ): Promise<any> {
    const url = this.apiUrl + '/' + item.id + '/bankParamsAuthorizationStatus';
    const requestBody = {
      bankId: bankId,
      regionalOfficeId: regionalOfficeId,
      fillRegionalOfficeIfEmpty: fillRegionalOfficeIfEmpty,
      status: newStatus,
    };
    return new Promise((resolve, reject) => {
      this.http.post(url, requestBody).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  deleteFinProperties(item: Company): Promise<any> {
    const url = this.apiUrl + '/' + item.id + '/finProperties';
    return new Promise((resolve, reject) => {
      this.http.delete(url).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  updateFinProperties(item: Company, approver: string): Promise<any> {
    const url = this.apiUrl + '/' + item.id + '/finProperties';
    const finProperties = item.encodeJsonProperties(approver);
    return new Promise((resolve, reject) => {
      this.http.put(url, finProperties).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  update(item: Company): Promise<any> {
    this.onCompanyUpdate.next(item);
    const url = this.apiUrl + (item.id ? '/' + item.id : '');
    const newItem = new Company(item);
    if (!newItem.kpp) {
      newItem.kpp = null;
    }
    newItem.bankParams = undefined;
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

  public getItemsOnPagesFrom(page: Page): Promise<Array<Company>> {
    const nextPage = new Page();
    nextPage.filters = page.filters;
    nextPage.pageSize = page.pageSize;
    nextPage.sortField = page.sortField;
    nextPage.sortDirection = page.sortDirection;
    nextPage.pageNumber = page.pageNumber + 1;

    return new Promise((resolve, reject) => {
      this.getItemsOnPage(page)
        .then(items => {
          if (items.length < page.pageSize) {
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

  public getItem(id: number, partnerId: number): Promise<Company> {
    if (id === 0) {
      return Promise.resolve(new Company({ partnerId: partnerId }));
    }

    const url = this.apiUrl + '/' + id;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        resolve(new Company(response));
      }, reject);
    });
  }

  public getItemsOnPage(page: Page): Promise<Array<Company>> {
    let params = McApiUtils.getHttpParamsForPage(page);

    if (page.searchText) {
      params = params.set('query', page.searchText);
    }

    const url = this.apiUrl + '?' + params.toString();

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        const items = response.map(item => new Company(item));
        resolve(items);
      }, reject);
    });
  }

  public getItemsByIds(ids: number[]): Promise<Array<Company>> {
    return new Promise((resolve, reject) => {
      Promise.all(ids.map(id => this.getItem(id, null))).then(resolve, reject);
    });
  }

  public getItemsByOwner(ownerId: number, option: string = null): Promise<Array<Company>> {
    const page = new Page();
    page.filters.set('partnerId', ownerId.toString());
    if (option) {
      page.filters.set('option', option);
    }
    page.pageSize = 100;

    return this.getItemsOnPagesFrom(page);
  }

  public setInfoStatus(item: Company, newInfoStatus: any) {
    if (!item.id) {
      return;
    }

    const url = this.apiUrl + '/' + item.id + '/infoStatus';
    const body = { infoStatusId: newInfoStatus.id || null };

    return new Promise((resolve, reject) => {
      this.http.put(url, { ...body }, { responseType: 'text' }).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  public setOwner(item: Company, newOwnerId: number) {
    if (!item.id) {
      return;
    }

    const url = this.apiUrl + '/' + item.id + '/partner';
    const body = { partnerId: newOwnerId || null };

    return new Promise((resolve, reject) => {
      this.http.put(url, { ...body }, { responseType: 'text' }).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  public getByInn(inn: string): Promise<Company> {
    return new Promise((resolve, reject) => {
      const searchPage = new Page();
      searchPage.filters.set('inn', inn);
      searchPage.pageSize = 10;

      this.getItemsOnPage(searchPage)
        .then(result => {
          resolve(result ? result[0] : null);
        })
        .catch(reason => reject(reason));
    });
  }

  public checkByInn(inn: string): Promise<any> {
    const url = this.apiUrl + '/check?inn=' + inn;

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
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
}
