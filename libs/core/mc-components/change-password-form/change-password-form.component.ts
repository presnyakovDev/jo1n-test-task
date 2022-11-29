/* eslint-disable */
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MatDialog } from '@angular/material/dialog';

import { McAppInfoService } from '../../mc-services/app-info.service';
import { McAlertService } from '../../mc-services/alert.service';
import { McPasswordApiService } from '../../mc-services/password-api.service';

import { McShowAlertDialogComponent } from '../show-alert/show-alert.component';

@Component({
  selector: 'mc-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class McChangePasswordFormComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  form: FormGroup;
  @Output() onFormSaved = new EventEmitter<void>();

  get oldPassword() {
    return this.form.get('oldPassword');
  }

  get newPassword() {
    return this.form.get('newPassword');
  }

  get repeatPassword() {
    return this.form.get('repeatPassword');
  }

  hideOldPassword = true;
  hideNewPassword = true;
  hideRepeatPassword = true;

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private appInfo: McAppInfoService,
    private alertService: McAlertService,
    private passwordApiService: McPasswordApiService
  ) {
    this.form = this.createForm();
    this.appInfo.setTitle('Смена пароля');
  }

  ngOnInit() {}

  createForm() {
    return this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      repeatPassword: ['', [Validators.required, matchOtherValidator('newPassword')]],
    });
  }

  send() {
    if (!this.form.valid) {
      const errors = [];

      if (this.oldPassword.errors && this.oldPassword.errors.required) {
        errors.push('Необходимо ввести старый пароль.');
      }

      if (this.newPassword.errors && this.newPassword.errors.required) {
        errors.push('Необходимо ввести новый пароль.');
      }

      if (this.repeatPassword.errors && this.repeatPassword.errors.required) {
        errors.push('Необходимо повторить новый пароль.');
      }

      if (this.repeatPassword.errors && this.repeatPassword.errors.matchOther) {
        errors.push('Новые пароли должны совпадать.');
      }

      this.alertService.alertSimple('Ошибка ввода', errors);

      return;
    }

    const formData = this.form.getRawValue();

    this.blockUI.start('Отправка...');
    this.passwordApiService
      .change(formData.newPassword, formData.oldPassword)
      .then(result => {
        this.blockUI.stop();
        this.onFormSaved.emit();
      })
      .catch(res => {
        const error = JSON.parse(res.error);
        this.blockUI.stop();
        this.alertService.alert({
          title: 'Ошибка!',
          content: error.errorMessage,
        });
      });
  }
}

function matchOtherValidator(otherControlName: string) {
  let thisControl: FormControl;
  let otherControl: FormControl;

  return function matchOtherValidate(control: FormControl) {
    if (!control.parent) {
      return null;
    }

    // Initializing the validator.
    if (!thisControl) {
      thisControl = control;
      otherControl = control.parent.get(otherControlName) as FormControl;
      if (!otherControl) {
        throw new Error('matchOtherValidator(): other control is not found in parent group');
      }
      otherControl.valueChanges.subscribe(() => {
        thisControl.updateValueAndValidity();
      });
    }

    if (!otherControl) {
      return null;
    }

    if (otherControl.value !== thisControl.value) {
      return {
        matchOther: true,
      };
    }

    return null;
  };
}
