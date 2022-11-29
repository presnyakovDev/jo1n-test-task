/* eslint-disable */
import { AttachOwnerType } from './../mc-owner-types';
import { AttachType } from './attach-type.model';

export class Attach {
  id: number;
  ownerId: number;
  ownerType: AttachOwnerType;

  active: boolean;
  createdBy: number;
  createdDate: string;
  attachmentTypeId: number;
  hash: string;
  rating: number;
  ratingDate: string;
  ratingDescription: string;
  ratedBy: number;
  originalFilename: string;
  page: number;
  file: File;

  get originalExtension(): string {
    return this.originalFilename.indexOf('.pdf') > 0 ? '.pdf' : '.jpg';
  }

  public static getSummary(types: Array<AttachType>, items: Array<Attach>): string {
    const todo = types.length;

    if (todo === 0) {
      return '-';
    }

    const typesPreMap = {};
    for (const type of types) {
      typesPreMap['' + type.id] = type;
    }

    const attachesPreMap = {};
    const attachesNextPagesMap = new Map<number, number>();
    for (const attach of items) {
      const typeId = attach.attachmentTypeId;
      if (!attachesNextPagesMap.has(typeId)) {
        attachesNextPagesMap.set(typeId, 0);
      }
      if (attachesNextPagesMap.get(typeId) < attach.page + 1) {
        attachesNextPagesMap.set(typeId, attach.page + 1);
      }
      attachesPreMap['' + typeId + ':' + attach.page] = attach;
    }

    let done = 0;
    let notRated = 0;
    let redo = 0;

    const attachesMap = new Map<number, number>();
    for (const attach of items) {
      const typeId = attach.attachmentTypeId;
      if (!attachesMap.has(typeId) && typesPreMap['' + typeId]) {
        let attachDone = true;
        const attachNotRated = false;
        attachesMap.set(typeId, 1);
        for (let page = 0; page < attachesNextPagesMap.get(typeId); page++) {
          const _attach: Attach = attachesPreMap['' + typeId + ':' + page];
          if (!_attach) {
            attachDone = false;
            redo++;
          } else {
            if (!_attach.rating) {
              attachDone = false;
              notRated++;
            } else {
              if (_attach.rating < 5) {
                attachDone = false;
                redo++;
              }
            }
          }
        }
        if (attachDone) {
          done++;
        }
      }
    }

    let result = '' + Math.floor((100 * done) / todo) + ' %';
    if (notRated) {
      result += ', к оценке ' + notRated + ' шт';
    }
    if (redo) {
      result += ', переснять ' + redo + ' шт';
    }

    return result;
  }

  public ratingCaption(rating: number) {
    switch (rating) {
      case 1:
        return 'Переделать';
      case 3:
        return 'Плохо';
      case 5:
        return 'Хорошо';
    }
    return '-';
  }

  constructor(item) {
    {
      this.id = item.id;
      this.ownerId = item.ownerId;
      this.ownerType = item.ownerType;
      this.active = item.active;
      this.createdBy = item.createdBy;
      this.createdDate = item.createdDate || '';
      this.attachmentTypeId = item.attachmentTypeId;
      this.hash = item.hash || '';
      this.rating = item.rating || null;
      this.ratingDate = item.ratingDate || '';
      this.ratingDescription = item.ratingDescription || '';
      this.ratedBy = item.ratedBy;
      this.originalFilename = item.originalFilename || '';
      this.page = item.page;
    }
  }
}
