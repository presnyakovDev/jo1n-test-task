/* eslint-disable */
import { detect } from 'detect-browser';
import { Injectable } from '@angular/core';

import { McAlertService } from './alert.service';
import { McUtils } from '../mc-utils';

@Injectable()
export class McBrowserService {
  browserInfo = {
    name: 'Unknown browser',
    fullVersion: '1.00',
    version: 1,
    os: 'Unknown OS',
    isMobile: false,
  };

  compatibleBrowsers = [
    { name: 'chrome', fullName: 'Chrome', minVersion: 49 },
    { name: 'firefox', fullName: 'Firefox', minVersion: 52 },
    { name: 'ios', fullName: 'Ios', minVersion: 10 },
    { name: 'crios', fullName: 'Chrome(iOS)', minVersion: 49 },
  ];

  constructor(private alertService: McAlertService) {
    const browser = detect();

    // handle the case where we don't detect the browser
    if (browser) {
      let majorVersion = browser.version;
      if (majorVersion.indexOf('.') > 0) {
        majorVersion = majorVersion.slice(0, majorVersion.indexOf('.'));
      }
      this.browserInfo = {
        name: browser.name,
        fullVersion: browser.version,
        version: +majorVersion,
        os: browser.os,
        isMobile: this.isMobile(),
      };
    }
  }

  showIncompatibleBrowserAlert() {
    const browserInfo = this.getBrowserInfo();
    const yourBrowser = McUtils.ucf(browserInfo.name) + ' версия ' + browserInfo.fullVersion;
    const list = ['Ваш браузер: ' + yourBrowser];
    // list.push('Пожалуйста, установите один из следующих браузеров:');
    // this.browser.compatibleBrowsers.forEach(item => list.push('  - ' + item.fullName + ' версии ' + item.minVersion + ' или выше'));
    list.push('Пожалуйста, скачайте свежую версию Google Chrome');
    this.alertService.alert({
      errors: list,
      title: 'Поддержка вашего браузера не гарантируется!',
      yesButtonTitle: 'Скачать',
      confirmAction: () => {
        window.location.href = 'https://www.google.ru/intl/ru_ALL/chrome/';
      },
    });
  }

  isScreenSizeSameAsIPhone5() {
    const w = window.screen.width;
    const h = window.screen.height;
    if ((w === 320 && h === 568) || (h === 320 && w === 568)) {
      return true;
    }
  }

  isMobile() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return true;
    }
    return false;
  }

  getCompatibleBrowsers() {
    return this.compatibleBrowsers;
  }

  isBrowserCompatible(): boolean {
    let ok = false;
    this.compatibleBrowsers.forEach(item => {
      if (this.browserInfo.name === item.name) {
        if (this.browserInfo.version >= item.minVersion) {
          ok = true;
        }
      }
    });
    return ok;
  }

  getBrowserInfo() {
    return this.browserInfo;
  }

  isSrcObjectSupportBroken() {
    if (this.browserInfo.name === 'chrome' && this.browserInfo.version < 52) {
      return true;
    }
    return false;
  }
}
