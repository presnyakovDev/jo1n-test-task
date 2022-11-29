/* eslint-disable */
import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { McAlertService } from './mc-services/alert.service';
import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { Observable, Subject, merge, interval, throwError, EMPTY } from 'rxjs';
import { switchMap, catchError, tap, first, map, delay, filter } from 'rxjs/operators';

import { McTranslateService } from './mc-services/mc-translate.service';
import { McAppConfig } from '@mc/core/mc-services/app-config.service';

@Injectable()
export class McAuthInterceptor implements HttpInterceptor {
  private static authFailed = false;

  private static mcServerUrl = '-';
  private static tryTokenRefresh = false;

  private auth: OAuthService;
  private alert: McAlertService;

  private refreshTokenInProgress = false;
  private tokenRefreshedSource = new Subject();
  private tokenRefreshed$ = this.tokenRefreshedSource.asObservable();

  private alreadyAlerted = false;

  public static isAuthFailed(): boolean {
    return this.authFailed;
  }

  public static allowRetryAfterTokenRefresh() {
    this.tryTokenRefresh = true;
  }

  public static setMcServerUrl(url: string) {
    McAuthInterceptor.mcServerUrl = url;
  }

  constructor(private inj: Injector, private translateService: McTranslateService, private config: McAppConfig) {
    // this.onBoardingRequests = [config.get('api-onboarding-companies')];
    // console.log( config, config['api-access-groups-url'], config.get('api-access-groups-url') );
    // this.apiUrlCompanies = `${config.get('api-server')}${config.get('api-onboarding-companies')}`;
  }

  isMcRequest(url: string): boolean {
    if (url.indexOf('suggestions/api') > 0) {
      return false;
    }
    if (
      McAuthInterceptor.mcServerUrl &&
      url.substr(0, McAuthInterceptor.mcServerUrl.length) === McAuthInterceptor.mcServerUrl
    ) {
      return true;
    }
    if (url.startsWith('https://preprod.test.moneycare.su/') || url.startsWith('https://mc.moneycare.su/')) {
      return true;
    }
    return false;
  }

  isNoAuthRequest(url: string): boolean {
    return (
      url.includes('backoffice/api/external/companies') ||
      url.includes('backoffice/api/external/partnerRequests') ||
      url.includes('frontEvents')
    );
  }

  private authRefreshTokenWraparound(): Observable<any> {
    this.auth.silentRefresh().catch(() => {});

    return merge(this.auth.events.pipe(filter((e: OAuthEvent) => e.type === 'token_received')), interval(5000)).pipe(
      first(),
      map(() => this.auth.getAccessToken()),
      delay(1000),
    );
  }

  private refreshToken(): Observable<any> {
    if (this.refreshTokenInProgress) {
      return new Observable(observer => {
        this.tokenRefreshed$.subscribe(() => {
          observer.next(null);
          observer.complete();
        });
      });
    } else {
      this.refreshTokenInProgress = true;

      return this.authRefreshTokenWraparound().pipe(
        tap(() => {
          this.refreshTokenInProgress = false;
          this.tokenRefreshedSource.next(null);
        }),
      );
    }
  }

  addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    let authRequest = request;
    if (this.isMcRequest(request.url) && !this.isNoAuthRequest(request.url)) {
      authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.getAccessToken()}`,
        },
      });
    }
    return authRequest;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.auth) {
      this.auth = this.inj.get(OAuthService);
    }
    if (!this.alert) {
      this.alert = this.inj.get(McAlertService);
    }

    request = this.addAuthHeader(request);

    if (McAuthInterceptor.tryTokenRefresh) {
      // Handle response
      return next.handle(request).pipe(
        catchError(error => {
          if (error.status === 401) {
            return this.refreshToken().pipe(
              switchMap(() => {
                request = this.addAuthHeader(request);
                return next.handle(request);
              }),
              catchError(() => {
                if (!this.alreadyAlerted) {
                  McAuthInterceptor.authFailed = true;
                  const alertData = {
                    title: this.translateService.instant('COMMON.ERRORS.NEED_AUTH.TITLE'),
                    content: this.translateService.instant('COMMON.ERRORS.NEED_AUTH.MESSAGE'),
                    relogin: true,
                  };
                  this.alert.alert(alertData);
                  this.alreadyAlerted = true;
                }
                return EMPTY;
              }),
            );
          }
          return throwError(error);
        }),
      );
    }

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse && this.isMcRequest(request.url)) {
            if (err.status === 401) {
              // redirect to the login route
              // or show a modal

              const alertData = {
                title: this.translateService.instant('COMMON.ERRORS.NEED_AUTH.TITLE'),
                content: this.translateService.instant('COMMON.ERRORS.NEED_AUTH.MESSAGE'),
                relogin: true,
              };
              this.alert.alert(alertData);
            }
          }
        },
      ),
    );
  }
}
