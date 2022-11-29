/* eslint-disable */
import { NgModule } from '@angular/core';

import { SharedModule } from '@mc/core';
import { McFormStepperComponent } from '../components/form-stepper/form-stepper.component';

@NgModule({
  declarations: [McFormStepperComponent],
  imports: [SharedModule],
  exports: [McFormStepperComponent],
})
export class McFormStepperModule {}
