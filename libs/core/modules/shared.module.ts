/* eslint-disable */
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgxMaskModule } from 'ngx-mask';

import { BlockUIModule } from 'ng-block-ui';

import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TextMaskModule } from 'angular2-text-mask';
import { Ng2PicaModule } from 'ng2-pica';

import {
  FuseMdSidenavHelperDirective,
  FuseMdSidenavTogglerDirective,
} from '../directives/md-sidenav-helper/md-sidenav-helper.directive';
import { FusePipesModule } from '../pipes/pipes.module';
import { FuseConfirmDialogModule } from '../mc-components/confirm-dialog/confirm-dialog.module';
import { FuseMatchMedia } from '../services/match-media.service';
import { FuseMdSidenavHelperService } from '../directives/md-sidenav-helper/md-sidenav-helper.service';
import { FusePerfectScrollbarModule } from '../directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.module';
import { FuseIfOnDomDirective } from '../directives/fuse-if-on-dom/fuse-if-on-dom.directive';

import { McShowAlertDialogComponent } from '../mc-components/show-alert/show-alert.component';
import { McShowInfoDialogModule } from '../mc-components/show-info/show-info.module';
import { McChangePasswordFormComponent } from '../mc-components/change-password-form/change-password-form.component';
import { McAboutSpaDialogComponent } from '../mc-components/about-spa-dialog/about-spa-dialog.component';
import { McPartnerSelectDialogComponent } from '../mc-components/partner-select/partner-select.component';
import { McCompanySelectDialogComponent } from '../mc-components/company-select/company-select.component';
import { NgSelectFormFieldControlModule } from '../directives/ng-select-mat/ng-select-mat.module';

import { McAppInfoService } from '../mc-services/app-info.service';
import { McAlertService } from '../mc-services/alert.service';
import { McNotificationService } from '../mc-services/notification.service';
import { McBrowserService } from '../mc-services/browser.service';
import { McAuthService } from '../mc-services/auth.service';

import { McBicApiService } from '../mc-services/bic-api.service';
import { McPaginatorIntl } from '../mc-services/mc-paginator-intl.service';
import { McPasswordApiService } from '../mc-services/password-api.service';

import { McElasticLogApiService } from '../mc-services/elastic-log-api.service';
import { McHttpWithCacheService } from '../mc-services/http-with-cache.service';
import { OperatorApiService } from '../mc-services/operator-api.service';
import { TranslateModule } from '@ngx-translate/core';
import { McTranslateService } from '../mc-services/mc-translate.service';
import { CompaniesApiService } from '../mc-services/companies-api.service';
import { PartnersApiService } from '../mc-services/partners-api.service';
import { PointsApiService } from '../mc-services/points-api.service';
import { BackofficeConfigService } from '../mc-services/backoffice-config.service';

@NgModule({
  declarations: [
    FuseMdSidenavHelperDirective,
    FuseMdSidenavTogglerDirective,
    FuseIfOnDomDirective,
    McShowAlertDialogComponent,
    McChangePasswordFormComponent,
    McPartnerSelectDialogComponent,
    McCompanySelectDialogComponent,
    McAboutSpaDialogComponent,
  ],
  imports: [
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    FusePipesModule,
    ReactiveFormsModule,
    TextMaskModule,
    BlockUIModule.forRoot({}),
    NgxMatSelectSearchModule,
    FuseConfirmDialogModule,
    McShowInfoDialogModule,
    FusePerfectScrollbarModule,
    TranslateModule,
    NgSelectFormFieldControlModule,
    Ng2PicaModule,
    NgxMaskModule,
  ],
  exports: [
    FlexLayoutModule,
    MaterialModule,
    CommonModule,
    FormsModule,
    BlockUIModule,
    FuseMdSidenavHelperDirective,
    FuseMdSidenavTogglerDirective,
    FusePipesModule,
    ReactiveFormsModule,
    TextMaskModule,
    FuseIfOnDomDirective,
    McShowAlertDialogComponent,
    McShowInfoDialogModule,
    McChangePasswordFormComponent,
    McPartnerSelectDialogComponent,
    McCompanySelectDialogComponent,
    NgSelectFormFieldControlModule,
    FuseConfirmDialogModule,
    FusePerfectScrollbarModule,
    TranslateModule,
    NgxMaskModule,
  ],
  providers: [
    FuseMatchMedia,
    FuseMdSidenavHelperService,
    BackofficeConfigService,
    McAuthService,
    McAlertService,
    McNotificationService,
    McAppInfoService,
    McBicApiService,
    McPaginatorIntl,
    McPasswordApiService,
    McBrowserService,
    McElasticLogApiService,
    McHttpWithCacheService,
    OperatorApiService,
    McTranslateService,
    PartnersApiService,
    CompaniesApiService,
    PointsApiService,
  ],
})
export class SharedModule {}
