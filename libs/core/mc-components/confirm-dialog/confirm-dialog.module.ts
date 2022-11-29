/* eslint-disable */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { FuseConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
  declarations: [FuseConfirmDialogComponent],
  imports: [CommonModule, FlexLayoutModule, MatDialogModule, MatButtonModule],
  exports: [FuseConfirmDialogComponent],
})
export class FuseConfirmDialogModule {}
