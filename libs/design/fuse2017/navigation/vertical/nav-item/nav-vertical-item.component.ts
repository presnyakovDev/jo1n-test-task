/* eslint-disable */
import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { NavItemBadge } from '../../nav-item-badge';

@Component({
  selector: 'fuse-nav-vertical-item',
  templateUrl: './nav-vertical-item.component.html',
  styleUrls: ['./nav-vertical-item.component.scss'],
})
export class FuseNavVerticalItemComponent implements OnInit {
  @HostBinding('class') classes = 'nav-item';
  @Input() item: any;

  constructor() {}

  ngOnInit() {}

  setItemStyle(item: { badge?: NavItemBadge }) {
    if (!item.badge) {
      return;
    }

    const styleObject = {};
    if (item.badge.itemBackgroundColor) {
      styleObject['background-color'] = item.badge.itemBackgroundColor;
    }

    return styleObject;
  }

  setBadgeStyle(item: { badge?: NavItemBadge }) {
    if (!item.badge) {
      return;
    }

    const styleObject = {};
    if (item.badge.backgroundColor) {
      styleObject['background-color'] = item.badge.backgroundColor;
    }
    if (item.badge.color) {
      styleObject['color'] = item.badge.color;
    }
    if (item.badge.fontSize) {
      styleObject['font-size'] = item.badge.fontSize;
    }
    if (item.badge.fontWeight) {
      styleObject['font-weight'] = item.badge.fontWeight;
    }

    return styleObject;
  }
}
