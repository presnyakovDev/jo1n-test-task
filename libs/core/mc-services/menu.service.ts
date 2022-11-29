/* eslint-disable */
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { NavItemBadge } from '@mc/design/fuse2017';

@Injectable({
  providedIn: 'root',
})
export class McMenuService {
  static menu: MenuItem[] = [];
  static onMenuChange = new BehaviorSubject<MenuItem[]>([]);

  addMenuItem(item: MenuItem) {
    if (item.type === 'group') {
      const existingItem = McMenuService.menu.find(
        menuItem =>
          menuItem.type === 'group' && menuItem.title === item.title && this.checkForSameRoles(item, menuItem),
      );

      if (existingItem) {
        existingItem.children.push(...item.children);
        McMenuService.onMenuChange.next(McMenuService.menu);

        return;
      }
    }

    item.position = item.position || 0;
    McMenuService.menu.push(item);
    McMenuService.menu = McMenuService.menu.sort((a, b) => a.position - b.position);
    McMenuService.onMenuChange.next(McMenuService.menu);
  }

  private checkForSameRoles(itemA: MenuItem, itemB: MenuItem): boolean {
    if (!((itemA.restrictToRoles && itemB.restrictToRoles) || (!itemA.restrictToRoles && !itemB.restrictToRoles))) {
      return false;
    }
    if (
      !(
        (itemA.restrictToRolesAnd && itemB.restrictToRolesAnd) ||
        (!itemA.restrictToRolesAnd && !itemB.restrictToRolesAnd)
      )
    ) {
      return false;
    }
    if (itemA.restrictToRoles) {
      if (itemA.restrictToRoles.length !== itemB.restrictToRoles.length) {
        return false;
      }

      const size = new Set([...itemA.restrictToRoles, ...itemB.restrictToRoles]).size;

      if (itemA.restrictToRoles.length !== size || itemB.restrictToRoles.length !== size) {
        return false;
      }
    }
    if (itemA.restrictToRolesAnd) {
      if (itemA.restrictToRolesAnd.length !== itemB.restrictToRolesAnd.length) {
        return false;
      }

      const size = new Set([...itemA.restrictToRolesAnd, ...itemB.restrictToRolesAnd]).size;

      if (itemA.restrictToRolesAnd.length !== size || itemB.restrictToRolesAnd.length !== size) {
        return false;
      }
    }

    return true;
  }
}

export class MenuItem {
  translationKey?: string;
  title: string;
  type: 'button' | 'group' | 'item';
  id?: string;
  class?: string;
  icon?: string;
  onMobile?: 'HIDE' | 'ONLY' | null;
  restrictToRoles?: string[];
  restrictToRolesAnd?: string[];
  callback?: any;
  e2eClass?: string;
  url?: string;
  badge?: NavItemBadge;
  children?: MenuItem[];
  position?: number;
}
