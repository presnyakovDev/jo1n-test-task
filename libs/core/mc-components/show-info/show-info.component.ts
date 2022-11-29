/* eslint-disable */
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mc-info-help',
  templateUrl: './show-info.component.html',
  styleUrls: ['./show-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class McShowInfoDialogComponent {
  title: string;
  htmlContent: string;
  accent: false;

  constructor(public dialogRef: MatDialogRef<McShowInfoDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any) {
    this.title = data.title;
    this.htmlContent = data.htmlContent;
    this.accent = data.accent;
  }

  exit() {
    this.dialogRef.close();
  }
}
