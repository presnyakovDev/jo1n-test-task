/* eslint-disable */
import { NgModule } from '@angular/core';

import { SharedModule } from '@mc/core';
import { McEgrulSearchDialogComponent } from '../components/egrul-search/egrul-search-dialog.component';

@NgModule({
  declarations: [McEgrulSearchDialogComponent],
  imports: [SharedModule],
  exports: [McEgrulSearchDialogComponent],
})
export class McEgrulSearchModule {}
