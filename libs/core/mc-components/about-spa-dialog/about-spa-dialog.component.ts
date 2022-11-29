/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { McBrowserService } from '../../mc-services/browser.service';
import { McAppConfig } from '../../mc-services/app-config.service';
import { McUtils } from '../../mc-utils';

@Component({
  selector: 'mc-about-spa-dialog',
  templateUrl: './about-spa-dialog.component.html',
  styleUrls: ['./about-spa-dialog.component.scss'],
  providers: [McBrowserService],
})
export class McAboutSpaDialogComponent implements OnInit {
  public spaVersion: string;
  public browser: string;
  public browserWindowSize: string;
  public screenSize: string;
  public os: string;

  constructor(
    public dialogRef: MatDialogRef<McAboutSpaDialogComponent>,
    private browserService: McBrowserService,
    private appCofig: McAppConfig
  ) {}

  ngOnInit() {
    const browserInfo = this.browserService.getBrowserInfo();
    this.spaVersion = this.appCofig.get('spa-version');
    this.os = browserInfo.os;
    this.browser = McUtils.ucf(browserInfo.name) + ' ' + browserInfo.fullVersion;
    this.browserWindowSize = '' + window.innerWidth + 'x' + window.innerHeight;
    this.screenSize = '' + window.screen.width + 'x' + window.screen.height;
  }
}
