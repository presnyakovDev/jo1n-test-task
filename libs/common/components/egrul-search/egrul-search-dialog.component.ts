/* eslint-disable */
import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Company } from '@mc/core';

import { EgrulRecord } from './egrul-record.model';
import { EgrulApiService } from './egrul-api.service';

@Component({
  selector: 'mc-egrul-search-dialog',
  templateUrl: './egrul-search-dialog.component.html',
  styleUrls: ['./egrul-search-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EgrulApiService],
})
export class McEgrulSearchDialogComponent implements OnInit, OnDestroy {
  query: string;
  items = new Array<EgrulRecord>();
  selected: EgrulRecord;

  company: Company;

  autoSelect: boolean;

  constructor(
    public dialogRef: MatDialogRef<McEgrulSearchDialogComponent>,
    private egrulApiService: EgrulApiService,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {
    this.company = data.item;
    this.autoSelect = data.autoSelect;
    this.query = this.company.code || this.company.caption;
  }

  handleKeyDown(event: any) {
    if (event.keyCode === 13) {
      this.findBtn(true);
    }
  }

  findBtn(noAutoSelect = false) {
    this.egrulApiService.findByQuery(this.query).then(result => {
      this.items = result;
      if (this.items.length) {
        this.selected = this.items[0];
        if (!noAutoSelect && this.autoSelect && this.items.length === 1) {
          this.importBtn();
        }
      }
    });
  }

  importBtn() {
    const updatedCompany = new Company(this.company);

    updatedCompany.code = this.selected.inn;
    updatedCompany.caption = this.selected.shortName;
    updatedCompany.crmSettings.kpp = this.selected.kpp;
    updatedCompany.crmSettings.egrulShortName = this.selected.shortName;
    updatedCompany.crmSettings.egrulLegalName = this.selected.fullName;
    updatedCompany.crmSettings.egrulLegalForm = this.selected.opf;
    updatedCompany.crmSettings.egrulLegalAddress = this.selected.address;
    updatedCompany.crmSettings.egrulOgrn = this.selected.ogrn;
    updatedCompany.crmSettings.egrulRegDate = this.selected.ogrnDate;
    updatedCompany.crmSettings.egrulOkato = this.selected.okato;

    updatedCompany.crmSettings.egrulAuthorizedPersonFullName = this.selected.directorFIO;
    updatedCompany.crmSettings.egrulAuthorizedPersonPosition = this.selected.directorPos;

    const person = this.selected.inn.length === 12;
    if (!person) {
      updatedCompany.crmSettings.egrulLegalAddress = this.selected.address;
    }

    this.dialogRef.close(updatedCompany);
  }

  ngOnInit() {
    if (this.query) {
      this.findBtn();
    }
  }

  ngOnDestroy() {}

  exit() {
    this.dialogRef.close();
  }
}
