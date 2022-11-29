/* eslint-disable */
import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  AppMode,
  FuseConfirmDialogComponent,
  McAboutSpaDialogComponent,
  McAppInfoService,
  McAuthService,
  OperatorApiService,
} from '@mc/core';
import { Mc2021ChangePasswordDialogComponent } from '../change-password-dialog';

@Component({
  selector: 'mc-2021-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class Mc2021UserMenuComponent implements OnInit {
  @HostListener('document:click', ['$event'])
  public clickOutside(event: { target: EventTarget }) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpenedMenu = false;
    }
  }

  @Input()
  public userName: string;

  @Input()
  public userLogin: string;

  @Input()
  public isLaptop = false;

  public canEditPassword = false;

  public isOpenedMenu = false;

  public isMcOper = false;

  public mode: AppMode;

  private operatorId: number;

  constructor(
    private authService: McAuthService,
    private eRef: ElementRef,
    private dialog: MatDialog,
    private appInfoService: McAppInfoService,
    private auth: McAuthService,
    private operatorService: OperatorApiService
  ) {}

  public ngOnInit() {
    this.isMcOper = this.authService.userHasRole('ROLE_MC_OPER');
    this.mode = this.appInfoService.getMode();
    this.auth.onUserChanged.subscribe(userInfo => {
      this.operatorId = userInfo.operatorInfo ? userInfo.operatorInfo.operatorId : 0;
    });
  }

  public openMenu() {
    this.isOpenedMenu = !this.isOpenedMenu;
  }

  public about() {
    this.dialog.open(McAboutSpaDialogComponent, {
      panelClass: 'show-about-spa-dialog',
    });
  }

  public openDialogChangePassword() {
    this.dialog.open(Mc2021ChangePasswordDialogComponent, {
      height: '440px',
      width: '600px',
    });
    this.isOpenedMenu = false;
  }

  public logout() {
    this.authService.logout();
  }

  public deactivateAccount() {
    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      panelClass: 'fuse-confirm-dialog',
      disableClose: false,
    });
    dialogRef.componentInstance.confirmMessage =
      'Ваш аккаунт будет заблокирован. Восстановление будет возможно только через горячую линию.';
    dialogRef.componentInstance.confirmBigText = 'Заблокировать аккаунт?';

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.operatorService.deactivateAccount(this.operatorId);
        this.auth.logout();
      }
    });
  }
}
