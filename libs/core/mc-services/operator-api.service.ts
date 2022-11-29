/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Analytics, AnalyticsEvent } from '../analytics';
import { McApiUtils } from '../mc-api-utils';
import { McAppConfig } from './app-config.service';
import { Operator } from '../mc-models/operator.model';
import { OperatorForm } from '../mc-models/operator-form.model';
import { OperatorAgreementsForm } from '../mc-models/operator-agreements-form.model';
import { Point } from '../mc-models/point.model';
import { Page } from '../page.model';
import { Attach } from '../mc-models/attach.model';
import { McAuthService } from './auth.service';
import { McHttpWithCacheService } from './http-with-cache.service';

@Injectable()
export class OperatorApiService {
  public static onOperatorAccountChanged: BehaviorSubject<Operator> = new BehaviorSubject(null);
  private static mapOperatorSelf = new Map<String, Operator>();
  private static usernameLoading: string;

  private apiUrl = 'api/operators-self'; // URL to web api
  private pointsApiUrl = 'api/points';
  onPointsChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(
    private http: HttpClient,
    private auth: McAuthService,
    private config: McAppConfig,
    private httpCached: McHttpWithCacheService
  ) {
    this.apiUrl = config.get('api-server') + config.get('api-operators-self-url');
    this.pointsApiUrl = config.get('api-server') + config.get('api-points-url');

    this.auth.onUserChanged.subscribe(userInfo => {
      if (userInfo.username && this.auth.userHasRole('ROLE_MC_OPER')) {
        if (OperatorApiService.usernameLoading !== userInfo.username) {
          OperatorApiService.usernameLoading = userInfo.username;
          this.getItem(userInfo).then(operator => {
            OperatorApiService.onOperatorAccountChanged.next(operator);
          });
        }
      }
    });
  }

  private cacheKey(code: string): string {
    return 'operator.' + code;
  }

  public operatorAccountChanged() {
    OperatorApiService.mapOperatorSelf.clear();
    this.getItem().then(operator => {
      OperatorApiService.onOperatorAccountChanged.next(operator);
    });
  }

  public getAttaches(): Observable<Attach[]> {
    return this.http.get<Attach[]>(`${this.apiUrl}/attaches`);
  }

  public updateAttach(attachmentTypeId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('attachmentTypeId', `${attachmentTypeId}`);
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/attaches`, formData);
  }

  public getAttach(attach: Attach): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/attaches/${attach.id}`, { responseType: 'blob' });
  }

  public deleteAttach(attach: Attach): Promise<any> {
    const url = this.apiUrl + '/attaches/' + attach.id;
    return new Promise((resolve, reject) => {
      this.http.delete(url).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  public getPartnerList(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.getAllowedPointList()
        .then(points => {
          const partners = [];
          const map = new Map<number, boolean>();
          points.forEach(point => {
            const id = point.partnerId;
            if (!map.get(id)) {
              map.set(id, true);
              partners.push({ id: id, caption: point.partnerCaption });
            }
          });
          resolve(partners);
        })
        .catch(reason => reject(reason));
    });
  }

  public getAllowedPointList(): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      const page = new Page();
      page.pageSize = 100;
      this.getAllPointsFromPage(page)
        .then(points => {
          resolve(points);
        })
        .catch(reason => reject(reason));
    });
  }

  public getAllPointsFromPage(fromPage: Page): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      this.getPointsOnPage(fromPage)
        .then(items => {
          if (items.length < fromPage.pageSize) {
            resolve(items);
          } else {
            fromPage.pageNumber++;
            this.getAllPointsFromPage(fromPage)
              .then(items2 => {
                items.push(...items2);
                resolve(items);
              })
              .catch(reason => reject(reason));
          }
        })
        .catch(reason => reject(reason));
    });
  }

  public getPointsOnPage(page: Page): Promise<Array<Point>> {
    this.onPointsChanged.next(undefined);

    return new Promise((resolve, reject) => {
      const companyId = page.filters.get('companyId');
      let params = McApiUtils.getHttpParamsForPage(page);
      if (page.searchText) {
        params = params.set('query', page.searchText);
      }
      if (companyId) {
        params = params.set('companyId', companyId);
      }
      const url = this.pointsApiUrl + '?' + params.toString();

      this.http.get(url).subscribe((response: any) => {
        const points = response.map(item => new Point(item));
        this.onPointsChanged.next(points);
        resolve(points);
      }, reject);
    });
  }

  public validateEmailSendCode(): Promise<ValidationResponse> {
    const url = this.apiUrl + '/sendEmail';
    return new Promise((resolve, reject) => {
      this.http.post(url, {}).subscribe(response => {
        resolve(new ValidationResponse(response));
      }, reject);
    });
  }

  public validateEmailConfirm(code: string, token: string): Promise<any> {
    const url = this.apiUrl + '/confirmEmail';
    const requestBody = { code: code, token: token };
    return new Promise((resolve, reject) => {
      this.http.post(url, requestBody, { responseType: 'text' }).subscribe(response => {
        this.operatorAccountChanged();
        Analytics.registerEvent(
          new AnalyticsEvent({
            category: 'profile:emailValidation',
            action: 'success',
          })
        );
        resolve(response);
      }, reject);
    });
  }

  public validatePhoneSendCode(): Promise<ValidationResponse> {
    const url = this.apiUrl + '/sendSms';
    return new Promise((resolve, reject) => {
      this.http.post(url, {}).subscribe(response => {
        resolve(new ValidationResponse(response));
      }, reject);
    });
  }

  public validatePhoneConfirm(code: string, token: string): Promise<any> {
    const url = this.apiUrl + '/confirmPhone';
    const requestBody = { code: code, token: token };
    return new Promise((resolve, reject) => {
      this.http.post(url, requestBody, { responseType: 'text' }).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  public selectPoint(pointId: number): Promise<any> {
    if (!pointId) {
      return Promise.reject('Не указан код торговой точки!');
    }

    const url = this.apiUrl + '/point';
    const requestBody = { pointId: pointId };

    return new Promise((resolve, reject) => {
      this.http.put(url, requestBody, { responseType: 'text' }).subscribe(response => {
        this.operatorAccountChanged();
        resolve(response);
      }, reject);
    });
  }

  public getItem(userInfo: any = null): Promise<Operator> {
    const userInfoHash = userInfo ? userInfo.username : null;
    if (userInfoHash) {
      const cachedValue = OperatorApiService.mapOperatorSelf.get(userInfoHash);
      if (cachedValue) {
        return Promise.resolve(cachedValue);
      }
    }
    const url = this.apiUrl;
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        const oper = new Operator(response);
        if (userInfoHash) {
          OperatorApiService.mapOperatorSelf.set(userInfoHash, oper);
        }
        resolve(oper);
      }, reject);
    });
  }

  public async getAnket(): Promise<OperatorForm> {
    const url = this.apiUrl + '/authAnket';
    const response = await this.httpCached.get(this.cacheKey('authAnket'), 15000, url);
    return new OperatorForm(response);
  }

  public async saveAnket(item: OperatorForm): Promise<any> {
    const url = this.apiUrl + '/authAnket';
    this.httpCached.dropCache(this.cacheKey('authAnket'));
    const response = await this.http.post(url, { ...item }).toPromise();
    this.operatorAccountChanged();
    return response;
  }

  public getAgreements(): Promise<OperatorAgreementsForm> {
    const url = this.apiUrl + '/agreements';
    return new Promise((resolve, reject) => {
      this.http.get(url).subscribe((response: any) => {
        resolve(new OperatorAgreementsForm(response));
      }, reject);
    });
  }

  public saveAgreements(item: OperatorAgreementsForm): Promise<any> {
    const url = this.apiUrl + '/acceptAgreements';

    return new Promise((resolve, reject) => {
      this.http.post(url, item).subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }

  public deactivateAccount(userId: number): Promise<any> {
    const url = this.apiUrl + '/' + userId + '/deactivate';

    return new Promise((resolve, reject) => {
      this.http.post(url, {}).subscribe((response: any) => {
        resolve(response);
      }, reject);
    });
  }
}

export class ValidationResponse {
  status: string;
  token: string;
  verificationMethod: string;

  constructor(item) {
    this.status = item.status;
    this.token = item.token;
    this.verificationMethod = item.verificationMethod;
  }
}
