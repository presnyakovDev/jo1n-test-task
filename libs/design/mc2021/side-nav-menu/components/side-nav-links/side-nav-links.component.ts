/* eslint-disable */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationStart, Router, Event as NavigationEvent } from '@angular/router';

@Component({
  selector: 'mc-2021-side-nav-links',
  templateUrl: './side-nav-links.component.html',
  styleUrls: ['./side-nav-links.component.scss'],
})
export class Mc2021SideNavLinksComponent {
  @Input()
  public links = [];

  @Input()
  public isOpenedMenu = false;

  @Input()
  public showMenuCategories = false;

  @Input()
  public isLaptop = false;

  @Output()
  public onClickLink = new EventEmitter();

  public currentUrl: string;

  constructor(private router: Router) {
    this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        setTimeout(() => {
          this.currentUrl = event.url.split('?')[0];
        }, 0);
      }
    });
  }

  public clickLink() {
    this.onClickLink.emit();
  }
}
