/* eslint-disable */
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { McAlertService, McPasswordApiService, McTranslateService } from '@mc/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mc-2021-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Mc2021ChangePasswordDialogComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;

  public oldPassword = new FormControl('');

  public newPassword = new FormControl('');

  public repeatNewPassword = new FormControl('');

  public isHideNewPassword = true;

  public isHideOldPassword = true;

  public isHideRepeatNewPassword = true;

  public isMatchPasswords = true;

  public subscriptions = new Subscription();

  errorText: string;
  dialogTitleText: string;
  successfullText: string;

  constructor(
    private passwordApiService: McPasswordApiService,
    public dialogRef: MatDialogRef<Mc2021ChangePasswordDialogComponent>,
    private translate: McTranslateService,
    public alertService: McAlertService
  ) {
    const translatableProperties = {
      'COMMON.ERRORS.ERROR': 'errorText',
      'CHANGE_PASSWORD_DIALOG.TITLE': 'dialogTitleText',
      'CHANGE_PASSWORD_DIALOG.SUCCESSFULL_TEXT': 'successfullText',
    };

    this.translate.translateProps(this, { translatableProperties });
  }

  public ngOnInit() {
    this.subscriptions.add(
      this.repeatNewPassword.valueChanges.subscribe(() => {
        this.isMatchPasswords = this.checkMatchPassword();
      })
    );

    this.subscriptions.add(
      this.newPassword.valueChanges.subscribe(() => {
        this.isMatchPasswords = this.checkMatchPassword();
      })
    );
  }
  s;

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public hideNewPassword() {
    this.isHideNewPassword = !this.isHideNewPassword;
  }

  public hideOldPassword() {
    this.isHideOldPassword = !this.isHideOldPassword;
  }

  public hideRepeatNewPassword() {
    this.isHideRepeatNewPassword = !this.isHideRepeatNewPassword;
  }

  public checkMatchPassword() {
    return this.newPassword.value === this.repeatNewPassword.value;
  }

  public cancel() {
    this.dialogRef.close();
  }

  public async onChangePassword() {
    this.blockUI.start();
    try {
      await this.passwordApiService.change(this.newPassword.value, this.oldPassword.value);
      this.blockUI.stop();
      this.alertService.infoSimple(this.dialogTitleText, [this.successfullText]);
      return this.dialogRef.close();
    } catch ({ error }) {
      const errorMessage = typeof error === 'string' ? JSON.parse(error).errorMessage : error.errorMessage;
      this.blockUI.stop();
      this.alertService.alert({
        title: this.errorText,
        content: errorMessage,
      });
    }
  }
}
