/* eslint-disable */
import { NgModule } from '@angular/core';

import { FioPipe } from './fio.pipe';
import { EllipsisPipe } from './ellipsis.pipe';
import { ErrorTranslatePipe } from './error-translate.pipe';

@NgModule({
  declarations: [FioPipe, EllipsisPipe, ErrorTranslatePipe],
  imports: [],
  exports: [FioPipe, EllipsisPipe, ErrorTranslatePipe],
})
export class FusePipesModule {}
