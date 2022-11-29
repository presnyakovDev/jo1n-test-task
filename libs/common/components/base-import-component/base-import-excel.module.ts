/* eslint-disable */
import { NgModule } from '@angular/core';
import { SharedModule } from '@mc/core';
import { BaseImportExcelComponent } from './base-import-excel.component';
import { ExcelService } from './services/excel.service';

@NgModule({
  imports: [SharedModule],
  declarations: [BaseImportExcelComponent],
  exports: [BaseImportExcelComponent],
})
export class BaseImportExcelModule {}
