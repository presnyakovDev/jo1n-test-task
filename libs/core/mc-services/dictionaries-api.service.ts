/* eslint-disable */
import {Injectable} from '@angular/core';
import {NgOption} from '@ng-select/ng-select';

import {McAppConfig} from './app-config.service';
import {McHttpWithCacheService} from './http-with-cache.service';

export type DictType =
  | 'country'
  | 'sex'
  | 'goods'
  | 'brand'
  | 'market'
  | 'martial_status'
  | 'education'
  | 'contact_type'
  | 'sib'
  | 'employment_type'
  | 'work_title'
  | 'work_direction'
  | 'work_branch'
  | 'work_activity'
  | 'housing'
  | 'decline_comment'
  | 'car_source'
  | 'reason_for_cancel'
  | 'docname'
  | 'attachment_type'
  | 'service_company'
  | 'service_product_type';

@Injectable()
export class DictionariesApiService {
  private static CACHE_TTL_MS = 600000;
  private apiBaseUrl = 'api/dictionary-'; // URL to web api

  constructor(private httpCached: McHttpWithCacheService, private config: McAppConfig) {
    this.apiBaseUrl = config.get('api-server') + config.get('api-dictionaries-url');
  }

  public getDictionary(id: DictType): Promise<Array<any>> {
    const key = 'jo1n-dict-' + id;
    const raw = sessionStorage.getItem(key);
    if (!raw) {
      return Promise.reject();
    }
    const result = JSON.parse(raw);
    return Promise.resolve(result);
  }

  public async getDictionaryAsNgOptions(id: DictType): Promise<Array<NgOption>> {
    const response = await this.getDictionary(id);
    console.log( id, response );
    return response.map(item => {
      return {
        value: item.id,
        label: item.caption,
        caption: item.caption,
        code: item.code,
        needAdditional: item.needAdditional,
      };
    });
  }
}
