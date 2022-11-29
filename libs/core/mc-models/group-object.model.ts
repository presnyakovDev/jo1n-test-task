/* eslint-disable */
export class GroupObject {
  id: number;
  manageType: string;
  groupId: number;
  partnerId: number;
  companyId: number;
  pointId: number;
  status: string;

  constructor(item) {
    this.id = item.id;
    this.manageType = item.manageType;
    this.groupId = item.groupId;
    this.partnerId = item.partnerId || null;
    this.companyId = item.companyId || null;
    this.pointId = item.pointId || null;
    this.status = item.status || null;
  }
}
