/* eslint-disable */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { McBrowserService } from './browser.service';

@Injectable()
export class McAppInfoService {
  private mode_: AppMode;
  static onTitleChange: Subject<any> = new Subject();
  static onAppTitleBlockChange: Subject<AppTitleBlock> = new Subject();
  static onPointIdChange: BehaviorSubject<number> = new BehaviorSubject(null);
  onNotificationsListChange: BehaviorSubject<AppInfoNotificationBlock[]> = new BehaviorSubject([]);

  private list: AppInfoNotificationBlock[] = [];

  constructor(private browser: McBrowserService) {
    this.mode_ = 'DESKTOP';
    if (this.browser.isMobile()) {
      this.mode_ = 'MOBILE';
      if (location.href.includes('/mobileScans/')) {
        this.mode_ = 'MOBILE_ATTACHES';
      }
    }
  }

  getMode(): AppMode {
    return this.mode_;
  }

  setTitle(title: string) {
    McAppInfoService.onTitleChange.next(title);
  }

  setPointId(value: number) {
    McAppInfoService.onPointIdChange.next(value);
  }

  setNotificationItem(item: AppInfoNotificationBlock, active: boolean) {
    this.removeNotificationItem(item);
    if (active) {
      this.addNotificationItem(item);
    }
  }

  addNotificationItem(item: AppInfoNotificationBlock) {
    if (!this.list.find(elem => item.code === elem.code)) {
      this.list.push(item);
      this.list.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'danger' ? -1 : 1;
        }
        return 0;
      });

      this.onNotificationsListChange.next(this.list);
    }
  }

  removeNotificationItem(item: AppInfoNotificationBlock) {
    if (this.list.find(elem => item.code === elem.code)) {
      this.list = this.list.filter(elem => elem.code !== item.code);
      this.onNotificationsListChange.next(this.list);
    }
  }

  setAppTitleBlock(titleBlock: AppTitleBlock) {
    McAppInfoService.onAppTitleBlockChange.next(titleBlock);
  }
}

export class AppInfoNotificationBlock {
  type: 'danger' | 'info';
  code: string;
  title: string;
  imageUrl: string;
  beforeLink: string;
  link: string;
  afterLink: string;
  path: string;
  canClose = true;
  show = true;
  notificationBodyInOneString: boolean;
  callback: () => {};
  onClose: () => {};

  constructor(item) {
    this.type = item.type || 'danger';
    this.code = item.code;
    this.title = item.title;
    this.imageUrl = item.imageUrl;
    this.beforeLink = item.beforeLink;
    this.afterLink = item.afterLink;
    this.link = item.link;
    this.path = item.path;
    this.notificationBodyInOneString = item.notificationBodyInOneString;
    this.callback = item.callback;
    this.onClose = item.onClose;
    if (item.canClose !== undefined) {
      this.canClose = item.canClose;
    }
  }
}

export type AppMode = 'DESKTOP' | 'MOBILE' | 'MOBILE_ATTACHES';

export class AppTitleBlock {
  title: string;
  subTitle: string;
  onClick = () => {};

  constructor(item) {
    this.title = item.title;
    this.subTitle = item.subTitle;
    this.onClick = item.onClick;
  }
}
