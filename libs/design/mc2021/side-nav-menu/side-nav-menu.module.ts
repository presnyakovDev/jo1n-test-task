import { NgModule } from '@angular/core';
import { Mc2021SideNavMenuComponent } from '@mc/design/mc2021/side-nav-menu/side-nav-menu.component';
import { Mc2022SideNavAccordionComponent } from '@mc/design/mc2021/side-nav-menu/components/side-nav-accordion/side-nav-accordion.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Mc2022SideNavExpansionPanelComponent } from './components/side-nav-expansion-panel/side-nav-expansion-panel.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [Mc2021SideNavMenuComponent, Mc2022SideNavAccordionComponent, Mc2022SideNavExpansionPanelComponent],
  exports: [Mc2021SideNavMenuComponent, Mc2022SideNavAccordionComponent],
  imports: [RouterModule, MatIconModule, CommonModule, TranslateModule, MatExpansionModule],
})
export class Mc2022SideNavMenuModule {}
