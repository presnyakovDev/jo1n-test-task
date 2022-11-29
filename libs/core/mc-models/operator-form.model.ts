/* eslint-disable */
import { KladrAddress } from './kladr-address.model';
import { Document } from './document.model';

export class OperatorForm {
  id: number;
  operatorId: number;
  lastName: string;
  firstName: string;
  secondName: string;
  birthDate: string;
  sexId: number;
  countryId: number;
  docnames: Document[];
  birthPlace: string;
  regAddress: KladrAddress;
  contactAddress: KladrAddress;
  homePhone: string;
  mobilePhone: string;
  email: string;
  snils: string;
  inn: string;

  contactAddressFromRegAddress: boolean;
  contactAddressFull: string;
  regAddressFull: string;
  noPrevDocnum: boolean;
  prevDocnum: string;
  oldFirstname: string;
  oldLastname: string;
  oldSecondname: string;

  public static getFieldNamesSplittedByFormParts(): any[] {
    return [
      {
        '*sectionTitle': 'Общая информация',
        firstName: 'Имя',
        lastName: 'Фамилия',
        secondName: 'Отчество',
        birthDate: 'Дата рождения',
        mobilePhone: 'Телефон мобильный',
        homePhone: 'Телефон домашний',
        email: 'E-mail',
        snils: 'СНИЛС',
        inn: 'ИНН',
        sexId: 'Пол',
      },
      {
        '*sectionTitle': 'Паспортные данные',
        docSeries: 'Серия',
        docNumber: 'Номер',
        docIssuerDate: 'Дата выдачи',
        docIssuerCode: 'Код подразделения',
        docIssuer: 'Кем выдан',
        birthPlace: 'Место рождения',
        countryId: 'Гражданство',
      },
      {
        '*sectionTitle': 'Предыдущий паспорт и ФИО',
        noPrevDocnum: 'Нет, либо старого образца',
        prevDocnum: 'Предыдущий паспорт - серия, номер',
        oldFirstname: 'Прежняя фамилия',
        oldLastname: 'Прежнее имя',
        oldSecondname: 'Прежнее отчество',
      },
      {
        '*sectionTitle': 'Адреса',
        contactAddressFromRegAddress: 'Фактическое проживание по адресу регистрации',
        regAddress: 'Адрес регистрации',
        regAddressFull: 'Адрес регистрации',
        contactAddress: 'Адрес проживания',
        contactAddressFull: 'Адрес проживания',
      },

      // next lines for errors handling
      {
        '*sectionTitle': 'Адрес регистрации',
        'regAddress.regionCode': 'Регион',
        'regAddress.houseNumber': 'Номер дома',
        'regAddress.zip': 'Индекс',
      },
      {
        '*sectionTitle': 'Адрес проживания',
        'contactAddress.regionCode': 'Регион',
        'contactAddress.houseNumber': 'Номер дома',
        'contactAddress.zip': 'Индекс',
      },
    ];
  }

  constructor(item) {
    if (!item) {
      item = {
        docnames: [{}],
        contactAddress: {},
        regAddress: {},
      };
    }

    const passport = item.docnames && item.docnames.length > 0 ? item.docnames[0] : {};

    this.id = item.id || 0;
    this.operatorId = item.operatorId || 0;
    this.lastName = item.lastName || null;
    this.firstName = item.firstName || null;
    this.secondName = item.secondName || null;
    this.birthDate = item.birthDate || null;
    this.sexId = item.sexId || null;
    this.countryId = item.countryId || null;
    this.docnames = [new Document(passport)];
    this.birthPlace = item.birthPlace || null;
    this.regAddress = new KladrAddress(item.regAddress);
    this.contactAddress = new KladrAddress(item.contactAddress);
    this.homePhone = item.homePhone || null;
    this.mobilePhone = item.mobilePhone || null;
    this.email = item.email || null;
    this.snils = item.snils || null;
    this.inn = item.inn || null;

    this.contactAddressFull = item.contactAddressFull || null;
    this.regAddressFull = item.regAddressFull || null;
    this.noPrevDocnum = item.noPrevDocnum || false;
    this.prevDocnum = item.prevDocnum || null;
    this.oldFirstname = item.oldFirstname || null;
    this.oldLastname = item.oldLastname || null;
    this.oldSecondname = item.oldSecondname || null;

    this.contactAddressFromRegAddress =
      item.contactAddressFull && item.regAddressFull && item.contactAddressFull === item.regAddressFull;
  }

  filled(): boolean {
    return this.firstName ? true : false;
  }
}
