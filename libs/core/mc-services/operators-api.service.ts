/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { PageData } from '../page-data.model';
import { Page } from '../page.model';
import { McAppConfig } from './app-config.service';
import { McApiUtils } from '../mc-api-utils';
import { PointsApiService } from './points-api.service';
import { Operator } from '../mc-models/operator.model';
import { Point } from '../mc-models/point.model';
import { Company } from '../mc-models/company.model';

@Injectable()
export class OperatorsApiService {
  private apiUrl = 'api/operators';

  onStatesChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private http: HttpClient, private pointsService: PointsApiService, private config: McAppConfig) {
    this.apiUrl = this.config.get('api-server') + this.config.get('api-operators-url');
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

  getOwnerCrumbs(ownerId: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.pointsService
        .getItem(ownerId, 0)
        .then(item => {
          this.pointsService
            .getOwnerCrumbs(item.companyId)
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

  public setOwner(item: Operator, newOwnerId: number) {
    if (!item.id) {
      return;
    }

    const url = this.apiUrl + '/' + item.id + '/point/' + newOwnerId;
    const body = { pointId: newOwnerId || null };

    return new Promise((resolve, reject) => {
      this.http.put(url, { ...body }, { responseType: 'text' }).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  setActivation(item: Operator, action: 'activate' | 'deactivate'): Promise<any> {
    if (!item.id) {
      return Promise.reject('No operator id');
    }
    const url = this.apiUrl + '/' + item.id + '/' + action;
    return new Promise((resolve, reject) => {
      this.http.post(url, {}).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  setNewPassword(item: Operator, newPassword: string): Promise<any> {
    if (!item.id) {
      return Promise.reject('No operator id');
    }
    const url = this.apiUrl + '/' + item.id + '/password';
    return new Promise((resolve, reject) => {
      this.http.put(url, { newPassword: newPassword }).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  updateAgencyFee(item: Operator): Promise<any> {
    if (!item.id) {
      return Promise.reject('No operator id');
    }
    const url = this.apiUrl + '/' + item.id + '/agencyFee';
    const newItem = new Operator(item);
    return new Promise((resolve, reject) => {
      this.http.put(url, { ...newItem }).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  update(item: Operator): Promise<any> {
    const url = this.apiUrl + (item.loginMode === 2 && !item.id ? '/byPhone' : `/${item.id ?? ''}`);

    const newItem = new Operator(item);

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

  public getItemOnNullIfError(id: number, pointId: number): Promise<Operator> {
    const url = this.apiUrl + '/' + id;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe(
        (response: any) => {
          resolve(new Operator(response));
        },
        error => {
          resolve(null);
        },
      );
    });
  }

  public getItem(id: number, pointId: number): Promise<Operator> {
    if (id === 0) {
      return Promise.resolve(new Operator({ pointId: pointId, needAnket: true }));
    }

    const url = this.apiUrl + '/' + id;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        resolve(new Operator(response));
      }, reject);
    });
  }

  public getItemsOnPage(page: Page): Promise<Array<Operator>> {
    let params = McApiUtils.getHttpParamsForPage(page);

    if (page.searchText) {
      params = params.set('query', page.searchText);
    }

    const url = this.apiUrl + '?' + params.toString();

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        const itemsOnPage = response.map(item => {
          return new Operator(item);
        });
        resolve(itemsOnPage);
      }, reject);
    });
  }

  public getItemsOnPagesFrom(page: Page): Promise<Array<Operator>> {
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

  public getItemsByCompany(companyId: number, onlyActual = false, options: string[] = null): Promise<Array<Operator>> {
    const page = new Page();
    page.filters.set('companyId', companyId.toString());
    page.pageSize = 100;
    page.sortField = 'lastName';
    page.sortDirection = 'asc';
    if (options) {
      page.arrayFilters.set('option', options);
    }
    if (onlyActual) {
      page.filters.set('onlyActualDocStatus', 'YES');
    }

    return this.getItemsOnPagesFrom(page);
  }

  public getItemsByOwner(ownerId: number): Promise<Array<Operator>> {
    const page = new Page();
    page.pageSize = 100;
    page.filters.set('pointId', ownerId.toString());

    return this.getItemsOnPage(page);
  }

  getSystemStates(): any[] {
    return [
      {
        id: 'new',
        caption: 'Анкета (new)',
      },
      {
        id: 'end',
        caption: 'Действует (end)',
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

  getLoginModes(): string[] {
    return ['Конверт учетной записи', 'Ввод логина/пароля', 'Регистрация по номеру телефона'];
  }

  public getItemsByPoints(items: Array<Point>): Promise<Array<Operator>> {
    return new Promise((resolve, reject) => {
      const perItemPromises = items.map(item => this.getItemsByOwner(item.id));

      Promise.all(perItemPromises)
        .then(arrArrItems => {
          const resultArray = new Array<Operator>();
          const alreadyMap = new Map<Number, boolean>();
          arrArrItems.forEach(arrItems => {
            arrItems.forEach(item => {
              if (!alreadyMap.get(item.id)) {
                resultArray.push(item);
                alreadyMap.set(item.id, true);
              }
            });
          });
          resolve(resultArray);
        })
        .catch(reason => {
          reject(reason);
        });
    });
  }

  public getItemsByCompanies(
    items: Array<Company>,
    onlyActual = false,
    options: string[] = null,
  ): Promise<Array<Operator>> {
    return new Promise((resolve, reject) => {
      const perItemPromises = items.map(item => this.getItemsByCompany(item.id, onlyActual, options));

      Promise.all(perItemPromises)
        .then(arrArrCodes => {
          const resultArray = new Array<Operator>();
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
}
