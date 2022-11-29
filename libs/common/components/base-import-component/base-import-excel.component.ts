/* eslint-disable */
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { McAlertService } from '@mc/core';
import { ExcelService } from './services';

export interface SpecsForBaseImportExcelComponent {
  titleUtil: string;
  tableColumns: { name: string; header: string; required: boolean; description: string }[];
  importRowCallback: (rowObject: any) => Promise<void>;
  generateErrorTextForSkippedRow: (rowTable: any, error: object | string) => string;
}

@Component({
  selector: 'mc-base-import-excel',
  templateUrl: './base-import-excel.component.html',
  styleUrls: ['./base-import-excel.component.scss'],
})
export class BaseImportExcelComponent implements OnInit {
  @Input()
  public specs: SpecsForBaseImportExcelComponent;

  public title: string;

  public tableColumns: { name: string; header: string; required: boolean; description: string }[];

  public allRowsTables: any[];

  public rowsTablesWithPagination = undefined;

  public displayedColumns = [];

  public paginationSizeOptions: number[] = [5, 10, 25, 100];

  public defaultPaginationSize = 10;

  public inputFileControl: FormControl;

  public fileName: string;

  public loading = false;

  public valueProgressBar = 0;

  public importRowCallback: (rowTable: any) => Promise<void>;

  public generateErrorTextForSkippedRow: (rowTable: any, error: object | string) => string;

  constructor(public excelService: ExcelService, public alertService?: McAlertService) {
    this.inputFileControl = new FormControl(null);
  }

  public ngOnInit() {
    const { titleUtil, tableColumns, importRowCallback, generateErrorTextForSkippedRow } = this.specs;
    this.title = titleUtil;
    this.importRowCallback = importRowCallback;
    this.tableColumns = tableColumns;
    this.displayedColumns = tableColumns.map(({ name }) => name);
    this.generateErrorTextForSkippedRow = generateErrorTextForSkippedRow;
  }

  public getRowsTableFromExcelTable(files: File[]) {
    const file = files[0];
    if (file) {
      this.inputFileControl.setValue(null);
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e: any) => {
        this.fileName = file.name;
        const bstr: string = e.target.result;
        const workSheet = this.excelService.getWorkSheet(bstr);
        const requiredColumns = this.tableColumns.filter(({ required }) => required).map(({ name }) => name);

        const rowSelecter = (row: object) => this.excelService.baseRowSelecter(row, { requiredColumns });
        this.allRowsTables = this.excelService.getRowsForTable(workSheet, rowSelecter);
        this.rowsTablesWithPagination = this.allRowsTables.slice(0, this.defaultPaginationSize);
      };
    }
  }

  public changePage({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }) {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    this.rowsTablesWithPagination = this.allRowsTables.slice(start, end);
  }

  public async onClickSendData() {
    this.loading = true;
    const errorsSkippedRows = [];
    let iterateIndex = 0;

    for (const rowTable of this.allRowsTables) {
      iterateIndex += 1;
      try {
        await this.importRowCallback(rowTable);
      } catch (error) {
        let objectError: { status: number; errorMessage: string };
        if (typeof error === 'object') {
          objectError =
            'error' in error
              ? { errorMessage: error.error.errorMessage, status: error.status }
              : { status: 0, errorMessage: error.message };
        } else if (typeof error === 'string') {
          objectError = { status: 0, errorMessage: error };
        }
        const errorSkippedRow = this.generateErrorTextForSkippedRow(rowTable, objectError);
        errorsSkippedRows.push(errorSkippedRow);
      }
      this.valueProgressBar = (iterateIndex * 100) / this.allRowsTables.length;
    }

    this.loading = false;

    if (errorsSkippedRows.length) {
      let html = '';
      errorsSkippedRows.forEach((errorSkippedRow: string) => {
        html += errorSkippedRow;
      });

      this.alertService.alertHtml('При загрузке произошли следующие ошибки', html);
    } else {
      this.alertService.infoSimple('Загрузка кодов успешно завершена', [
        `Загружено кодов: ${this.allRowsTables.length}`,
      ]);
    }

    this.initDefaultState();
  }

  public initDefaultState() {
    this.fileName = '';
    this.rowsTablesWithPagination = [];
    this.allRowsTables = [];
  }
}
