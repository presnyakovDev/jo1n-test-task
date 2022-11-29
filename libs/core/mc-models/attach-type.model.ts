/* eslint-disable */
import { AttachOwnerType } from './../mc-owner-types';

export class AttachType {
  id: number;
  code: string;
  active: boolean;
  ownerType: AttachOwnerType;
  description: string;
  caption: string;
  multiple: boolean;
  scan: boolean;

  constructor(item) {
    {
      this.id = item.id;
      this.active = item.active || true;
      this.code = item.code || '';
      this.caption = item.caption || '';
      this.description = item.description || '';
      this.ownerType = item.ownerType || '';
      this.multiple = item.multiple || false;
      this.scan = item.scan || false;
    }
  }
}

export interface AttachmentV2Type {
  typeCode: string;
  typeCaption: string;
  mandatory: boolean;
}
