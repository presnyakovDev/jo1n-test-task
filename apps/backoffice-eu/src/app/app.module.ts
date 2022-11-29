/* eslint-disable */
// System items
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';
import {OAuthModule} from 'angular-oauth2-oidc';
import {BlockUIModule} from 'ng-block-ui';
import {NgxMaskModule} from 'ngx-mask';

import {
  FuseConfigService,
  FuseNavigationService,
  FuseSplashScreenService,
  McApiIntercepter,
  McAppConfig,
  McAuthInterceptor,
  McAuthService,
  SharedModule
} from '@mc/core';

import {AppComponent} from './app.component';
import {McServiceProductsModule} from '@mc/services/service-products';
import {Fuse2017Module} from '@mc/design/fuse2017';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {Mc2021Module} from '@mc/design/mc2021';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/service-products/items',
    pathMatch: 'full',
  },
];

export function init_app(config: McAppConfig) {
  return () => config.load();
}

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, document.baseURI + 'assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    OAuthModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BlockUIModule.forRoot({}),
    SharedModule,
    Fuse2017Module,
    Mc2021Module,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgxMaskModule.forRoot(),
    McServiceProductsModule,
  ],
  providers: [
    McAppConfig,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [McAppConfig], multi: true },
    McAuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: McAuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: McApiIntercepter,
      multi: true,
    },
    FuseSplashScreenService,
    FuseConfigService,
    FuseNavigationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
