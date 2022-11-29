/* eslint-disable */
import { FormGroup, AbstractControl, FormArray, FormControl } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NgOption } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import * as moment from 'moment-mini';

import { Page } from './page.model';

interface CookieOptions {
  path: string;
  domain?: string;
  expires?: Date | string;
  'max-age'?: number;
  secure?: boolean;
  samesite?: string;
  httpOnly?: boolean;
}

export class McUtils {
  public static onDecodeErrorsFromReason: Subject<{ reason: any; errors: string[] }> = new Subject();

  public static wait(ms: number): Promise<any> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public static convertFormDateToDatepicker(form: FormGroup, formField: string): any {
    const formData = form.getRawValue();
    const date = formData[formField];
    if (!date) {
      return null;
    }
    return moment(date, 'DD.MM.YYYY').toDate();
  }

  public static isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  public static updateFormByDatePicker(form: FormGroup, value: string, formField: string): string {
    if (!value) {
      return;
    }
    const formValue = moment(value).format('DD.MM.YYYY');

    const patchValue: any = {};
    patchValue[formField] = formValue;

    form.patchValue(patchValue);
  }

  public static baseOperatorSpaUrl(): string {
    return window.location.origin.replace('/backoffice/app', '/broker/operator/app');
  }

  public static fillTemplate(template: string, fieldValues: any): string {
    let res = template;
    // tslint:disable-next-line:forin
    for (const field in fieldValues) {
      const from = '[' + field + ']';
      while (res.indexOf(from) >= 0) {
        res = res.replace(from, fieldValues[field]);
      }
    }
    return res;
  }

  public static processPromisesInBatches(promises: Promise<any>[], batchSize: number): Promise<any[]> {
    if (!promises.length) {
      return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
      McUtils.processPromisesInBatches(promises.slice(batchSize), batchSize).then(results => {
        const batchPromises = promises.slice(0, batchSize);
        Promise.all(batchPromises).then(batchResults => {
          batchResults.reverse().forEach(item => results.unshift(item));
          resolve(results);
        }, reject);
      }, reject);
    });
  }

  public static dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  public static decodeErrors(reason: any, form: FormGroup, errors: Map<string, string>, replaces = []) {
    errors.clear();
    if (reason instanceof HttpErrorResponse) {
      try {
        const errorsWithFieldIds = reason.error.errors;
        for (const errorWithFieldId of errorsWithFieldIds) {
          // tslint:disable-next-line:forin
          for (const fieldId0 in errorWithFieldId) {
            let fieldId = fieldId0;
            replaces.forEach(replacePair => {
              fieldId = fieldId.replace(replacePair.from, replacePair.to);
            });
            errors.set(fieldId, errorWithFieldId[fieldId0]);
            if (form.controls[fieldId]) {
              form.controls[fieldId].markAsTouched();
              form.controls[fieldId].setErrors({ incorrect: true });
            }
            const pointPos = fieldId.indexOf('.');
            if (pointPos > 0) {
              let baseFieldId = fieldId.slice(0, pointPos);
              const extFieldId = fieldId.slice(pointPos + 1);
              const index =
                baseFieldId.slice(baseFieldId.length - 1) === ']'
                  ? baseFieldId.slice(fieldId.indexOf('[') + 1, baseFieldId.length - 1)
                  : null;
              let baseControl: AbstractControl;
              if (index) {
                baseFieldId = baseFieldId.slice(0, fieldId.indexOf('['));
              }
              if (index) {
                const baseControls = form.controls[baseFieldId] as FormArray;
                baseControl = baseControls.controls[+index];
              } else {
                baseControl = form.controls[baseFieldId];
              }
              const extFieldControl = baseControl.get(extFieldId);
              if (extFieldControl) {
                extFieldControl.markAsTouched();
                extFieldControl.setErrors({ incorrect: true });
              }
            }
          }
        }
      } catch (e) {}
    }
    return errors;
  }

  public static decodeErrorsV2(
    reason: any,
    form: FormGroup,
    errors: Map<string, string>,
    replaces: { from: string; to: string }[] = [],
  ) {
    Object.keys(form.controls).forEach(control => form.controls[control].setErrors(null));
    errors.clear();
    if (reason instanceof HttpErrorResponse) {
      try {
        const errorsArr = reason.error.errors;
        for (const errorItem of errorsArr as { message: string; path: string }[]) {
          if (errorItem.path) {
            let errorPath = errorItem.path.replace('payload.', '');

            replaces.forEach(replacePair => {
              if (errorPath.includes(replacePair.from)) {
                errorPath = errorPath.replace(replacePair.from, replacePair.to);
              }
            });

            const errorKey = errorPath;
            errors.set(errorKey, errorItem.message);

            if (form.controls[errorKey]) {
              form.controls[errorKey].markAsTouched();
              form.controls[errorKey].setErrors({ incorrect: true });
            }
          } else if (errorItem.path === null) {
            const errorKey = null;
            errors.set(errorKey, errorItem.message);

            if (form.controls[errorKey]) {
              form.controls[errorKey].markAsTouched();
              form.controls[errorKey].setErrors({ incorrect: true });
            }
          }
        }
      } catch (e) {}
    }
  }

  public static decodeFormErrorsAsArray(formErrors: Map<string, string>, fieldTitles: Object): string[] {
    const fieldsList = Object.keys(fieldTitles).reduce(
      (acc, key) => ({
        ...acc,
        ...(fieldTitles[key] instanceof Object ? fieldTitles[key] : { [key]: fieldTitles[key] }),
      }),
      {},
    );
    return Array.from(formErrors).reduce((acc, arr) => [...acc, fieldsList[arr[0]] + ' - ' + arr[1]], []);
  }

  public static responseFieldsReplace(sourceReason: any, replaces = []) {
    if (!(sourceReason instanceof HttpErrorResponse)) {
      return sourceReason;
    }
    const reason = this.cloneHttpErrorResponse(sourceReason);
    const errorsWithFieldIds = reason.error.errors;
    errorsWithFieldIds.forEach((errorWithFieldId, index) => {
      const errorWithFieldIdNew = {};
      // tslint:disable-next-line:forin
      for (const fieldId0 in errorWithFieldId) {
        let fieldId = fieldId0;
        replaces.forEach(replacePair => {
          fieldId = fieldId.replace(replacePair.from, replacePair.to);
        });
        errorWithFieldIdNew[fieldId] = errorWithFieldId[fieldId0];
      }
      errorsWithFieldIds[index] = errorWithFieldIdNew;
    });
    return reason;
  }

  public static responseFieldsConcatenate(sourceReason: any, rules = []) {
    if (!(sourceReason instanceof HttpErrorResponse)) {
      return sourceReason;
    }
    const reason = this.cloneHttpErrorResponse(sourceReason);
    const errorsWithFieldIds = reason.error.errors;

    rules.forEach(rule => {
      const concatenatedErrors = [];

      rule.from.forEach(from => {
        const index = errorsWithFieldIds.findIndex(item => {
          return from.field in item;
        });

        if (index !== -1) {
          const errorSource = errorsWithFieldIds.splice(index, 1)[0];
          const errorString = from.caption + ': ' + errorSource[from.field];
          concatenatedErrors.push(errorString);
        }
      });

      if (concatenatedErrors.length) {
        const field = {};
        field[rule.field] = concatenatedErrors.join(', ');

        errorsWithFieldIds.push(field);
      }
    });
    return reason;
  }

  public static responseFieldsConcatenateV2(
    sourceReason: any,
    rules: { field: string; from: { field: string; caption: string }[] }[] = [],
    showAllErrors = false,
  ) {
    if (!(sourceReason instanceof HttpErrorResponse)) {
      return sourceReason;
    }
    const reason = this.cloneHttpErrorResponse(sourceReason);
    const errorsWithFieldIds = reason.error.errors;

    rules.forEach(rule => {
      const concatenatedErrors = [];

      rule.from.forEach(from => {
        const index = errorsWithFieldIds.findIndex(item => from.field === item.path);

        if (index !== -1) {
          const errorSource = errorsWithFieldIds.splice(index, 1)[0];
          const errorString = from.caption ? from.caption + ': ' + errorSource.message : errorSource.message;
          concatenatedErrors.push(errorString);
        }
      });

      if (concatenatedErrors.length) {
        const error = {
          path: rule.field,
          message: showAllErrors ? concatenatedErrors.join(', ') : concatenatedErrors[0],
        };

        errorsWithFieldIds.push(error);
      }
    });
    return reason;
  }

  private static cloneHttpErrorResponse(response: HttpErrorResponse): HttpErrorResponse {
    return new HttpErrorResponse({
      error: {
        errorMessage: response.error.errorMessage,
        errors: Object.assign([], response.error.errors),
      },
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
      url: response.url || undefined,
    });
  }

  public static getShortName(fullname: string): string {
    if (!fullname) {
      return fullname;
    }
    const chunks = fullname.split(' ');

    return chunks.map((chunk, index) => (index ? chunk[0] + '.' : chunk)).join(' ');
  }

  public static removeDoubleSpaces(str: string): string {
    if (str === null) {
      return null;
    }
    return str.replace(/ +(?= )/g, '');
  }

  public static removeAllSpacesInString(string: string): string {
    return string ? string.replace(/\s/g, '') : string;
  }

  public static replaceNewLinesToSpacesAndRemoveDoubleSpaces(str: string): string {
    if (str === null) {
      return null;
    }
    return str.replace(/[\n\t\r\s ]+/g, ' ');
  }

  public static getWebcamVariants(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoDevices = devices.filter(dev => dev.kind === 'videoinput');
        resolve(
          videoDevices.map(item => {
            return { id: item.deviceId, caption: item.label };
          }),
        );
      });
    });
  }

  public static setDefaultWebcam(prefferedDeviceId: string, prefferedDeviceCaption: string) {
    localStorage.setItem('webcam.deviceId', prefferedDeviceId);
    localStorage.setItem('webcam.caption', prefferedDeviceCaption);
  }

  public static getWebcamStream(): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .enumerateDevices()
        .then(devices => {
          const videoDevices = devices.filter(dev => dev.kind === 'videoinput');

          let deviceId = videoDevices[videoDevices.length - 1].deviceId;
          const prefferedDeviceId = localStorage.getItem('webcam.deviceId');
          if (prefferedDeviceId && videoDevices.find(item => item.deviceId === prefferedDeviceId)) {
            deviceId = prefferedDeviceId;
          }

          navigator.mediaDevices
            .getUserMedia({ video: { deviceId: { exact: deviceId } } })
            .then(stream => resolve(stream))
            .catch(reason => reject(reason));
        })
        .catch(reason => reject(reason));
    });
  }

  public static async getWebcamStreamWithContraints(constraints: any = {}): Promise<MediaStream> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter(dev => dev.kind === 'videoinput');
    let deviceId = videoDevices[videoDevices.length - 1].deviceId;
    const prefferedDeviceId = localStorage.getItem('webcam.deviceId');

    if (prefferedDeviceId && videoDevices.find(item => item.deviceId === prefferedDeviceId)) {
      deviceId = prefferedDeviceId;
    }

    const options = { ...constraints };

    if (!options.video) {
      options['video'] = {};
    }

    options['video']['deviceId'] = { exact: deviceId };
    const stream = await navigator.mediaDevices.getUserMedia(options);

    return stream;
  }

  public static getPeriodVariantsStartingFrom(fromYear = 2018, fromMonth = 9, addNextPeriod = true) {
    const periods = [];
    const now = new Date();
    let period = '';
    let year = fromYear;
    let month = fromMonth;
    let nextDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
    while (nextDate <= now) {
      nextDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
      period = nextDate.toISOString().slice(0, 7);
      periods.push(period);
      if (++month > 12) {
        month = 1;
        ++year;
      }
    }
    const monthNames = this.getMonthNames();
    if (!addNextPeriod) {
      periods.pop();
    }
    return periods.map(elem => {
      return {
        id: elem,
        caption: monthNames[elem.slice(5, 7)] + ' ' + elem.slice(0, 4),
      };
    });
  }

  public static processNamePart(s: string) {
    if (!s) {
      return null;
    }
    const ru = [
      'й',
      'ц',
      'у',
      'к',
      'е',
      'н',
      'г',
      'ш',
      'щ',
      'з',
      'х',
      'ъ',
      'ф',
      'ы',
      'в',
      'а',
      'п',
      'р',
      'о',
      'л',
      'д',
      'ж',
      'э',
      'я',
      'ч',
      'с',
      'м',
      'и',
      'т',
      'ь',
      'б',
      'ю',
    ];
    // tslint:disable-next-line:quotemark
    const en = [
      'q',
      'w',
      'e',
      'r',
      't',
      'y',
      'u',
      'i',
      'o',
      'p',
      '[',
      ']',
      'a',
      's',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      ';',
      // tslint:disable-next-line:quotemark
      "'",
      'z',
      'x',
      'c',
      'v',
      'b',
      'n',
      'm',
      ',',
      '.',
    ];
    return McUtils.ucf(
      s.replace(/[a-zA-Z\[\]\;\'\,\.\/]/g, r =>
        en.indexOf(r.toLocaleLowerCase()) > -1 ? ru[en.indexOf(r.toLocaleLowerCase())] : '',
      ),
    ).trim();
  }

  public static getSexIdBySecondName(secondName: string, sexVariants: Array<NgOption>, nowSexId: number): number {
    if (nowSexId) {
      return nowSexId;
    }
    const newSexCode = this.getSexCodeBySecondName(secondName);
    if (!newSexCode) {
      return null;
    }
    const newSexId = sexVariants.find(item => item.code === newSexCode).value as number;
    return newSexId;
  }

  public static getSexIdBySexCode(sexVariants: Array<NgOption>, sexCode: string): number {
    if (!sexCode) {
      return null;
    }

    return sexVariants.find(item => item.code === sexCode).value as number;
  }

  public static getSexCodeBySecondName(secondName: string): string {
    if (secondName.length >= 1) {
      const maleRegs = [/ович$/, /евич$/, /ич$/];
      const femaleRegs = [/овна$/, /евна$/, /ична$/, /инична$/];

      if (maleRegs.find(item => item.test(secondName))) {
        return 'Male';
      }

      if (femaleRegs.find(item => item.test(secondName))) {
        return 'Female';
      }
    }
    return null;
  }

  public static getPeriodCaption(dateFrom: string, dateTo: string): string {
    if (dateFrom.slice(0, 8) === dateTo.slice(0, 8)) {
      if (dateFrom.slice(8) === '01') {
        if (McUtils.getLastMonthDate(dateFrom) === dateTo) {
          const month = dateFrom.slice(5, 7);
          const monthNames = McUtils.getMonthNames();
          return monthNames[month] + ' ' + dateFrom.slice(0, 4);
        }
      }
    }

    return dateFrom + ' - ' + dateTo;
  }

  public static getLastMonthDate(date: string): string {
    const dt = new Date(date);
    const ld = new Date(dt.getFullYear(), dt.getMonth() + 1, 1);
    return ld.toISOString().slice(0, 10);
  }

  public static getFileNameFromString(str: string): string {
    return str.replace(/[ ]+/g, ' ').trim();
  }

  public static dataURLToBlob(dataURL: string) {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      const parts0 = dataURL.split(',');
      const contentType0 = parts0[0].split(':')[1];
      const raw0 = parts0[1];

      return new Blob([raw0], { type: contentType0 });
    }

    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
  }

  public static getMonthNames(): any {
    return {
      '01': 'Январь',
      '02': 'Февраль',
      '03': 'Март',
      '04': 'Апрель',
      '05': 'Май',
      '06': 'Июнь',
      '07': 'Июль',
      '08': 'Август',
      '09': 'Сентябрь',
      '10': 'Октябрь',
      '11': 'Ноябрь',
      '12': 'Декабрь',
    };
  }

  public static getAllItems(fromPage: Page, service: any): Promise<Array<any>> {
    return new Promise((resolve, reject) => {
      service
        .getItemsOnPage(fromPage)
        .then(items => {
          if (items.length < fromPage.pageSize) {
            resolve(items);
          } else {
            fromPage.pageNumber++;
            this.getAllItems(fromPage, service)
              .then(items2 => {
                items.push(...items2);
                resolve(items);
              })
              .catch(reason => reject(reason));
          }
        })
        .catch(reason => reject(reason));
    });
  }

  public static updateDate(form: FormGroup, fieldName: string) {
    if (!form.controls[fieldName] || !form.controls[fieldName].value) {
      return;
    }
    const value = form.controls[fieldName].value;
    const year = value.substr(6, 4);
    const year2 = value.substr(6, 2);
    if (year.substr(2, 2) === '__') {
      if (McUtils.isNumeric(year2)) {
        const century = +year2 < 25 ? '20' : '19';
        form.controls[fieldName].setValue(value.substr(0, 6) + century + year2);
      }
    }
  }

  public static updateDateTime(form: FormGroup, fieldName: string) {
    const value = form.controls[fieldName].value;
    if (!value) {
      return;
    }

    const yearFull = value.substr(6, 4);
    const yearShort = value.substr(6, 2);
    let date = value.substr(0, 10);
    let time = value.substr(11, 5);
    let result;

    if (yearFull.substr(2, 2) === '__' && McUtils.isNumeric(yearShort)) {
      const century = +yearShort < 25 ? '20' : '19';
      date = value.substr(0, 6) + century + yearShort;
    }

    if (this.validDate(date) && time === '__:__') {
      time = '00:00';
    }

    result = date + ' ' + time;

    if (value !== result) {
      form.controls[fieldName].setValue(result);
    }
  }

  public static s2ab(s: string): ArrayBuffer {
    const buf: ArrayBuffer = new ArrayBuffer(s.length);
    const view: Uint8Array = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      // tslint:disable-next-line:no-bitwise
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }

  public static uc(s: string): string {
    return s ? s.toUpperCase().trim() : s;
  }

  public static ucf(s: string): string {
    return s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s;
  }

  public static capitalize(s: string): string {
    return s
      ? s
          .split(' ')
          .map(word => this.ucf(word))
          .join(' ')
      : s;
  }

  public static monthlyPayment(total: number, rate: number, periods: number): number {
    let res = periods ? total / periods : 0;
    if (rate > 0) {
      const p = rate / 12 / 100;
      const d = Math.pow(p + 1, periods) - 1;
      res = total * (p + p / d);
    }
    return res;
  }

  public static formatInterval(min: number, max: number, decimalPlaces: number): string {
    if (max > min) {
      return this.formatSumm(min, decimalPlaces) + '-' + this.formatSumm(max, decimalPlaces);
    }
    return this.formatSumm(min, decimalPlaces);
  }

  public static formatSumm(x: number, decimalPlaces: number): string {
    if (!x) {
      return '0';
    }
    let xs = (+x).toFixed(decimalPlaces);
    let i = xs.length - 3 - (decimalPlaces ? decimalPlaces + 1 : 0);
    while (i > 0) {
      xs = xs.slice(0, i) + '\u00A0' + xs.slice(i);
      i -= 3;
    }
    return xs;
  }

  public static isApiDateValid(date: string) {
    const dateObject = moment(date, 'YYYY-MM-DD', true);
    return dateObject.isValid();
  }

  public static isFormDateValid(date: string) {
    if (!date) {
      return true;
    }
    const dateConverted = this.dateConvertFormToApi(date);
    const timestamp = Date.parse(dateConverted);
    return !isNaN(timestamp);
  }

  public static isFormDateTimeValid(date: string) {
    if (!date) {
      return true;
    }
    const dateConverted = this.dateTimeConvertFormToApi(date);
    const timestamp = Date.parse(dateConverted);
    return !isNaN(timestamp);
  }

  public static getIncorrectFormDateErrors(dateFields: Array<string>, formData: any, fieldNames: any): Array<string> {
    const errors: Array<string> = [];
    dateFields.forEach(field => {
      if (!this.isFormDateValid(formData[field])) {
        errors.push('Некорректная дата "' + formData[field] + '" в поле ' + fieldNames[field]);
        return;
      }
      const digits = McUtils.removeNonDigits(formData[field]);
      if (digits && digits.length > 0 && digits.length !== 8) {
        errors.push('Некорректная дата "' + formData[field] + '" в поле ' + fieldNames[field]);
        return;
      }
    });
    if (errors.length === 0) {
      return null;
    }
    return errors;
  }

  public static getErrMsg(reason: any): Array<string> {
    if (reason && reason.error && reason.error.errorMessage) {
      McUtils.onDecodeErrorsFromReason.next({ reason: reason, errors: [reason.error.errorMessage] });
      return [reason.error.errorMessage];
    }
    McUtils.onDecodeErrorsFromReason.next({ reason: reason, errors: [JSON.stringify(reason)] });
    return [JSON.stringify(reason)];
  }

  public static dateConvertApiToForm(date: string) {
    if (!date) {
      return null;
    }
    const convertedDate = date.substr(8, 2) + '.' + date.substr(5, 2) + '.' + date.substr(0, 4);
    return convertedDate;
  }

  public static dateTimeConvertApiToForm(date: string) {
    if (!date) {
      return null;
    }
    const convertedDate = this.dateConvertApiToForm(date);
    const time = date.substr(11, 5);
    return convertedDate + ' ' + time;
  }

  public static dateConvertFormToApi(date: string) {
    if (!date) {
      return null;
    }
    if (date.indexOf('/') > 0) {
      const p1 = date.indexOf('/');
      let month = date.slice(0, p1);
      if (month.length === 1) {
        month = '0' + month;
      }

      const datePart = date.slice(p1 + 1);
      const p2 = datePart.indexOf('/');
      let day = datePart.slice(0, p2);
      if (day.length === 1) {
        day = '0' + day;
      }
      const year = '20' + datePart.slice(p2 + 1);
      const res = year + '-' + month + '-' + day;
      return res;
    }
    const convertedDate = date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2);
    return convertedDate;
  }

  public static dateTimeConvertFormToApi(date: string) {
    if (!date) {
      return null;
    }
    const convertedDate = this.dateConvertFormToApi(date);
    const time = date.substr(11, 5);
    return convertedDate + 'T' + time;
  }

  public static validDate(date: string): boolean {
    if (date.substr(2, 1) !== '.') {
      return false;
    }
    if (date.substr(5, 1) !== '.') {
      return false;
    }
    const day = date.substr(0, 2);
    const month = date.substr(3, 2);
    const year = date.substr(6, 4);

    const number = '1' + day + month + year;
    if (number !== '' + +number) {
      return false;
    }

    const date_ = new Date();
    date_.setFullYear(+year, +month - 1, +day);

    if (date_.getFullYear() !== +year) {
      return false;
    }
    if (date_.getMonth() !== +month - 1) {
      return false;
    }
    if (date_.getDate() !== +day) {
      return false;
    }

    return true;
  }

  public static authCodeError(code: string): string {
    const re = /[а-яА-ЯёЁ\s]/i;
    if (re.test(code)) {
      return 'Содержит кириллицу или пробелы';
    }
    return null;
  }

  public static getAccessGroup(accessControlGroups: Array<any>, accessRole: string): string {
    return accessControlGroups.find(elem => elem.accessRole === accessRole);
  }

  public static getAccessGroupItemTitle(group: any): string {
    if (!group) {
      return '-';
    }

    if (group.users && group.users.length) {
      return group.users[0].fullname + ' ' + group.groupName;
    } else {
      return group.groupName;
    }
  }

  public static getAccessGroupItemFio(group: any): string {
    if (!group) {
      return '-';
    }

    if (group.users && group.users.length) {
      return group.users[0].fullname;
    } else {
      return group.groupName;
    }
  }

  public static getAccessGroupTitle(groups: Array<any>, accessRole: string): string {
    return this.getAccessGroupItemTitle(this.getAccessGroup(groups, accessRole));
  }

  public static getAccessGroupFIO(groups: Array<any>, accessRole: string): string {
    return this.getAccessGroupItemFio(this.getAccessGroup(groups, accessRole));
  }

  public static compareByCaption(a: any, b: any): number {
    return McUtils.compare(a, b, 'caption');
  }

  public static compare(a: any, b: any, field: string): number {
    if (a[field] < b[field]) {
      return -1;
    }
    if (a[field] > b[field]) {
      return 1;
    }
    return 0;
  }

  public static calcColsWidths(data: Array<Array<any>>): Array<any> {
    const res: Array<any> = [];
    data.forEach(line => {
      line.forEach((cell, column) => {
        const cellWidth = ('' + cell).length;
        if (res[column]) {
          res[column].wch = Math.max(cellWidth, res[column].wch);
        } else {
          res[column] = { wch: cellWidth };
        }
      });
    });
    return res;
  }

  public static isEmailCorrect(email: string): boolean {
    const regExpr =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExpr.test(String(email).toLowerCase());
  }

  public static isFullnameCorrect(fio: string): boolean {
    const regExpr =
      /^([А-Яа-яЁё]+(-[А-Яа-яЁё]+)?)(\s+[А-Яа-яЁё]+(-[А-Яа-яЁё]+)?)(\s+[А-Яа-яЁё]+(-[А-Яа-яЁё]+)?)?(\s+[А-Яа-яЁё]+(-[А-Яа-яЁё]+)?)?$/;
    return regExpr.test(String(fio).toLowerCase());
  }

  public static isNameCorrect(fio: string): boolean {
    const regExpr = /^([А-Яа-яЁё]+(-[А-Яа-яЁё]+)?)$/;
    return regExpr.test(String(fio).toLowerCase());
  }

  public static isSecondNameCorrect(fio: string): boolean {
    const regExpr = /^([А-Яа-яЁё]+(-[А-Яа-яЁё]+)?)(\s+[А-Яа-яЁё]+(-[А-Яа-яЁё]+)?)?$/;
    return regExpr.test(String(fio).toLowerCase());
  }

  public static removeNonDigits(originalValue: string): string {
    if (!originalValue) {
      return originalValue;
    }
    return ('' + originalValue).replace(/\D+/g, '');
  }

  public static removeNonDigitsExceptPoint(originalValue: string): string {
    if (!originalValue) {
      return originalValue;
    }
    return ('' + originalValue).replace(/[^.0-9]+/g, '');
  }

  public static stripPhone(originalValue: string): string {
    if (!originalValue) {
      return originalValue;
    }
    const digits = originalValue.replace(/\D+/g, '');
    if (digits.length === 11) {
      return digits.slice(1);
    }
    if (digits.length === 10) {
      return digits;
    }
    return originalValue;
  }

  public static getFullFieldNames(partedFieldNames: any[]) {
    const fieldNames = {};

    partedFieldNames.forEach((fieldsPart: any) => {
      // tslint:disable-next-line:forin
      for (const field in fieldsPart) {
        if (field !== '*sectionTitle') {
          const fullFieldTitle = fieldsPart['*sectionTitle'] + ' / ' + fieldsPart[field];
          fieldNames[field] = fullFieldTitle;
        }
      }
    });
    return fieldNames;
  }

  public static getFullFieldNamesWithPrefix(partedFieldNames: any[], prefix: string) {
    const fieldNames = {};

    partedFieldNames.forEach((fieldsPart: any) => {
      // tslint:disable-next-line:forin
      for (const field in fieldsPart) {
        if (field !== '*sectionTitle') {
          const fullFieldTitle = fieldsPart['*sectionTitle'] + ' / ' + fieldsPart[field];
          fieldNames[field] = fullFieldTitle;
          fieldNames[prefix + field] = fullFieldTitle;
        }
      }
    });
    return fieldNames;
  }

  public static getErrorsWithFieldTitles(errorsWithFieldIds, fieldTitles, replaces = []): any {
    const errList = [];

    for (const errorWithFieldId of errorsWithFieldIds) {
      // tslint:disable-next-line:forin
      for (const fieldId0 in errorWithFieldId) {
        let fieldId = fieldId0;
        replaces.forEach(replacePair => {
          fieldId = fieldId.replace(replacePair.from, replacePair.to);
        });
        const fieldError: string = errorWithFieldId[fieldId0];
        const fieldTitle = fieldTitles[fieldId];
        if (fieldTitle) {
          errList.push(fieldTitle + ' - ' + fieldError);
        } else {
          errList.push(fieldError);
        }
      }
    }

    return errList;
  }

  public static convertIdCaptionListToNgOptions(list: any[]): Array<NgOption> {
    return list.map(item => {
      return {
        value: item.id,
        label: item.caption,
      };
    });
  }

  public static scrollFirstFieldWithErrorIntoView(errors: Map<string, string>, document: Document) {
    const fieldsWithErrors = Array.from(errors.keys());
    if (fieldsWithErrors.length > 0) {
      let min = 1000000;
      let minElem = null;
      fieldsWithErrors.forEach(field => {
        const elem = document.getElementById(field);
        if (!elem) {
          return;
        }
        const rect = elem.getBoundingClientRect() as DOMRect;
        if (rect.y < min) {
          min = rect.y;
          minElem = field;
        }
      });
      if (minElem) {
        document.getElementById(minElem).scrollIntoView();
      }
    }
  }

  public static getCookie(name: string): string | undefined {
    const cookieStr = document.cookie.split('; ').find(cookie => cookie.startsWith(`${name}=`));
    return cookieStr ? cookieStr.slice(name.length + 1) : undefined;
  }

  public static setCookie(name, value, options: CookieOptions = { path: '/' }) {
    /*
        Sets a cookie with specified name (str), value (str) & options (dict)
        options keys:
          - path (str) - URL, for which this cookie is available (must be absolute!)
          - domain (str) - domain, for which this cookie is available
          - expires (Date object) - expiration date&time of cookie
          - max-age (int) - cookie lifetime in seconds (alternative for expires option)
          - secure (bool) - if true, cookie will be available only for HTTPS.
                            IT CAN'T BE FALSE
          - samesite (str) - XSRF protection setting.
                             Can be strict or lax
                             Read https://web.dev/samesite-cookies-explained/ for details
          - httpOnly (bool) - if true, cookie won't be available for using in JavaScript
                              IT CAN'T BE FALSE
        */
    if (!name) {
      return;
    }

    if (options.expires instanceof Date) {
      options.expires = options.expires.toUTCString();
    }

    if (value instanceof Object) {
      value = JSON.stringify(value);
    }
    let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    for (const optionKey in options) {
      if (options.hasOwnProperty(optionKey)) {
        updatedCookie += '; ' + optionKey;
        const optionValue = options[optionKey];
        if (optionValue !== true) {
          updatedCookie += '=' + optionValue;
        }
      }
    }
    document.cookie = updatedCookie;
  }

  public static deleteCookie(name: string) {
    this.setCookie(name, null, {
      expires: new Date(),
      path: '/',
    });
  }
}
