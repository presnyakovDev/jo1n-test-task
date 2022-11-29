/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { McAppConfig, KladrAddress } from '@mc/core';

import { EgrulRecord } from './egrul-record.model';

@Injectable({
  providedIn: 'root',
})
export class EgrulApiService {
  private recs: any;
  private kladrId;

  get apiUrl(): string {
    let apiUrl = this.config.get('dadata-suggestions-url');

    if (apiUrl.slice(0, 4) !== 'http') {
      apiUrl = this.config.get('api-server') + apiUrl;
    }

    return apiUrl;
  }

  constructor(private http: HttpClient, private config: McAppConfig) {}

  private getAddressByIP(): Promise<any> {
    const apiUrl = this.apiUrl + '/4_1/rs/iplocate/address';
    const requestHeaders = new HttpHeaders({ Authorization: `Token 47b0b650a99b8a606e4edf793d9709028a4ec0f6` });

    return this.http.get(apiUrl, { headers: requestHeaders }).toPromise();
  }

  public async findByQuery(query: string): Promise<Array<EgrulRecord>> {
    if (!this.kladrId) {
      try {
        const result = await this.getAddressByIP();
        this.kladrId = result.location.data.kladr_id;
      } catch {
        this.kladrId = null;
      }
    }

    const apiUrl = this.apiUrl + '/4_1/rs/suggest/party';
    const requestBody = { query: query, locations_boost: [{ kladr_id: this.kladrId }] };
    const requestHeaders = new HttpHeaders({ Authorization: `Token 47b0b650a99b8a606e4edf793d9709028a4ec0f6` });
    const response = await this.http.post<any>(apiUrl, requestBody, { headers: requestHeaders }).toPromise();

    this.recs = response.suggestions;
    this.recs = this.recs.map(item => {
      const data = item.data;
      const person = data.opf.short === 'ИП';

      let ogrn_date = null;
      if (data.ogrn_date) {
        const ogrnDate = new Date();
        ogrnDate.setTime(data.ogrn_date);
        const pipe = new DatePipe('en');
        ogrn_date = pipe.transform(ogrnDate, 'yyyy-MM-dd');
      }

      const directorFIO = data.management ? data.management.name : null;
      const directorPos = data.management ? data.management.post : null;

      return new EgrulRecord({
        inn: data.inn,
        kpp: person ? '' : data.kpp,
        fullName: data.name ? data.name.full_with_opf : item.value,
        directorFIO: person && data.name ? data.name.full : directorFIO,
        directorPos: person ? 'Индивидуальный предприниматель' : directorPos,
        opf: data.opf.full,
        shortName: data.name ? data.name.short_with_opf : item.value,
        okato: data.address && data.address.data ? data.address.data.okato : '',
        ogrn: data.ogrn,
        ogrnDate: ogrn_date,
        address: person || !data.address ? null : data.address.value,
        addressEgrul: data.address ? data.address.value : '',
        kladr: data.address ? KladrAddress.convertDadataToKladr(data.address) : null,
        okved: data.okved,
      });
    });

    return this.recs;
  }

  public findByInn(inn: string): Promise<Array<EgrulRecord>> {
    if (inn.length !== 10 && inn.length !== 12) {
      return Promise.resolve([]);
    }

    return this.findByQuery(inn);
  }
}
