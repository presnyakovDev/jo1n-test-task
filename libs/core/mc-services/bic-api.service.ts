/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { McAppConfig } from './app-config.service';
import { McUtils } from '../mc-utils';

@Injectable()
export class McBicApiService {
  private apiUrl = 'api/suggestions-bank';
  // private apiUrlReserve = 'https://bik-info.ru/api.html?type=json&bik=';
  private recs: any;

  constructor(private http: HttpClient, private config: McAppConfig) {
    this.apiUrl = config.get('dadata-suggestions-url') + '/4_1/rs/suggest/bank';
    if (this.apiUrl.slice(0, 4) !== 'http') {
      this.apiUrl = config.get('api-server') + this.apiUrl;
    }
  }

  public findByBic(bicUnsafe: string): Promise<any> {
    const bic = McUtils.removeNonDigits(bicUnsafe);
    if (bic.length !== 9) {
      return Promise.resolve([]);
    }

    const requestBody = { query: bic, status: ['ACTIVE', 'LIQUIDATING', 'LIQUIDATED'] };
    const requestHeaders = new HttpHeaders({ Authorization: `Token 47b0b650a99b8a606e4edf793d9709028a4ec0f6` });

    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl, requestBody, { headers: requestHeaders }).subscribe((response: any) => {
        this.recs = response.suggestions;

        this.recs = this.recs.filter(item => item.data.bic === bic);

        /*
                    if (this.recs.length === 0){
                        this.http.get(this.apiUrlReserve + bic).subscribe((response2: any) => {
                            if (response2.error){
                                resolve([]);
                            }else{
                                const data = {
                                    correspondent_account: response2.ks,
                                    name : { payment: response2.namemini }
                                };
                                this.recs = [{data: data}];
                                resolve(this.recs);
                            }
                        });
                    }else{
                    */
        resolve(this.recs);
        // }
      }, reject);
    });
  }
}
