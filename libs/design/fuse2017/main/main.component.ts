/* eslint-disable */
import {
  Component,
  ElementRef,
  Input,
  HostBinding,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { OAuthService } from 'angular-oauth2-oidc';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';

import { McBrowserService } from '../../../core/mc-services/browser.service';
import { McAppInfoService, AppInfoNotificationBlock } from '../../../core/mc-services/app-info.service';
import { McShowAlertDialogComponent } from '../../../core/mc-components/show-alert/show-alert.component';
import { FuseConfigService } from '../../../core/services/config.service';
import { McAlertService } from '../../../core/mc-services/alert.service';
import { McSvgIcons } from '../../../core/mc-svg-icons';
import { McUtils } from '../../../core/mc-utils';
import { McAppConfig } from '../../../core/mc-services/app-config.service';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'fuse-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [McBrowserService],
})
export class FuseMainComponent implements OnInit, OnDestroy {
  onSettingsChanged: Subscription;
  fuseSettings: any;
  @HostBinding('class.boxed') boxed;
  @Input() shopPointCaption = false;
  @Input() spa: string;
  @Input() fuseSettingsCustom: any;

  newsShowed = false;

  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private ngSelectConfig: NgSelectConfig,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private appInfoService: McAppInfoService,
    private alertService: McAlertService,
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    private fuseConfig: FuseConfigService,
    private platform: Platform,
    private dialog: MatDialog,
    private auth: OAuthService,
    private browser: McBrowserService,
    @Inject(DOCUMENT) private document: any,
    private appConfig: McAppConfig
  ) {
    McSvgIcons.register(this.iconRegistry, this.sanitizer);

    ngSelectConfig.notFoundText = 'Варианты не найдены';

    this.alertService.onAlert.subscribe(data => {
      const err = data.content;
      if (err instanceof HttpErrorResponse) {
        if (err.status === 403 || err.status === 401 || err.status === 0) {
          return;
        }
      }

      const dialogRef = this.dialog.open(McShowAlertDialogComponent, {
        panelClass: 'show-alert-dialog',
        data: data,
      });

      if (data.relogin) {
        this.blockUI.reset();
        dialogRef.afterClosed().subscribe(response => {
          // URL of the SPA to redirect the operator to after login
          this.auth.redirectUri = window.location.origin + window.location.pathname;
          this.auth.initImplicitFlow();
        });
      }
    });
    this.onSettingsChanged = this.fuseConfig.onSettingsChanged.subscribe(newSettings => {
      this.fuseSettings = newSettings;
      if (this.fuseSettingsCustom) {
        this.fuseSettings = Object.assign({}, this.fuseSettings, this.fuseSettingsCustom);
      }
      this.boxed = this.fuseSettings.layout.mode === 'boxed';
    });

    if (this.platform.ANDROID || this.platform.IOS) {
      this.document.body.className += ' is-mobile';
    }
  }

  ngOnInit() {
    if (!this.browser.isBrowserCompatible()) {
      const browserInfo = this.browser.getBrowserInfo();
      const yourBrowser = McUtils.ucf(browserInfo.name) + ' версия ' + browserInfo.fullVersion;
      this.appInfoService.addNotificationItem(
        new AppInfoNotificationBlock({
          code: 'UNSUPPORTED_BROWSER',
          beforeLink: 'Несовместимый браузер! ' + yourBrowser + '. Пожалуйста, ',
          link: 'скачайте свежую версию Google Chrome',
          afterLink: '.',
          callback: () => {
            window.location.href = 'https://www.google.ru/intl/ru_ALL/chrome/';
          },
        })
      );
    }

    this.appConfig.autoUpdateInit(this.dialog);
  }

  ngOnDestroy() {
    this.onSettingsChanged.unsubscribe();
  }

  addClass(className: string) {
    this._renderer.addClass(this._elementRef.nativeElement, className);
  }

  removeClass(className: string) {
    this._renderer.removeClass(this._elementRef.nativeElement, className);
  }
}
