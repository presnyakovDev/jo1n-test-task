/* eslint-disable */
import { KladrAddress } from '@mc/core';

export class EgrulRecord {
  id: string;
  inn: string;
  kpp: string;
  fullName: string;
  shortName: string;
  ogrn: string;
  ogrnDate: string;
  opf: string;
  address: string;
  addressEgrul: string;
  directorFIO: string;
  directorPos: string;
  issueOrg: string;
  issuePlace: string;
  okpo: string;
  okato: string;
  okved: string;

  kladr: KladrAddress;

  constructor(item) {
    {
      this.id = item.id;
      this.inn = item.inn;
      this.kpp = item.kpp;
      this.okato = item.okato;
      this.okpo = item.okpo;
      this.opf = item.opf;
      this.ogrn = item.ogrn;
      this.fullName = item.fullName;
      this.shortName = item.shortName;
      this.ogrnDate = item.ogrnDate;
      this.directorFIO = item.directorFIO || '';
      this.directorPos = item.directorPos || '';
      this.address = item.address || '';
      this.addressEgrul = item.addressEgrul || '';
      this.kladr = item.kladr || null;
      this.okved = item.okved || null;
    }
  }
}
