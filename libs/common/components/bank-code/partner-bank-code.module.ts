/* eslint-disable */
import { NgModule } from '@angular/core';

import { SharedModule } from '@mc/core';
import { McPartnerBankCodesItemComponent } from './bank-code.component';

@NgModule({
  declarations: [McPartnerBankCodesItemComponent],
  imports: [SharedModule],
  providers: [],
  exports: [McPartnerBankCodesItemComponent],
})
export class McPartnerBankCodeModule {}
