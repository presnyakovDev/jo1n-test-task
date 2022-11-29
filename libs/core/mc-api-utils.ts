/* eslint-disable */
import { HttpParams } from '@angular/common/http';
import { Page } from './page.model';
import { McUtils } from './mc-utils';
import { Injectable } from '@angular/core';

@Injectable()
export class McApiUtils {
  public static blobToString(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsText(blob);
    });
  }

  public static base64ContentToBlob(base64Content: string, contentType: string): Blob {
    const byteString = atob(base64Content);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const bb = new Blob([ab], { type: contentType });

    return bb;
  }

  public static getErrorFromReason(reason: any): string {
    if (reason.status === 403) {
      McUtils.onDecodeErrorsFromReason.next({ reason: reason, errors: ['Нет прав на выполнение действия'] });
      return 'Нет прав на выполнение действия';
    }
    if (reason.status === 502) {
      McUtils.onDecodeErrorsFromReason.next({
        reason: reason,
        errors: ['Сервис временно недоступен, попробуйте еще раз через несколько минут'],
      });
      return 'Сервис временно недоступен, попробуйте еще раз через несколько минут';
    }
    if (reason.error) {
      let decoded = reason.error;
      try {
        decoded = JSON.parse(decoded);
      } catch (err) {
        //
      }
      if (decoded && decoded.errors && decoded.errors.length) {
        const regExpr = /[А-Яа-яЁё]/;
        if (regExpr.test(decoded.errors[0].message)) {
          McUtils.onDecodeErrorsFromReason.next({ reason: reason, errors: [decoded.errors[0].message] });
          return decoded.errors[0].message;
        }
      }
      if (decoded && decoded.message) {
        const regExpr = /[А-Яа-яЁё]/;
        if (regExpr.test(decoded.message)) {
          McUtils.onDecodeErrorsFromReason.next({ reason: reason, errors: [decoded.message] });
          return decoded.message;
        }
      }
      if (decoded && decoded.errorMessage) {
        const regExpr = /[А-Яа-яЁё]/;
        if (regExpr.test(decoded.errorMessage)) {
          McUtils.onDecodeErrorsFromReason.next({ reason: reason, errors: [decoded.errorMessage] });
          return decoded.errorMessage;
        }
      }
    }
    const errText = JSON.stringify(reason).replace(/:/g, ': ').replace(/,/g, ', ');
    McUtils.onDecodeErrorsFromReason.next({ reason: reason, errors: [errText] });
    return errText;
  }

  public static getSimpleDictionaryApiURL(type: string): string {
    return 'api/dictionary?type=' + type;
  }

  public static processPromisesChunked(promises: Promise<any>[], chunkSize: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const promisesChunk = promises.slice(0, chunkSize);
      Promise.all(promisesChunk)
        .then(results => {
          if (promises.length <= chunkSize) {
            resolve(results);
          } else {
            this.processPromisesChunked(promises.slice(chunkSize), chunkSize)
              .then(resultsMore => {
                resolve([...results, ...resultsMore]);
              })
              .catch(reason => reject(reason));
          }
        })
        .catch(reason => reject(reason));
    });
  }

  public static getHttpParamsForPage(page: Page): HttpParams {
    let params = new HttpParams();

    page.filters.forEach((value: string, field: string) => {
      if (field === 'onlyActualDocStatus') {
        params = params.append('docStatus', 'new');
        params = params.append('docStatus', 'end');
      } else {
        if (value) {
          params = params.append(field, value);
        }
      }
    });

    page.arrayFilters.forEach((values: string[], field: string) => {
      if (values) {
        values.forEach(value => {
          params = params.append(field, value);
        });
      }
    });

    page.elemFilters.forEach((value: any, field: string) => {
      if (value) {
        if (field === 'createstampRange') {
          params = params.append('createstampFrom', value.from);
          params = params.append('createstampTo', value.to);
        } else if (field === 'dateRange') {
          params = params.append('dateFrom', value.from);
          params = params.append('dateTo', value.to);
        } else {
          params = params.append(field, value.id);
        }
      }
    });

    const statusFilter = page.filters.get('status');
    if (statusFilter) {
      params = params.append('status', statusFilter);
    }

    if (page.sortField) {
      const dir = page.sortDirection === 'desc' ? ',desc' : '';
      params = params.append('sort', page.sortField + dir);
      if (page.sortField === 'lastName') {
        params = params.append('sort', 'firstName' + dir);
        params = params.append('sort', 'secondName' + dir);
      }
    } else {
      params = params.set('sort', 'changestamp,desc');
    }

    if (page.pageNumber) {
      params = params.set('page', '' + page.pageNumber);
    }

    params = params.set('limit', '' + page.pageSize);

    return params;
  }
}
