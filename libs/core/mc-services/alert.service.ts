/* eslint-disable */
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { McTranslateService } from '@mc/core';

@Injectable()
export class McAlertService {
  static onAlert: Subject<any> = new Subject();

  get onAlert(): Subject<any> {
    return McAlertService.onAlert;
  }

  constructor(private translate: McTranslateService) {}

  alert(data) {
    if (this.translate.currentLang === 'ru') {
      this.onAlert.next(data);
    } else {
      this.onAlert.next(this.filterRu(data));
    }
  }

  private filterRu(data: { [p: string]: any }) {
    const filter = s =>
      typeof s === 'string' ? (/[а-яА-Я]/g.test(s) ? 'FORMATTED ERROR!' : s) : 'Error is not in string format.';

    const returnData: { [p: string]: any } = { ...data };

    for (const key in returnData) {
      if (Array.isArray(returnData[key])) {
        returnData[key] = returnData[key].map(filter);
      } else {
        returnData[key] = filter(returnData[key]);
      }
    }
    return returnData;
  }

  alertSimple(title: string, errors: Array<string>) {
    const data = { title: title, errors: errors };
    this.alert(data);
  }

  alertSimpleFromModule(module: string, section: string, part: string, title: string, errors: Array<string>) {
    const data = { title: title, errors: errors, module: module, section: section, part: part };
    this.alert(data);
  }

  infoSimple(title: string, errors: Array<string>) {
    const data = { title: title, errors: errors, noError: true };
    this.alert(data);
  }

  alertHtml(title: string, html: string) {
    const data = { title: title, html: html };
    this.alert(data);
  }

  alertReason(title: string, reason: any) {
    this.alertReasonFromModule(undefined, undefined, undefined, title, reason);
  }

  alertReasonFromModule(module: string, section: string, part: string, title: string, reason: any) {
    if (Array.isArray(reason)) {
      this.alertSimpleFromModule(module, section, part, title, reason);
      return;
    }

    if (reason === '' + reason) {
      this.alertSimpleFromModule(module, section, part, title, [reason]);
      return;
    }

    if (reason.status === 403) {
      this.alertSimpleFromModule(module, section, part, title, [reason.error]);
      return;
    }

    if (reason.error) {
      if (reason.error.errors && Array.isArray(reason.error.errors)) {
        const errors = reason.error.errors.map(e => e.message || e);
        this.alertSimpleFromModule(module, section, part, title, errors);
        return;
      }

      let decoded = reason.error;
      try {
        decoded = JSON.parse(decoded);
      } catch (err) {
        //
      }
      if (decoded && decoded.message) {
        const regExpr = /[А-Яа-яЁё]/;
        if (regExpr.test(decoded.message)) {
          this.alertSimpleFromModule(module, section, part, title, [decoded.message]);
          return;
        }
      }
      if (decoded && decoded.errorMessage) {
        const regExpr = /[А-Яа-яЁё]/;
        if (regExpr.test(decoded.errorMessage)) {
          this.alertSimpleFromModule(module, section, part, title, [decoded.errorMessage]);
          return;
        }
      }
    }
    if (reason.stack) {
      this.alertSimpleFromModule(module, section, part, title, [reason.stack]);
      return;
    }
    const errText = JSON.stringify(reason).replace(/:/g, ': ').replace(/,/g, ', ');
    this.alertSimpleFromModule(module, section, part, title, [errText]);
  }
}
