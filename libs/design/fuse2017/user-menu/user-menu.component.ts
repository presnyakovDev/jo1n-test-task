/* eslint-disable */
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { McAuthService } from '../../../core/mc-services/auth.service';
import { McAboutSpaDialogComponent } from '../../../core/mc-components/about-spa-dialog/about-spa-dialog.component';
import { OperatorApiService } from '../../../core/mc-services/operator-api.service';
import { Operator } from '../../../core/mc-models/operator.model';
import { McUtils } from '../../../core/mc-utils';

@Component({
  selector: 'fuse-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  providers: [OperatorApiService],
})
export class FuseUserMenuComponent {
  username = '?';
  shortname = null;
  userInfo: any;
  operator: Operator;

  canEditForm = false;

  @Input() canChangePassword = true;

  constructor(private authService: McAuthService, private dialog: MatDialog) {
    this.authService.onUserChanged.subscribe(userInfo => {
      this.username = userInfo.username;
      this.userInfo = userInfo;
      this.shortname = McUtils.getShortName(userInfo.fullname);
      this.canEditForm = this.authService.userHasRole('ROLE_MC_OPER');
    });
  }

  userinfo() {}

  about() {
    const dialogRef = this.dialog.open(McAboutSpaDialogComponent, {
      panelClass: 'show-about-spa-dialog',
    });
  }

  logout() {
    this.authService.logout();
  }
}
