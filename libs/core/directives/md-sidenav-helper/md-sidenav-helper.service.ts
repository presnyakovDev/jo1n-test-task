/* eslint-disable */
import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable()
export class FuseMdSidenavHelperService {
  sidenavInstances: MatSidenav[];

  constructor() {
    this.sidenavInstances = [];
  }

  setSidenav(id, instance) {
    this.sidenavInstances[id] = instance;
  }

  getSidenav(id) {
    return this.sidenavInstances[id];
  }
}
