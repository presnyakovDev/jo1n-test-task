/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { McAppConfig } from '@mc/core';

@Injectable()
export class ServiceProductsTemplateApiService {
  private apiUrl = 'api/service';

  constructor(private http: HttpClient, private config: McAppConfig) {
    this.apiUrl = config.get('api-server') + config.get('api-services-url');
  }

  public uploadTemplateFile(id: number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const apiUrl = this.apiUrl + '/' + id + '/templates';
    return new Promise((resolve, reject) => {
      this.http.put(apiUrl, formData).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  public getTemplate(id: number): Promise<string> {
    const apiUrl = this.apiUrl + '/' + id + '/templates';
    return new Promise((resolve, reject) => {
      this.http.get(apiUrl, { responseType: 'text' }).subscribe(resolve, reject);
    });
  }
}
