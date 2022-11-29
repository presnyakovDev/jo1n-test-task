/* eslint-disable */
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { McTranslateService } from '@mc/core';

import { McUtils } from '@mc/core';

@Component({
  selector: 'mc-show-alert',
  templateUrl: './show-alert.component.html',
  styleUrls: ['./show-alert.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Mc2021ShowAlertDialogComponent {
  title: string;
  yesButtonTitle: string;
  content: any;
  fadedContent: string;
  errorTitle: any;
  errors: any[];
  errorsTranslationKeys: string[] = [];
  noError = false;
  html: any;

  confirmAction: () => void;

  constructor(
    public dialogRef: MatDialogRef<Mc2021ShowAlertDialogComponent>,
    public translate: McTranslateService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    sanitaizer: DomSanitizer,
  ) {
    this.title = data.title;
    this.confirmAction = data.confirmAction;
    this.content = [data.content];
    this.errorTitle = '';
    this.yesButtonTitle = data.yesButtonTitle || 'Да';
    this.errors = [];
    this.noError = data.noError;
    this.html = data.html ? sanitaizer.bypassSecurityTrustHtml(data.html) : null;
    this.fadedContent = '';
    if (data.content instanceof HttpErrorResponse) {
      if (data.content.status === 502) {
        this.content = 'Идет обновление системы, пожалуйста, попробуйте повторить позже';
      } else {
        this.content = [data.content.error];
        try {
          const errorsWithFieldIds = data.content.error;
          this.errors = McUtils.getErrorsWithFieldTitles(errorsWithFieldIds.errors, data.fieldTitles);
          this.updateErrors();
          this.errorTitle = errorsWithFieldIds.errorMessage;
          if (!this.errors || !this.errors.length) {
            this.fadedContent = JSON.stringify(data);
          }
          this.content = '';
        } catch (e) {}
        if (this.errors.length === 0) {
          try {
            const errorsWithFieldIds = data.content.error;
            if (errorsWithFieldIds.errorMessage) {
              this.errorTitle = errorsWithFieldIds.errorMessage;
              this.content = '';
            }
          } catch (e) {}
        }
      }
    }
    if (data.errors) {
      this.errors = data.errors;
      this.updateErrors();

      try {
        const error = JSON.parse(data.errors[0]);
        if (error.status === 0) {
          // this.errors = ['Неполадки сети. Проверьте подключение к сети интернет.'];
          this.errors = [this.translate.instant('ONBOARDING.NO_INTERNET_CONNECTION')];
        }
      } catch (err) {}
    }
  }

  isTranslationKey(error: any) {
    return ('' + error).slice(0, 7).toUpperCase() === '{ERRORS';
  }

  updateErrors() {
    if (this.errors) {
      this.errorsTranslationKeys = this.errors
        .filter(error => this.isTranslationKey(error))
        .map(key => ('' + key).toUpperCase())
        .map(key => key.slice(1, key.length - 1));
      this.errors = this.errors.filter(error => !this.isTranslationKey(error));
    }
  }

  exit() {
    this.dialogRef.close();
  }

  yes() {
    this.confirmAction();
    this.dialogRef.close();
  }
}
