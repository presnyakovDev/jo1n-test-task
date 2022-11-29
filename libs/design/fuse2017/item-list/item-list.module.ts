/* eslint-disable */
import { NgModule } from '@angular/core';

import { SharedModule } from '@mc/core';
import { Fuse2017Module } from '../fuse2017.module';
import { McItemListComponent } from './item-list.component';
import { McItemListHeaderComponent } from './list-header/list-header.component';
import { McItemListSidenavComponent } from './list-sidenav/list-sidenav.component';
import { McListSettingsDialogComponent } from './list-settings-dialog/list-settings-dialog.component';
import { McItemListCustomCellComponent } from './list-custom-cell/list-custom-cell.component';

@NgModule({
  declarations: [
    McItemListComponent,
    McItemListHeaderComponent,
    McItemListSidenavComponent,
    McListSettingsDialogComponent,
    McItemListCustomCellComponent,
  ],
  imports: [SharedModule, Fuse2017Module],
  providers: [],
  exports: [McItemListComponent],
})
export class McItemListModule {}
