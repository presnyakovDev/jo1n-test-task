/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { OperatorForm } from '../mc-models/operator-form.model';
import { McAppConfig } from './app-config.service';

@Injectable()
export class OperatorFormApiService {
  private apiBaseUrl = 'api/operators'; // URL to web api

  constructor(private http: HttpClient, private config: McAppConfig) {
    this.apiBaseUrl = config.get('api-server') + config.get('api-operators-url');
  }

  update(item: OperatorForm): Promise<any> {
    const url = this.apiBaseUrl + '/' + item.operatorId + '/auth_anket';

    return new Promise((resolve, reject) => {
      this.http.post(url, { ...item }).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  public async getItems(operatorIds: Array<number>): Promise<Array<OperatorForm>> {
    const results = [];
    for (let i = 0; i < operatorIds.length; i++) {
      results.push(await this.getItem(operatorIds[i]));
    }
    return results;
  }

  public getItem(operatorId: number): Promise<OperatorForm> {
    const url = this.apiBaseUrl + '/' + operatorId + '/auth_anket';

    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        const item = new OperatorForm(response);
        item.operatorId = operatorId;
        resolve(item);
      }, reject);
    });
  }
}
