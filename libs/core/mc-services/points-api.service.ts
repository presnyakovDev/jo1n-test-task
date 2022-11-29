/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { McAppConfig } from './app-config.service';
import { McApiUtils } from '../mc-api-utils';
import { Page } from '../page.model';
import { PageData } from '../page-data.model';
import { Company } from '../mc-models/company.model';
import { Point } from '../mc-models/point.model';
import { CompaniesApiService } from './companies-api.service';
import { McUtils } from '../mc-utils';

@Injectable()
export class PointsApiService {
  private apiUrl = 'api/points'; // URL to web api
  private apiStatesUrl = 'api/point-statuses';
  private apiSystemStatesUrl = 'api/system-statuses';
  private apiMarketsUrl = 'api/markets'; // URL to web api

  private useFetchPageSize = 100;

  private items = new Array<Point>();
  private states: any[];

  onStatesChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private http: HttpClient, private companiesService: CompaniesApiService, private config: McAppConfig) {
    this.apiUrl = config.get('api-server') + config.get('api-points-url');
    this.apiStatesUrl = config.get('api-server') + config.get('api-point-info-statuses-url');
    this.apiMarketsUrl = config.get('api-server') + config.get('api-markets-url');
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

  public getItemsOnPagesFrom(page: Page): Promise<Array<Point>> {
    const nextPage = new Page();
    nextPage.filters = page.filters;
    nextPage.pageSize = page.pageSize;
    nextPage.sortField = page.sortField;
    nextPage.sortDirection = page.sortDirection;
    nextPage.pageNumber = page.pageNumber + 1;

    return new Promise((resolve, reject) => {
      this.getItemsOnPage(page)
        .then(items => {
          if (items.length < this.useFetchPageSize) {
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

  public getItemsByCompany(companyId: number, general = false): Promise<Array<Point>> {
    const page = new Page();
    page.filters.set('companyId', companyId.toString());
    page.pageSize = this.useFetchPageSize;
    page.sortField = 'caption';
    page.sortDirection = 'asc';
    if (general) {
      page.filters.set('option', 'general');
    }

    return this.getItemsOnPagesFrom(page);
  }

  public getItemsByPartnerId(partnerId: number, general = false): Promise<Array<Point>> {
    return new Promise((resolve, reject) => {
      this.companiesService
        .getItemsByOwner(partnerId)
        .then(companies => {
          Promise.all(companies.map(company => this.getItemsByCompany(company.id, general)))
            .then(pointLists => {
              const resultList = new Array<Point>();
              pointLists.forEach(list => resultList.push(...list));
              resultList.sort(McUtils.compareByCaption);
              resolve(resultList);
            })
            .catch(reason => reject(reason));
        })
        .catch(reason => reject(reason));
    });
  }

  getOwnerCrumbs(ownerId: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.companiesService
        .getItem(ownerId, 0)
        .then(item => {
          this.companiesService
            .getOwnerCrumbs(item.partnerId)
            .then(crumbs => {
              crumbs.push(item);
              resolve(crumbs);
            })
            .catch(() => {
              reject();
            });
        })
        .catch(() => {
          reject();
        });
    });
  }

  public setInfoStatus(item: Point, newInfoStatus: any) {
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

  update(item: Point): Promise<any> {
    const url = this.apiUrl + (item.id ? '/' + item.id : '');
    const newItem = new Point(item);
    newItem.bankCodes = undefined;
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

  public blockItemById(id: number): Promise<any> {
    const url = this.apiUrl + '/' + id + '/block';
    return new Promise((resolve, reject) => {
      this.http.put(url, {}).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  public unblockItemById(id: number): Promise<any> {
    const url = this.apiUrl + '/' + id + '/unblock';
    return new Promise((resolve, reject) => {
      this.http.put(url, {}).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  public getItem(id: number, companyId: number): Promise<Point> {
    if (id === 0) {
      return Promise.resolve(new Point({ companyId: companyId }));
    }

    const url = this.apiUrl + '/' + id;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        resolve(new Point(response));
      }, reject);
    });
  }

  public getItemsOnPage(page: Page): Promise<Array<Point>> {
    let params = McApiUtils.getHttpParamsForPage(page);

    if (page.searchText) {
      params = params.set('query', page.searchText);
    }

    const url = this.apiUrl + '?' + params.toString();

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        this.items = response;

        this.items = this.items.map(item => {
          return new Point(item);
        });

        resolve(this.items);
      }, reject);
    });
  }

  public getItemsByOwner(ownerId: number): Promise<Array<Point>> {
    const page = new Page();
    page.filters.set('companyId', ownerId.toString());
    page.pageSize = 100;

    return this.getItemsOnPagesFrom(page);
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

  async getSystemStates(): Promise<any> {
    return [
      {
        id: 'new',
        caption: 'Действует (new)',
      },
      {
        id: 'block',
        caption: 'Блокирован (block)',
      },
      {
        id: 'delete',
        caption: 'Удален (delete)',
      },
    ];
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

  async getMarkets(): Promise<any> {
    return await this.http.get(this.apiMarketsUrl).toPromise();
  }

  getHousings(): string[] {
    return ['Собственность', 'Аренда', 'Субаренда'];
  }

  public getItemsByCompanies(items: Array<Company>): Promise<Array<Point>> {
    return new Promise((resolve, reject) => {
      const perItemPromises = items.map(item => this.getItemsByOwner(item.id));

      Promise.all(perItemPromises)
        .then(arrArrCodes => {
          const resultArray = new Array<Point>();
          arrArrCodes.forEach(arrCodes => {
            resultArray.push(...arrCodes);
          });
          resolve(resultArray);
        })
        .catch(reason => {
          reject(reason);
        });
    });
  }

  public async getItemsByIds(ids: number[]): Promise<Array<Point>> {
    const points: Point[] = [];
    for (let i = 0; i < ids.length; i++) {
      const point = await this.getItem(ids[i], null);
      points.push(point);
    }
    return points;
  }

  public async getItemsByIdsFromList(ids: number[]): Promise<Array<Point>> {
    let stringIds = ids.map(id => id.toString());
    const result: Point[] = [];
    const page = new Page();
    page.pageSize = 50;
    while (stringIds.length > 0) {
      page.arrayFilters.set('pointId', stringIds.slice(0, page.pageSize));
      stringIds = stringIds.slice(page.pageSize);
      const points = await this.getItemsOnPage(page);
      result.push(...points);
    }
    return result;
  }
}
