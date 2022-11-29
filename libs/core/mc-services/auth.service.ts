/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

import { OAuthService, OAuthEvent } from 'angular-oauth2-oidc';
import { BehaviorSubject, interval, merge } from 'rxjs';
import { filter, first, map, delay } from 'rxjs/operators';

import { McAppConfig } from './app-config.service';
import { McAuthInterceptor } from '../mc-auth.interceptor';
import { FuseSplashScreenService } from '../services/splash-screen.service';

@Injectable()
export class McAuthService {
  public static onUserChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  private static userInfo: any = [];
  private authDisabled: boolean;
  private hash: boolean;
  private config: McAppConfig;
  private featureRoles: string[] = [];
  private devUser: any;

  get onUserChanged(): BehaviorSubject<any> {
    return McAuthService.onUserChanged;
  }

  addFeatureRole(role: string) {
    if (!this.featureRoles.includes(role)) {
      this.featureRoles.push(role);
    }
    this.onUserChanged.next(McAuthService.userInfo);
  }

  setFeatureRole(role: string, on: boolean) {
    if (on && !this.userHasRole(role)) {
      this.addFeatureRole(role);
    }
    if (!on && this.userHasRole(role)) {
      this.removeFeatureRole(role);
    }
  }

  storeFeatureRole(role: string, on: boolean) {
    localStorage.setItem(role, on ? 'true' : '');
    this.setFeatureRole(role, on);
  }

  restoreFeatureRole(role: string, defaultValue: boolean) {
    const val = localStorage.getItem(role);
    if (val === null || val === undefined) {
      this.setFeatureRole(role, defaultValue);
      return;
    }
    const on = val ? true : false;
    this.setFeatureRole(role, on);
  }

  removeFeatureRole(role: string) {
    this.featureRoles = this.featureRoles.filter(item => item !== role);
    this.onUserChanged.next(McAuthService.userInfo);
  }

  userHasOneOfRoles(roles: string[]): boolean {
    let ok = false;
    roles.forEach(role => {
      if (this.userHasRole(role)) {
        ok = true;
      }
    });
    return ok;
  }

  userHasRole(role: string): boolean {
    if (this.featureRoles.includes(role)) {
      return true;
    }

    const authorities: any[] = McAuthService.userInfo ? McAuthService.userInfo['authorities'] : null;

    if (!authorities) {
      return false;
    }

    let result = false;
    authorities.forEach(item => {
      if (item['authority'] === role) {
        result = true;
      }
    });
    return result;
  }

  private getDevUser(username: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get('api/users?username=' + username).subscribe(response => {
        resolve(response);
      }, reject);
    });
  }

  public init(config: McAppConfig): Promise<any> {
    return new Promise((resolve, reject) => {
      if (window.location.hash.indexOf('&state=MS&') > 0) {
        sessionStorage.setItem('nonce', 'MS');
      }

      this.config = config;
      const oAuthService = this.oAuthService;

      this.authDisabled = config.get('auth-disabled') || window.location.pathname.includes('partner-onboarding');
      if (this.authDisabled) {
        this.splashScreenService.hide();
        let username = 'ivanov_test';
        if (window.location.hash && window.location.hash.length > 1) {
          username = window.location.hash.slice(1);
        }
        this.getDevUser(username)
          .then(userInfos => {
            const userInfo = userInfos.length ? userInfos[0] : { username: '-' };
            this.devUser = userInfo;
            McAuthService.userInfo = userInfo;
            this.onUserChanged.next(McAuthService.userInfo);
            resolve(true);
          })
          .catch(reason => reject(reason));
        return;
      }

      const localServer = window.location.protocol + '//' + window.location.host + '/';
      const authServer = config.get('auth-server') === '/' ? localServer : config.get('auth-server');

      const _oidc = false;
      const _loginUrl = authServer + config.get('auth-login-url');
      const _logoutUrl = authServer + config.get('auth-logout-url');
      const _clientId = config.get('auth-client-id');
      const _scope = config.get('auth-scopes');
      const _timeoutFactor = 0.75;
      const _requireHttps = !config.get('https-not-required');
      const _silentRefreshTimeout = 5.0;
      const _silentRefreshRedirectUri =
        window.location.origin + this.location.prepareExternalUrl('assets/silent-refresh.html');

      oAuthService.configure({
        oidc: _oidc,
        loginUrl: _loginUrl,
        logoutUrl: _logoutUrl,
        clientId: _clientId,
        scope: _scope,
        timeoutFactor: _timeoutFactor,
        requireHttps: _requireHttps,
        silentRefreshTimeout: _silentRefreshTimeout,
        silentRefreshRedirectUri: _silentRefreshRedirectUri,
      });

      // Use setStorage to use sessionStorage or another implementation of the TS-type Storage
      // instead of localStorage
      oAuthService.setStorage(sessionStorage);

      if (window.location.hash === '#reauthorize') {
        sessionStorage.setItem('expires_at', '1');
        sessionStorage.setItem('access_token', null);
      }

      // Set up automatic silent refresh for access token
      oAuthService.setupAutomaticSilentRefresh();

      // This method just tries to parse the token(s) within the url when
      // the auth-server redirects the user back to the web-app
      // It doesn't send the user the the login page
      oAuthService.tryLogin().catch(error => {});

      this.hash = window.location.hash && window.location.hash.length > 10;

      if (window.location.href.indexOf('e2eMode=true') > 0) {
        this.config.setEnv('e2e', true);
      }

      window.location.hash = '';

      if (this.isAuthorized || this.authDisabled) {
        this.afterLogin().then(() => resolve(true));
      } else {
        this.tryRefreshToken(resolve);
      }
    });
  }

  constructor(
    private splashScreenService: FuseSplashScreenService,
    private oAuthService: OAuthService,
    private location: Location,
    private http: HttpClient,
  ) {}

  private async afterLogin() {
    try {
      await this.getUserInfo();
    } catch (error) {
      this.login();
      return;
    }

    this.splashScreenService.hide();

    McAuthInterceptor.allowRetryAfterTokenRefresh();

    if (!this.hash) {
      // TODO remove workaround for angular-oauth2-oidc issue #205, then issue solved
      this.oAuthService
        .silentRefresh()
        .then(info => {})
        .catch(err => {});
    }
  }

  private tryRefreshToken(resolve) {
    this.authRefreshTokenWraparound().then(() => {
      if (this.isAuthorized) {
        this.hash = true;
        this.afterLogin().then(() => resolve());
      } else {
        this.login();
        resolve();
      }
    });
  }

  private authRefreshTokenWraparound(): Promise<any> {
    this.oAuthService.silentRefresh().catch(() => {});

    return new Promise((resolve, reject) => {
      merge(this.oAuthService.events.pipe(filter((e: OAuthEvent) => e.type === 'token_received')), interval(5000))
        .pipe(
          first(),
          map(() => this.oAuthService.getAccessToken()),
          delay(1000),
        )
        .subscribe(result => {
          resolve(result);
        });
    });
  }

  login() {
    if (this.authDisabled) {
      return;
    }

    // URL of the SPA to redirect the user to after login
    this.oAuthService.redirectUri = window.location.origin + window.location.pathname;

    this.oAuthService.initImplicitFlow();

    localStorage.removeItem('isPointSelected');
  }

  logout() {
    localStorage.removeItem('isPointSelected');
    sessionStorage.removeItem('access_token_stored_at');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('expires_at');
    sessionStorage.removeItem('nonce');

    if (this.authDisabled) {
      return;
    }

    this.oAuthService.logOut();
    location.href = this.oAuthService.logoutUrl;
  }

  get isAuthorized() {
    return this.oAuthService.hasValidAccessToken();
  }

  getAccessToken(): string {
    return this.oAuthService.getAccessToken();
  }

  public getUsername(): string {
    return McAuthService.userInfo ? McAuthService.userInfo.username : null;
  }

  public getUserFullname(): string {
    return McAuthService.userInfo ? McAuthService.userInfo.fullname : null;
  }

  public getOperatorId(): number {
    return McAuthService.userInfo && McAuthService.userInfo.operatorInfo
      ? McAuthService.userInfo.operatorInfo.operatorId
      : null;
  }

  public async getUserInfo(): Promise<any> {
    const url = this.config.get('auth-server') + this.config.get('auth-userinfo-url');

    const response = await this.http.get(url).toPromise();
    McAuthService.userInfo = response;
    this.onUserChanged.next(McAuthService.userInfo);
  }

  public refreshToken() {
    return new Promise((resolve, reject) => {
      this.tryRefreshToken(resolve);
    });
  }
}
