/* eslint-disable */
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { McAuthService } from './auth.service';
import { McBrowserService } from './browser.service';

@Injectable()
export class FuseNavigationService {
  onNavCollapseToggle = new EventEmitter<any>();
  onNavCollapseToggled = new EventEmitter<any>();
  onNavigationModelChange: BehaviorSubject<any> = new BehaviorSubject({});
  navigationModel: any = {};
  flatNavigation: any[] = [];

  showOnlyUrl: string;
  isMobile: boolean;

  constructor(private auth: McAuthService, private browser: McBrowserService) {
    this.navigationModel = { model: [] };
    this.isMobile = this.browser.isMobile();
    this.onNavigationModelChange.next([]);
    this.auth.onUserChanged.subscribe(user => {
      this.onNavigationModelChange.next(this.getNavigationModel());
    });
  }

  showOnly(url: string) {
    this.showOnlyUrl = url;
    this.onNavigationModelChange.next(this.getNavigationModel());
  }

  private getRestrictToRoles(item) {
    if (!item.restrictToRoles) {
      return true;
    }
    let allow = false;
    item.restrictToRoles.forEach(role => {
      const hasRole = this.auth.userHasRole(role);
      if (hasRole) {
        allow = true;
      }
    });
    if (!item.restrictToRolesAnd) {
      return allow;
    }
    let allow2 = false;
    item.restrictToRolesAnd.forEach(role => {
      const hasRole = this.auth.userHasRole(role);
      if (hasRole) {
        allow2 = true;
      }
    });
    return allow && allow2;
  }

  private getRestrictToMobile(item) {
    if (!item.onMobile) {
      return true;
    }
    if (item.onMobile === 'HIDE' && this.isMobile) {
      return false;
    }
    if (item.onMobile === 'ONLY' && !this.isMobile) {
      return false;
    }
    return true;
  }

  getRestrictions(item) {
    return this.getRestrictToMobile(item) && this.getRestrictToRoles(item);
  }

  /**
   * Get navigation model
   * @returns {any[]}
   */
  getNavigationModel() {
    if (this.showOnlyUrl) {
      let model0: any = null;
      this.navigationModel.model.forEach(section => {
        section.children.forEach(item => {
          if (item.url === this.showOnlyUrl) {
            section.children = [item];
            model0 = [section];
          }
        });
      });
      if (model0) {
        return model0;
      }
    }

    const model = this.navigationModel.model
      .filter(section => {
        return this.getRestrictions(section);
      })
      .map(section => {
        return Object.assign({}, section);
      });
    model.forEach(section => {
      if (!section.children) {
        return;
      }
      section.children = section.children.filter(item => this.getRestrictions(item));
    });

    return model.filter(item => {
      if (item.type === 'group' && item.children && item.children.length === 0) {
        return false;
      }
      return true;
    });
  }

  /**
   * Set the navigation model
   * @param model
   */
  setNavigationModel(model) {
    this.navigationModel = model;

    this.onNavigationModelChange.next(this.getNavigationModel());
  }

  /**
   * Get flattened navigation array
   * @param navigationItems
   * @returns {any[]}
   */
  getFlatNavigation(navigationItems?) {
    if (!navigationItems) {
      navigationItems = this.getNavigationModel();
    }

    for (const navItem of navigationItems) {
      if (navItem.type === 'subheader') {
        continue;
      }

      if (navItem.type === 'item') {
        this.flatNavigation.push({
          title: navItem.title,
          type: navItem.type,
          icon: navItem.icon || false,
          url: navItem.url,
        });

        continue;
      }

      if (navItem.type === 'collapse' || navItem.type === 'group') {
        this.getFlatNavigation(navItem.children);
      }
    }

    return this.flatNavigation;
  }
}
