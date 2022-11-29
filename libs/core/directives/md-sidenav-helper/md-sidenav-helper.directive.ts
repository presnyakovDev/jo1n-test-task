/* eslint-disable */
import { Directive, Input, OnInit, HostListener, OnDestroy, HostBinding } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FuseMdSidenavHelperService } from './md-sidenav-helper.service';
import { FuseMatchMedia } from '../../services/match-media.service';
import { MediaObserver } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[fuseMdSidenavHelper]',
})
export class FuseMdSidenavHelperDirective implements OnInit, OnDestroy {
  matchMediaSubscription: Subscription;

  @HostBinding('class.md-is-locked-open') isLockedOpen = true;
  @HostBinding('class.md-stop-transition') stopTransition = true;

  @Input('fuseMdSidenavHelper') id: string;
  @Input('md-is-locked-open') mdIsLockedOpenBreakpoint: string;

  constructor(
    private fuseMdSidenavService: FuseMdSidenavHelperService,
    private fuseMatchMedia: FuseMatchMedia,
    private observableMedia: MediaObserver,
    private mdSidenav: MatSidenav
  ) {}

  ngOnInit() {
    this.fuseMdSidenavService.setSidenav(this.id, this.mdSidenav);

    if (this.observableMedia.isActive(this.mdIsLockedOpenBreakpoint)) {
      setTimeout(() => {
        this.isLockedOpen = true;
        this.mdSidenav.mode = 'side';
        this.mdSidenav.open();
      });
      this.stopTransition = false;
    } else {
      setTimeout(() => {
        this.isLockedOpen = false;
        this.mdSidenav.mode = 'over';
        this.mdSidenav.close();
      });

      setTimeout(() => {
        this.stopTransition = false;
      }, 3000);
    }

    this.matchMediaSubscription = this.fuseMatchMedia.onMediaChange.subscribe(() => {
      if (this.observableMedia.isActive(this.mdIsLockedOpenBreakpoint)) {
        setTimeout(() => {
          this.isLockedOpen = true;
          this.mdSidenav.mode = 'side';
          this.mdSidenav.open();
        });
      } else {
        setTimeout(() => {
          this.isLockedOpen = false;
          this.mdSidenav.mode = 'over';
          this.mdSidenav.close();
        });
      }
    });
  }

  ngOnDestroy() {
    this.matchMediaSubscription.unsubscribe();
  }
}

@Directive({
  selector: '[fuseMdSidenavToggler]',
})
export class FuseMdSidenavTogglerDirective {
  @Input('fuseMdSidenavToggler') id;

  constructor(private fuseMdSidenavService: FuseMdSidenavHelperService) {}

  @HostListener('click')
  onClick() {
    this.fuseMdSidenavService.getSidenav(this.id).toggle();
  }
}
