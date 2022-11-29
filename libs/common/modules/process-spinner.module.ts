/* eslint-disable */
import { NgModule } from '@angular/core';

import { SharedModule } from '@mc/core';

import { McProcessSpinnerComponent } from '../components/process-spinner/process-spinner.component';

@NgModule({
  declarations: [McProcessSpinnerComponent],
  imports: [SharedModule],
  providers: [],
  exports: [McProcessSpinnerComponent],
})
export class McProcessSpinnerModule {}
