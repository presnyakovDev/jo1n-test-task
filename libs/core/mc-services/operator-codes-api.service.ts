/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { McAppConfig } from './app-config.service';
import { McApiUtils } from '../mc-api-utils';
import { OperatorCode } from '../mc-models/operator-code.model';
import { Operator } from '../mc-models/operator.model';
import { Bank } from '../mc-models/bank.model';

@Injectable()
export class OperatorCodesApiService {
  private apiBaseUrl = 'api/operators'; // URL to web api
  private items = new Array<OperatorCode>();

  onItemsChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private http: HttpClient, private config: McAppConfig) {
    this.apiBaseUrl = config.get('api-server') + config.get('api-operators-url');
  }

  public registerCodesRequest(ids: number[], bankId: number): Promise<any> {
    if (!bankId) {
      return Promise.resolve();
    }
    if (!ids.length) {
      return Promise.resolve();
    }

    const url = this.apiBaseUrl + '/codes/send';
    const body = {
      operatorIds: ids,
      bankIds: [bankId],
    };

    return new Promise((resolve, reject) => {
      this.http.post(url, { ...body }, { responseType: 'text' }).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  getOperatorCodesMap(operators: Array<Operator>, operatorCodes: Array<OperatorCode>, banks: Array<Bank>) {
    const tempCodeMap = new Map<string, OperatorCode>();
    for (const operatorCode of operatorCodes) {
      tempCodeMap.set(':' + operatorCode.operatorId + ':' + operatorCode.integrationId, operatorCode);
    }

    const resCodes = new Map<number, Array<OperatorCode>>();
    for (const operator of operators) {
      const codeLine = new Array<any>();
      for (const bank of banks) {
        const operatorCode =
          tempCodeMap.get(':' + operator.id + ':' + bank.id) ||
          new OperatorCode({ integrationId: bank.id, operatorId: operator.id });
        operatorCode.integrationName = bank.name;
        codeLine.push(operatorCode);
      }
      resCodes.set(operator.id, codeLine);
    }
    return resCodes;
  }

  delete(item: OperatorCode): Promise<any> {
    const url = this.apiBaseUrl + '/' + item.operatorId + '/codes/' + item.id;
    return new Promise((resolve, reject) => {
      this.http.delete(url).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  async removeDuplicates(item: OperatorCode): Promise<any> {
    const codes = await this.getItemsByOwner(item.operatorId);
    let alreadyFound = false;
    for (let index = 0; index < codes.length; index++) {
      const code = codes[index];
      if (code.integrationId === item.integrationId) {
        if (alreadyFound) {
          await this.delete(code);
        } else {
          alreadyFound = true;
        }
      }
    }
  }

  update(item: OperatorCode): Promise<any> {
    const url = this.apiBaseUrl + '/' + item.operatorId + '/codes' + (item.disabled ? '/disable' : '');

    const body = {
      id: item.id || null,
      disabled: item.disabled,
      disableReason: item.disabled && item.disableReason ? item.disableReason : null,
      integrationId: item.integrationId,
      regionalOfficeId: item.regionalOfficeId,
      username: item.username,
    };

    return new Promise((resolve, reject) => {
      this.removeDuplicates(item).then(result => {
        this.http.post(url, { ...body }, { responseType: 'text' }).subscribe(response => {
          resolve(response);
        }, reject);
      }, reject);
    });
  }

  public getItemsByOwner(ownerId: number): Promise<Array<OperatorCode>> {
    const url = this.apiBaseUrl + '/' + ownerId + '/codes';

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        this.items = response;

        this.items = this.items.map(item => {
          const code = new OperatorCode(item);
          code.operatorId = ownerId;
          return code;
        });

        this.onItemsChanged.next(this.items);
        resolve(this.items);
      }, reject);
    });
  }

  public getItemsByOperators(items: Array<Operator>): Promise<Array<OperatorCode>> {
    if (items.length > 0) {
      if (items[0].bankCodes && items[0].bankCodes.length > 0) {
        const codeList: OperatorCode[] = [];
        items.forEach(item => codeList.push(...item.bankCodes));
        return Promise.resolve(codeList);
      }
    }

    return new Promise((resolve, reject) => {
      const perItemPromises = items.map(item => this.getItemsByOwner(item.id));

      Promise.all(perItemPromises)
        .then(arrArrCodes => {
          const resultArray = new Array<OperatorCode>();
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
