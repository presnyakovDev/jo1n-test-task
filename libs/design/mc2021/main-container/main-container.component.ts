/* eslint-disable */
import { HttpErrorResponse } from '@angular/common/http';
import { Router, NavigationEnd, NavigationError, NavigationCancel, NavigationStart } from '@angular/router';
import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';

import {
  AppInfoNotificationBlock,
  AppMode,
  McAlertService,
  McAppConfig,
  McAppInfoService,
  McBrowserService,
  McTranslateService,
  McUtils,
} from '@mc/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';
import { map, filter, delay } from 'rxjs/operators';
import { McSvgIcons } from '@mc/core/mc-svg-icons';
import { Mc2021ShowAlertDialogComponent } from '../show-alert/show-alert.component';

@Component({
  selector: 'mc-2021-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss'],
})
export class Mc2021MainContainerComponent implements OnInit, OnDestroy {
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isLaptop = event.target.innerWidth >= 1024 ? true : false;
  }

  @BlockUI() blockUI: NgBlockUI;

  @Input()
  public showMenuCategories = false;

  @Input()
  public registration = false;

  @Input()
  public onboarding = false;

  @Input()
  public shopPointCaption: boolean;

  @Input()
  public logo: any;

  @Input()
  public visibleSelectLang = false;

  @Input()
  public spa: string;

  @Input()
  public online: boolean;

  public mode: AppMode;

  public subscriptions: Subscription = new Subscription();

  public isOpenMenu = false;

  public isLaptop = false;

  public isFixedMenu = true;

  public isMobile = false;

  pleaseText: string;
  versionText: string;
  downloadChromeText: string;
  unsupportedBrowserText: string;

  constructor(
    private dialog: MatDialog,
    private auth: OAuthService,
    private appInfoService: McAppInfoService,
    private alertService: McAlertService,
    private browser: McBrowserService,
    private appConfig: McAppConfig,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private translate: McTranslateService,
    router: Router,
  ) {
    McSvgIcons.register(this.iconRegistry, this.sanitizer);

    this.mode = this.appInfoService.getMode();

    this.isMobile = this.browser.isMobile();

    const translatableProperties = {
      'COMMON.UNSUPPORTED_BROWSER': 'unsupportedBrowserText',
      'COMMON.DOWNLOAD_CHROME': 'downloadChromeText',
      'COMMON.VERSION': 'versionText',
      'COMMON.PLEASE_': 'pleaseText',
    };

    this.translate.translateProps(this, { translatableProperties });

    router.events
      .pipe(
        map(event => {
          if (event instanceof NavigationStart) {
            return true;
          }
          if (event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel) {
            return false;
          }

          return null;
        }),
        filter(value => value !== null),
        delay(0),
      )
      .subscribe(showBlockUI => {
        if (showBlockUI) {
          this.blockUI.start();
          return;
        }

        this.blockUI.reset();
      });
  }

  public ngOnInit(): void {
    this.isLaptop = window.innerWidth >= 1024 ? true : false;

    if (localStorage.getItem('isFixedMenu')) {
      this.isFixedMenu = JSON.parse(localStorage.getItem('isFixedMenu'));
    }

    this.subscriptions.add(
      this.alertService.onAlert.subscribe(data => {
        const err = data.content;
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401 || err.status === 0) {
            return;
          }
        }

        const dialogRef = this.dialog.open(Mc2021ShowAlertDialogComponent, {
          panelClass: 'show-alert-dialog',
          data: data,
        });

        if (data.relogin) {
          this.blockUI.reset();
          dialogRef.afterClosed().subscribe(() => {
            // URL of the SPA to redirect the operator to after login
            this.auth.redirectUri = window.location.origin + window.location.pathname;
            this.auth.initImplicitFlow();
          });
        }
      }),
    );

    if (!this.browser.isBrowserCompatible()) {
      const browserInfo = this.browser.getBrowserInfo();
      const yourBrowser = McUtils.ucf(browserInfo.name) + ' ' + this.versionText + ' ' + browserInfo.fullVersion;
      this.appInfoService.addNotificationItem(
        new AppInfoNotificationBlock({
          code: 'UNSUPPORTED_BROWSER',
          beforeLink: this.unsupportedBrowserText + ' ' + yourBrowser + '. ' + this.pleaseText,
          link: this.downloadChromeText,
          afterLink: '.',
          callback: () => {
            window.location.href = 'https://www.google.ru/intl/ru_ALL/chrome/';
          },
        }),
      );
    }

    this.appConfig.autoUpdateInit(this.dialog);
  }

  public onChangeStateMenu(stateMenu: boolean) {
    this.isOpenMenu = stateMenu;
  }

  public fixedSidenav(isFixedMenu: boolean) {
    this.isFixedMenu = isFixedMenu;
  }

  public getWidthForSideNav() {
    if (this.isLaptop) {
      return null;
    }

    if (!this.isLaptop) {
      return this.isOpenMenu ? '100%' : '0';
    }
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
