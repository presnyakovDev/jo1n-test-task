/* eslint-disable */
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx/dist/xlsx.mini.min';

import { McUtils } from './mc-utils';

export class ReportsCommon {
  public static saveReport(reportData: any, reportFileName: string, pageTitle?: string) {
    /* generate worksheet */
    const wsReport: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(reportData);
    wsReport['!cols'] = McUtils.calcColsWidths(reportData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsReport, pageTitle || 'Detalization');

    /* save to file */
    const wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'binary' };
    const wbout: string = XLSX.write(wb, wopts);
    const reportFile = new File([McUtils.s2ab(wbout)], reportFileName);
    saveAs(reportFile);
  }
}
