/* eslint-disable */
import { Injectable } from '@angular/core';

import { McAppConfig } from './app-config.service';

export type Permission = 'denied' | 'granted' | 'default';

@Injectable()
export class McNotificationService {
  readonly isSupported;
  private permission: Permission;

  constructor(private config: McAppConfig) {
    this.isSupported = 'Notification' in window;
    if (!config.get('do-not-ask-push-notifications') && !config.getEnv('e2e')) {
      this.requestPermission();
    }
  }

  requestPermission(): void {
    if (this.isSupported) {
      Notification.requestPermission(status => {
        return (this.permission = status);
      });
    }
  }

  create(title: string): any {
    if (this.permission === 'granted') {
      // tslint:disable-next-line:no-unused-expression
      new Notification('MC', {
        icon: '/assets/images/logos/mc2.png',
        body: title,
      });
    }
  }
}
