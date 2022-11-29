/* eslint-disable */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { McShowInfoDialogComponent } from './show-info.component';

@NgModule({
  declarations: [McShowInfoDialogComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    TranslateModule.forChild(),
  ],
  entryComponents: [McShowInfoDialogComponent],
  exports: [McShowInfoDialogComponent],
})
export class McShowInfoDialogModule {}
