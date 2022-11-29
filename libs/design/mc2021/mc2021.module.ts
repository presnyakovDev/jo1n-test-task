/* eslint-disable */
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@mc/core';
import { MaterialModule } from '@mc/core/modules/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { Mc2021ChangePasswordDialogComponent } from './change-password-dialog';
import { Mc2021FormStepperComponent } from './form-stepper/form-stepper.component';
import { Mc2021LanguageMenuComponent } from './language-menu';
import { Mc2021MainContainerComponent } from './main-container';
import { Mc2021PointSelectComponent, Mc2021PointSelectDialogComponent } from './point-select';
import { PointSelectControlComponent } from './point-select/point-select-control/point-select-control.component';
import { Mc2021ShowAlertDialogComponent } from './show-alert/show-alert.component';
import { Mc2021SupportContactsComponent } from './support-contacts';
import { Mc2021ToolbarComponent } from './toolbar';
import { Mc2021UserMenuComponent } from './user-menu';
import { Mc2022SideNavMenuModule } from '@mc/design/mc2021/side-nav-menu/side-nav-menu.module';

@NgModule({
  declarations: [
    Mc2021ToolbarComponent,
    Mc2021UserMenuComponent,
    Mc2021SupportContactsComponent,
    Mc2021PointSelectComponent,
    Mc2021MainContainerComponent,
    Mc2021LanguageMenuComponent,
    Mc2021FormStepperComponent,
    Mc2021ChangePasswordDialogComponent,
    Mc2021ShowAlertDialogComponent,
    Mc2021PointSelectDialogComponent,
    PointSelectControlComponent,
  ],
  imports: [
    Mc2022SideNavMenuModule,
    MaterialModule,
    CommonModule,
    SharedModule,
    RouterModule,
    TranslateModule,
    ScrollingModule,
    ReactiveFormsModule,
  ],
  exports: [
    Mc2021MainContainerComponent,
    Mc2021FormStepperComponent,
    Mc2021SupportContactsComponent,
    Mc2021LanguageMenuComponent,
  ],
  providers: [],
})
export class Mc2021Module {}
