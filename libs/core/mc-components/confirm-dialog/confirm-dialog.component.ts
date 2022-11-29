/* eslint-disable */
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { McTranslateService } from '../../mc-services/mc-translate.service';

@Component({
  selector: 'fuse-confirm-dialog',
  styleUrls: ['./confirm-dialog.component.scss'],
  templateUrl: './confirm-dialog.component.html',
})
export class FuseConfirmDialogComponent {
  public title = this.translateService.instant('COMMON.CONFIRMATION_REQUIRED');
  public confirmMessage: string;
  public confirmBigText: string;
  public confirmButtonText = this.translateService.instant('COMMON.CONFIRM');
  public cancelButtonText = this.translateService.instant('COMMON.CANCEL');
  public messages: string[] = [];
  public showWarnMessage = false;

  constructor(
    public dialogRef: MatDialogRef<FuseConfirmDialogComponent>,
    private translateService: McTranslateService,
  ) {}
}
