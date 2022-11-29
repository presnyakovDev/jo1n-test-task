/* eslint-disable */
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx/dist/xlsx.full.min';
@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  public getWorkSheet(workSheetInBinaryFormat: string) {
    const wb: XLSX.WorkBook = XLSX.read(workSheetInBinaryFormat, { type: 'binary' });
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];
    return ws;
  }

  public getRowsForTable(workSheet: XLSX.WorkSheet, rowSelecter?: (row: object) => boolean): object[] {
    const [headers, ...dataRows]: (string | number)[][] = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
    return dataRows.reduce((rows: object[], rowExcelTable) => {
      const row = {};
      rowExcelTable.forEach((cell: string | number, index) => (row[headers[index]] = cell.toString()));
      if (rowSelecter ? rowSelecter(row) : this.baseRowSelecter(row)) {
        rows.push(row);
      }

      return rows;
    }, []);
  }

  public baseRowSelecter(row: object, options: { requiredColumns: string[] } = { requiredColumns: [] }) {
    const { requiredColumns } = options;
    let isValidRow = true;
    if (requiredColumns.length > 0) {
      for (const requiredColumn of requiredColumns) {
        if (!(requiredColumn in row)) {
          isValidRow = false;
          break;
        }
      }
    }

    return isValidRow;
  }
}
