/* eslint-disable */
import { NgModule } from '@angular/core';
import { MaterialModule } from '../../../core/modules/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FuseNavigationComponent } from './navigation.component';
import { FuseNavVerticalItemComponent } from './vertical/nav-item/nav-vertical-item.component';
import { McNavVerticalButtonComponent } from './vertical/nav-button/nav-vertical-button.component';
import { FuseNavVerticalCollapseComponent } from './vertical/nav-collapse/nav-vertical-collapse.component';
import { FuseNavVerticalGroupComponent } from './vertical/nav-group/nav-vertical-group.component';
import { McNavVerticalBonusComponent } from './vertical/nav-bonus/nav-vertical-bonus.component';
import { SharedModule } from '@mc/core';

@NgModule({
  imports: [CommonModule, RouterModule, MaterialModule, SharedModule],
  exports: [FuseNavigationComponent],
  declarations: [
    FuseNavigationComponent,
    FuseNavVerticalGroupComponent,
    FuseNavVerticalItemComponent,
    FuseNavVerticalCollapseComponent,
    McNavVerticalBonusComponent,
    McNavVerticalButtonComponent,
  ],
})
export class FuseNavigationModule {}
