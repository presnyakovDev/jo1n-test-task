import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export interface SideNavLink {
  icon: string;
  url: string;
  translationKey: string;
  title: string;
  badge?: any;
  id: string;
  type: string;
}

export interface ExpandedState {
  [p: string]: boolean;
}

export const localStorageMenuStateKey = 'menu-expanded-state';

@Component({
  selector: 'mc-2022-side-nav-expansion-panel',
  templateUrl: './side-nav-expansion-panel.component.html',
  styleUrls: ['./side-nav-expansion-panel.component.scss'],
})
export class Mc2022SideNavExpansionPanelComponent implements OnInit {
  @Input() icon: string;
  @Input() title: string;
  @Input() children: SideNavLink[];
  @Input() isLaptop: boolean;
  @Input() isOpenedMenu: boolean;
  @Input() expandedState: ExpandedState | null;
  @Output() expandedStateChange = new EventEmitter();

  currentUrl$: Observable<string>;
  private _expanded = false;

  constructor(private router: Router) {}

  set expanded(e) {
    this._expanded = e;
    this.setExpandedState(e);
  }
  get expanded() {
    return this._expanded;
  }

  private onRouterEvents() {
    this.currentUrl$ = this.router.events.pipe(
      filter(event => event instanceof NavigationStart),
      map((event: NavigationStart) => event.url.split('?')[0]),
      tap(url => {
        if (this.children.some(child => child.url === url)) {
          this.expanded = true;
        }
      }),
    );
  }

  setExpandedState(expanded: boolean) {
    if (!this.expandedState) {
      this.expandedState = {};
    }
    if (expanded) {
      this.expandedState[this.title] = expanded;
    } else {
      delete this.expandedState[this.title];
    }
    this.expandedStateChange.emit(this.expandedState);
  }

  private getExpandedState() {
    this._expanded = !!this.expandedState?.[this.title];
  }

  ngOnInit() {
    this.getExpandedState();
    this.onRouterEvents();
  }
}
