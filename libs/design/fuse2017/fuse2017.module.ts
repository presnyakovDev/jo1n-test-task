/* eslint-disable */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../../core/modules/material.module';
import { SharedModule } from '../../core/modules/shared.module';
import { FuseContentComponent } from './content/content.component';
import { FuseMainComponent } from './main/main.component';
import { FuseNavbarVerticalToggleDirective } from './navbar/vertical/navbar-vertical-toggle.directive';
import { FuseNavbarVerticalService } from './navbar/vertical/navbar-vertical.service';
import { FuseNavbarVerticalComponent } from './navbar/vertical/navbar-vertical.component';
import { FuseNavigationModule } from './navigation/navigation.module';
import { FuseToolbarComponent } from './toolbar/toolbar.component';
import { FuseUserMenuComponent } from './user-menu/user-menu.component';
import { FuseLanguageMenuComponent } from './language-menu/language-menu.component';
import { FuseItemSelectDialogComponent } from './item-select-dialog/item-select-dialog.component';

@NgModule({
  declarations: [
    FuseToolbarComponent,
    FuseUserMenuComponent,
    FuseMainComponent,
    FuseContentComponent,
    FuseNavbarVerticalToggleDirective,
    FuseNavbarVerticalComponent,
    FuseLanguageMenuComponent,
    FuseItemSelectDialogComponent,
  ],
  imports: [CommonModule, RouterModule, MaterialModule, SharedModule, FuseNavigationModule],
  exports: [FuseMainComponent, FuseUserMenuComponent, FuseItemSelectDialogComponent],
  providers: [FuseNavbarVerticalService],
})
export class Fuse2017Module {}
