/* eslint-disable */
import {
  Component,
  Input,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, NavigationStart, NavigationError, NavigationCancel, Router } from '@angular/router';
import { map, filter, delay, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

import { FuseConfigService } from '../../../core/services/config.service';
import { McAppInfoService, AppInfoNotificationBlock } from '../../../core/mc-services/app-info.service';
import { McAuthService } from '../../../core/mc-services/auth.service';
import { McAppConfig } from '../../../core/mc-services/app-config.service';
import { McBrowserService } from '../../../core/mc-services/browser.service';
import { OperatorApiService } from '../../../core/mc-services/operator-api.service';
import { Operator } from '../../../core/mc-models/operator.model';
import { MaskUtils } from '../../../core/mc-masks';
import { McTranslateService, OperatorCommonApiService, CommonOperatorInfo } from '@mc/core';

@Component({
  selector: 'fuse-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  providers: [OperatorApiService],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FuseToolbarComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  showSpinner$: Observable<boolean>;
  horizontalNav$: Observable<boolean>;
  managerPhone: string;
  managerFullname: string;
  userInfo: any;
  appTitle = '';
  appSubTitle = '';
  pointCaption = '';
  companyCaption = '';
  hotLinePhone = 'загружается...';
  hotLineEmail = '';
  operator: Operator;
  notifications: AppInfoNotificationBlock[] = [];
  isMobile = false;

  @Input() shopPointCaption = false;
  @Input() spa: string;

  appTitleClick = () => {};

  constructor(
    private router: Router,
    private fuseConfig: FuseConfigService,
    private appConfig: McAppConfig,
    private browserService: McBrowserService,
    private appInfoService: McAppInfoService,
    private authService: McAuthService,
    public translate: McTranslateService,
    private cdr: ChangeDetectorRef,
    private operatorCommonService: OperatorCommonApiService
  ) {
    this.isMobile = this.browserService.isMobile();
    this.authService.onUserChanged.subscribe(userInfo => {
      this.userInfo = userInfo;
    });

    OperatorApiService.onOperatorAccountChanged.pipe(takeUntil(this.onDestroy$)).subscribe(operator => {
      if (!operator) {
        return;
      }

      if (operator.managerMC) {
        this.managerFullname = MaskUtils.lastAndFirstName(operator.managerMC.fullname);
        this.managerPhone = MaskUtils.normalizePhone(operator.managerMC.phone);
        this.cdr.detectChanges();
      }

      this.updateExternalScriptsInfo();
    });

    this.operatorCommonService.operatorInfo.pipe(filter<CommonOperatorInfo>(Boolean)).subscribe(operatorInfo => {
      this.pointCaption = operatorInfo.pointCaption;
      this.companyCaption = operatorInfo.companyCaption;
      this.cdr.detectChanges();
    });

    this.hotLinePhone = this.appConfig.get('support-phone');
    this.hotLineEmail = this.appConfig.get('support-email');

    McAppInfoService.onTitleChange.pipe(takeUntil(this.onDestroy$), delay(0)).subscribe(appTitle => {
      this.appTitle = appTitle;
      this.appSubTitle = null;
      this.appTitleClick = () => {};
      this.cdr.detectChanges();
    });

    this.appInfoService.onNotificationsListChange.subscribe(notifications => (this.notifications = notifications));

    McAppInfoService.onAppTitleBlockChange.pipe(takeUntil(this.onDestroy$), delay(0)).subscribe(appTitleBlock => {
      this.appTitle = appTitleBlock.title;
      this.appSubTitle = appTitleBlock.subTitle;
      this.appTitleClick = appTitleBlock.onClick;
      this.cdr.detectChanges();
    });

    this.showSpinner$ = router.events.pipe(
      map(event => {
        if (event instanceof NavigationStart) {
          return true;
        }
        if (event instanceof NavigationEnd || event instanceof NavigationError || event instanceof NavigationCancel) {
          return false;
        }

        return null;
      }),
      filter(showSpinner => showSpinner !== null),
      delay(0)
    );
    this.horizontalNav$ = this.fuseConfig.onSettingsChanged.pipe(map(settings => settings.layout.navigation === 'top'));
  }

  updateExternalScriptsInfo() {
    if (this.authService.userHasOneOfRoles(['ROLE_MC_ONLINE', 'ROLE_MC_ONLINE_SHORT'])) {
      return;
    }
    const clientInfo = {
      spaName: this.spa,
      spaVersion: this.appConfig.get('spa-version'),
      fullname: this.userInfo.fullname,
      phone: this.userInfo.phone,
      email: this.userInfo.email,
      login: this.userInfo.username,
      point: this.pointCaption,
    };
    const evt = new CustomEvent('setExternalScriptsClientInfo', { detail: clientInfo });
    window.dispatchEvent(evt);
  }

  notificationLinkClick(notification: AppInfoNotificationBlock) {
    notification.callback();
  }

  notificationCloseClick(notification: AppInfoNotificationBlock) {
    notification.show = false;
    if (notification.onClose) {
      notification.onClose();
    }
  }

  selectPoint() {
    this.router.navigate(['operatorPoint']);
  }

  ngOnDestroy() {
    this.onDestroy$.next(null);
    this.onDestroy$.complete();
  }
}
