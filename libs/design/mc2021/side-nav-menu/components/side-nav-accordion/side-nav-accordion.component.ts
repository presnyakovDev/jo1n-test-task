import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { FuseNavigationService, McAuthService } from '@mc/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ExpandedState,
  localStorageMenuStateKey,
} from '@mc/design/mc2021/side-nav-menu/components/side-nav-expansion-panel/side-nav-expansion-panel.component';

@Component({
  selector: 'mc2022-side-nav-accordion',
  templateUrl: './side-nav-accordion.component.html',
  styleUrls: ['./side-nav-accordion.component.scss'],
})
export class Mc2022SideNavAccordionComponent implements OnInit {
  @Input() isLaptop: boolean;
  @Input() isOpenedMenu: boolean;
  @Output() closeMenu = new EventEmitter();

  menuItems$: Observable<any[]>;
  private userName = this.auth.getUsername();
  private expandedStates: { [p: string]: ExpandedState };

  constructor(private fuseNavigationService: FuseNavigationService, private auth: McAuthService) {
    this.setMenuItems();
  }

  setMenuItems() {
    this.menuItems$ = this.fuseNavigationService.onNavigationModelChange.pipe(map(this.filterMenuItems.bind(this)));
  }

  private filterMenuItems(items: any[]) {
    items.forEach(item => {
      item.children = (<any[]>item.children)?.filter(child => child.type === 'item');
    });
    return items.filter(item => item.type === 'group' && item.children?.length);
  }

  @HostListener('click', ['$event']) click(event: any) {
    if (event.target.closest('.nav-link') && !this.isLaptop) {
      this.closeMenu.emit();
    }
  }

  get userExpandedState() {
    const expandedStatesJson = localStorage.getItem(localStorageMenuStateKey);
    const expandedStates = expandedStatesJson ? JSON.parse(expandedStatesJson) : null;
    this.expandedStates = expandedStates;
    return expandedStates ? expandedStates[this.userName] || null : null;
  }

  set userExpandedState(s: ExpandedState | null) {
    if (s) {
      if (!this.expandedStates) {
        this.expandedStates = {};
      }
      this.expandedStates[this.userName] = s;
      if (!Object.keys(this.expandedStates[this.userName]).length) {
        delete this.expandedStates[this.userName];
      }
      if (Object.keys(this.expandedStates).length) {
        localStorage.setItem(localStorageMenuStateKey, JSON.stringify(this.expandedStates));
      } else {
        localStorage.removeItem(localStorageMenuStateKey);
      }
    }
  }

  ngOnInit(): void {}
}
