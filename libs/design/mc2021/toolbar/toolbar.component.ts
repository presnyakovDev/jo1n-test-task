/* eslint-disable */
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AppInfoNotificationBlock,
  AppMode,
  CommonOperatorInfo,
  FuseConfigService,
  McAppConfig,
  McAppInfoService,
  McAuthService,
  McBrowserService,
  McTranslateService,
  McUtils,
  Operator,
  OperatorApiService,
  OperatorCommonApiService,
} from '@mc/core';
import { MaskUtils } from '@mc/core/mc-masks';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'mc-2021-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class Mc2021ToolbarComponent implements OnInit {
  @Input()
  public spa: string;

  @Input()
  public visibleSelectLang = false;

  @Input()
  public visibleUser = true;

  @Input()
  public isLaptop = false;

  @Input()
  public shopPointCaption: boolean;

  @Input()
  public isOpenMenu: boolean;

  @Output()
  public onOpenMenu = new EventEmitter<boolean>();

  public userName: string;
  public userLogin: string;

  public managerInfo: { managerFullName: string; managerPhone: string };

  public userInfo: any;

  public horizontalNav$: Observable<boolean>;

  public appTitle = '';

  public appSubTitle = '';

  public pointCaption = '';

  public companyCaption = '';

  public hotLineInfo: { hotLinePhone: string; hotLineEmail: string };

  public operator: Operator;

  public notifications: AppInfoNotificationBlock[] = [];

  public mode: AppMode;

  public pageTitle = '';

  appTitleClick = () => {};

  constructor(
    private fuseConfig: FuseConfigService,
    private appConfig: McAppConfig,
    private appInfoService: McAppInfoService,
    private authService: McAuthService,
    public translate: McTranslateService,
    private cdr: ChangeDetectorRef,
    private operatorCommonService: OperatorCommonApiService,
    private browserService: McBrowserService,
  ) {
    this.mode = this.appInfoService.getMode();
  }

  public ngOnInit(): void {
    this.authService.onUserChanged.pipe(untilDestroyed(this)).subscribe(userInfo => {
      this.userName = MaskUtils.lastAndFirstName(userInfo.fullname);
      this.userLogin = userInfo.username;
      this.userInfo = userInfo;
    });

    OperatorApiService.onOperatorAccountChanged.pipe(untilDestroyed(this)).subscribe(operator => {
      if (!operator) {
        return;
      }

      if (operator.managerMC) {
        this.managerInfo = {
          managerFullName: MaskUtils.lastAndFirstName(operator.managerMC.fullname),
          managerPhone: MaskUtils.normalizePhone(operator.managerMC.phone),
        };
        this.cdr.detectChanges();
      }

      this.updateExternalScriptsInfo();
    });

    this.operatorCommonService.operatorInfo
      .pipe(filter<CommonOperatorInfo>(Boolean), untilDestroyed(this))
      .subscribe(operatorInfo => {
        this.pointCaption = operatorInfo.pointCaption;
        this.companyCaption = operatorInfo.companyCaption;
        this.cdr.detectChanges();
      });

    this.hotLineInfo = {
      hotLinePhone: this.appConfig.get('support-phone'),
      hotLineEmail: this.appConfig.get('support-email'),
    };

    McAppInfoService.onTitleChange.pipe(untilDestroyed(this)).subscribe(appTitle => {
      this.appTitle = appTitle;
      this.appSubTitle = null;
      this.appTitleClick = () => {};
      this.cdr.detectChanges();
    });

    this.appInfoService.onNotificationsListChange
      .pipe(untilDestroyed(this))
      .subscribe(notifications => (this.notifications = notifications));

    McAppInfoService.onAppTitleBlockChange.pipe(untilDestroyed(this)).subscribe(appTitleBlock => {
      this.appTitle = appTitleBlock.title;
      this.appSubTitle = appTitleBlock.subTitle;
      this.appTitleClick = appTitleBlock.onClick;
      this.cdr.detectChanges();
    });

    this.horizontalNav$ = this.fuseConfig.onSettingsChanged.pipe(map(settings => settings.layout.navigation === 'top'));
  }

  public openMenu() {
    this.onOpenMenu.emit(!this.isOpenMenu);
  }

  public updateExternalScriptsInfo() {
    if (this.authService.userHasOneOfRoles(['ROLE_MC_ONLINE', 'ROLE_MC_ONLINE_SHORT'])) {
      return;
    }
    if (this.authService.userHasOneOfRoles(['ROLE_MC_OPER'])) {
      document.body.classList.add('showMeTalkChat');
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
}
