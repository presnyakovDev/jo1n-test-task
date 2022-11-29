/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { McAppConfig } from './app-config.service';

@Injectable()
export class McPasswordApiService {
  constructor(private config: McAppConfig, private http: HttpClient) {}

  public change(newPassword: string, oldPassword: string): Promise<any> {
    const env = this.config.getEnv('env');
    const url = this.config.get(env === 'dev' ? 'api-server' : 'auth-server') + this.config.get('auth-password-url');
    const requestBody = { newPassword: newPassword, oldPassword: oldPassword };

    return new Promise((resolve, reject) => {
      this.http.put(url, requestBody, { responseType: 'text' }).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }
}
