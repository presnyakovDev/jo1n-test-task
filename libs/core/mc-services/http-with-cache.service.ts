/* eslint-disable */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { share } from 'rxjs/operators';
import { Observable } from 'rxjs';

type McHttpCacheEntityRecords = Map<string, McHttpCacheRecord>;

@Injectable()
export class McHttpWithCacheService {
  private cache = new Map<string, McHttpCacheEntityRecords>();

  constructor(private http: HttpClient) {}

  getCacheRecord(entityCode: string, url: string): McHttpCacheRecord {
    if (!this.cache.get(entityCode)) {
      this.cache.set(entityCode, new Map<string, McHttpCacheRecord>());
    }
    const entityCache = this.cache.get(entityCode);
    if (!entityCache.get(url)) {
      entityCache.set(url, new McHttpCacheRecord());
    }
    return entityCache.get(url);
  }

  dropCache(entityCode: string) {
    this.cache.set(entityCode, null);
  }

  post(entityCode: string, ttlMs: number, url: string, body: any, options?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const cached = this.getCacheRecord(entityCode, url);

      if (cached.requestTimestamp && cached.requestTimestamp + ttlMs > Date.now()) {
        resolve(cached.response);
      } else {
        if (!cached.currentRequest) {
          cached.currentRequest = this.http.post(url, body, options).pipe(share());
          cached.currentRequest.subscribe(
            response => {
              cached.currentRequest = null;
              cached.requestTimestamp = Date.now();
              cached.response = response;
            },
            reason => {
              cached.currentRequest = null;
              cached.requestTimestamp = null;
              cached.response = null;
            }
          );
        }
        cached.currentRequest.subscribe(resolve, reject);
      }
    });
  }

  get(entityCode: string, ttlMs: number, url: string, options?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const cached = this.getCacheRecord(entityCode, url);

      if (cached.requestTimestamp && cached.requestTimestamp + ttlMs > Date.now()) {
        resolve(cached.response);
      } else {
        if (!cached.currentRequest) {
          cached.currentRequest = this.http.get(url, options).pipe(share());
          cached.currentRequest.subscribe(
            response => {
              cached.currentRequest = null;
              cached.requestTimestamp = Date.now();
              cached.response = response;
            },
            reason => {
              cached.currentRequest = null;
              cached.requestTimestamp = null;
              cached.response = null;
            }
          );
        }
        cached.currentRequest.subscribe(resolve, reject);
      }
    });
  }
}

export class McHttpCacheRecord {
  requestTimestamp: number;
  currentRequest: Observable<any>;
  response: any;
}
