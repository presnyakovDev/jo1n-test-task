/* eslint-disable */
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseNavigationService, McAlertService, McAuthService } from '@mc/core';

@Component({
  selector: 'mc-2021-side-nav-menu',
  templateUrl: './side-nav-menu.component.html',
  styleUrls: ['./side-nav-menu.component.scss'],
})
export class Mc2021SideNavMenuComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  public onResize(event: any) {
    this.isLaptop = event.target.innerWidth >= 1024 ? true : false;
    if (!this.isLaptop) {
      this.widthLogo = this.isFixedMenu || !this.isLaptop ? this.logo.widthOnHover : this.logo.width;
      this.heightLogo = this.isFixedMenu || !this.isLaptop ? this.logo.heightOnHover : this.logo.height;
      this.urlLogo = this.isFixedMenu || !this.isLaptop ? this.logo.urlOnHover : this.logo.url;
    }
  }

  @Input()
  public logo: any;

  @Input()
  public showMenuCategories = false;

  @Input()
  public isOpenMenu = false;

  @Output()
  public onCloseMenu = new EventEmitter<boolean>();

  @Output()
  public onFixedMenu = new EventEmitter<boolean>();

  public buttons = [];

  // public links = [];

  public isFixedMenu = true;

  public bonus: any;

  public widthLogo: string;

  public heightLogo: string;

  public urlLogo: string;

  public isLaptop = false;

  constructor(
    private fuseNavigationService: FuseNavigationService,
    public dialog: MatDialog,
    private alert: McAlertService,
    private auth: McAuthService,
  ) {}

  public ngOnInit(): void {
    this.isLaptop = window.innerWidth >= 1024 ? true : false;

    if (localStorage.getItem('isFixedMenu')) {
      this.isFixedMenu = JSON.parse(localStorage.getItem('isFixedMenu'));
    }

    this.widthLogo = this.isFixedMenu || !this.isLaptop ? this.logo.widthOnHover : this.logo.width;
    this.heightLogo = this.isFixedMenu || !this.isLaptop ? this.logo.heightOnHover : this.logo.height;
    this.urlLogo = this.isFixedMenu || !this.isLaptop ? this.logo.urlOnHover : this.logo.url;

    this.fuseNavigationService.onNavigationModelChange.pipe().subscribe(navigationModel => {
      const buttons = [];
      // const links = [];
      let bonus: object;

      navigationModel.forEach(groupItem => {
        // links.push(groupItem);
        if (groupItem.children) {
          groupItem.children.forEach(item => {
            if (item.type === 'button') {
              buttons.push(item);
              // } else if (item.type === 'item') {
              //   links.push(item);
            } else if (item.type === 'bonus') {
              bonus = { ...item };
            }
          });
        }
      });
      this.buttons = buttons;
      // this.links = links;
      this.bonus = bonus;
    });
  }

  public changeLogoStyle(event: MouseEvent) {
    if (!this.isFixedMenu && this.isLaptop) {
      this.isOpenMenu = event.type === 'mouseenter' ? true : false;
      this.widthLogo = event.type === 'mouseenter' ? this.logo.widthOnHover : this.logo.width;
      this.heightLogo = event.type === 'mouseenter' ? this.logo.heightOnHover : this.logo.height;
      this.urlLogo = '';
      this.urlLogo = event.type === 'mouseenter' ? this.logo.urlOnHover : this.logo.url;
    }
  }

  public fixedMenu() {
    this.isFixedMenu = !this.isFixedMenu;
    localStorage.setItem('isFixedMenu', JSON.stringify(this.isFixedMenu));
    this.onFixedMenu.emit(this.isFixedMenu);
  }

  public closeAmountRemuneration() {
    this.alert.alert({
      title: 'Скрыть начисления?',
      content: ['ВНИМАНИЕ! Включить отображение начислений можно будет в разделе "Агентское вознаграждение"'],
      confirmAction: () => {
        this.auth.storeFeatureRole('FEATURE_AV_WIDGET', false);
      },
    });
  }

  public closeMenu() {
    this.isOpenMenu = false;
    this.onCloseMenu.emit(false);
  }
}
