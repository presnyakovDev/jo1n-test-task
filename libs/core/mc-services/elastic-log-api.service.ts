/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { McAppConfig } from './app-config.service';
import { McAlertService } from './alert.service';
import { McAuthService } from './auth.service';
import { McUtils } from '../mc-utils';

@Injectable()
export class McElasticLogApiService {
  static username: string;
  static primaryRole: string;

  apiUrl: string;

  constructor(private alert: McAlertService, private config: McAppConfig, private http: HttpClient) {
    this.updateUrl();

    this.subscribeAlertServiceFieldsUpdater();
    this.subscribeAlertService();
    this.subscribeReasonDecode();
  }

  subscribeReasonDecode() {
    McUtils.onDecodeErrorsFromReason.subscribe(data => {
      this.registerError({
        title: 'Без названия',
        errors: data.errors || '' + data.reason,
      });
    });
  }

  subscribeAlertService() {
    this.alert.onAlert.subscribe(data => {
      if (data.noError) {
        return;
      }
      this.registerError(data);
    });
  }

  registerError(data: any) {
    let url = location.href;
    if (url.indexOf(':4200/') > 0) {
      url = url.slice(url.indexOf(':4200/') + 6);
    } else if (url.indexOf('/app/') > 0) {
      url = url.slice(url.indexOf('/app/') + 5);
    }

    const urlChunks = url.replace('?', '/').split('/');
    const module = data.module || urlChunks[0];
    let section = data.section || urlChunks[1];
    let part = data.part;
    if (!part && module === 'orders') {
      part = urlChunks[2];
    }

    // Credits workaround
    if (!part && ['credits'].includes(module) && McUtils.isNumeric(section)) {
      section = urlChunks[2];
    }

    // CRM workarounds START
    if (!part && ['partners'].includes(module) && section === 'edit') {
      part = urlChunks[3];
    }
    if (!part && ['companies', 'points', 'operators'].includes(module) && section === 'edit') {
      part = urlChunks[4];
    }
    if (
      !part &&
      ['partners', 'companies', 'points', 'operators'].includes(module) &&
      section.slice(0, 8) === 'pageSize'
    ) {
      section = 'list';
    }
    // CRM workarounds END

    if (!part) {
      part = 'unknown';
    }

    // Error
    const actionCode = data.actionCode || 'alert';
    const level = data.level || 'error';
    const content: string = data.errors ? data.errors.join('; ') : undefined;
    const context = {
      level: level,
      actionCode: actionCode,
      creditId: data.creditId,
      module: module,
      section: section,
      part: part,
      content: content && content.length > 500 ? content.slice(0, 500) : content,
      primaryRole: McElasticLogApiService.primaryRole,
      username: McElasticLogApiService.username,
      url: location.href,
    };
    this.register(null, data.title, context);
  }

  subscribeAlertServiceFieldsUpdater() {
    const primaryRoles = [
      'ROLE_MC_ADMIN',
      'ROLE_MC_SUPPORT',
      'ROLE_MC_MANAGER_BACKOFFICE',
      'ROLE_MC_MANAGER_TERRITORY',
      'ROLE_MC_MANAGER_LOGISTICS',
      'ROLE_MC_OPER',
      'ROLE_MC_COURIER',
      'ROLE_MC_ONLINE_SHORT',
      'ROLE_MC_ONLINE',
    ];
    McAuthService.onUserChanged.subscribe(userinfo => {
      McElasticLogApiService.username = userinfo.username;
      const userRoles: string[] = userinfo.authorities ? userinfo.authorities.map(item => item.authority) : [];
      let roleFound: string;
      primaryRoles.forEach(role => {
        if (!roleFound && userRoles.includes(role)) {
          roleFound = role;
        }
      });
      McElasticLogApiService.primaryRole = roleFound;
    });
  }

  private updateUrl() {
    this.apiUrl = this.config.get('api-server') + this.config.get('api-elastic-logger-url');
  }

  public register(id: string, message: string, context: any): Promise<any> {
    if (!this.apiUrl) {
      this.updateUrl();
    }
    const url = this.apiUrl;
    const requestBody = { id: id, message: message, context: context };
    return this.http.post(url, requestBody).toPromise();
  }

  public registerAction(
    id: string,
    actionCode: string,
    actionCaption: string,
    duration: number,
    creditId?: number,
    message?: string
  ): Promise<any> {
    if (sessionStorage.getItem('LogAction' + id)) {
      return;
    }

    const context = {
      duration: duration,
      actionCode: actionCode,
      action: actionCaption,
      creditId: creditId,
    };
    return this.register(id, message ? message : actionCaption, context).then(result => {
      sessionStorage.setItem('LogAction' + id, 'done');
    });
  }

  public registerClaim(data: { creditId: number; title: string; module?: string; section?: string }) {
    data['actionCode'] = 'claim';
    data['part'] = 'unknown';
    this.registerError(data);
  }
}
