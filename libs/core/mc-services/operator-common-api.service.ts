/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { McAppConfig } from './app-config.service';
import { McAppInfoService } from './app-info.service';
import { KladrAddress } from '../mc-models/kladr-address.model';
import { filter, take } from 'rxjs/operators';
import { McAuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OperatorCommonApiService {
  private operatorInfo$ = new BehaviorSubject<CommonOperatorInfo>(null);
  public operatorInfo = this.operatorInfo$.asObservable();

  get apiUrl(): string {
    return this.config.get('api-server') + this.config.get('api-common-operators-self-url');
  }

  constructor(
    private auth: McAuthService,
    private config: McAppConfig,
    private http: HttpClient,
    private appInfo: McAppInfoService
  ) {
    this.config.configLoaded.pipe(filter<boolean>(Boolean), take(1)).subscribe(() => this.updateOperatorInfo());
  }

  getItem(): Promise<CommonOperatorInfo> {
    return this.http.get<CommonOperatorInfo>(this.apiUrl).toPromise();
  }

  async updateOperatorInfo(): Promise<void> {
    if (this.auth.getUsername() && !this.auth.userHasRole('ROLE_MC_OPER')) {
      return;
    }
    const operatorInfo = await this.getItem();

    if (JSON.stringify(this.operatorInfo$.getValue()) !== JSON.stringify(operatorInfo)) {
      this.operatorInfo$.next(operatorInfo);
      this.appInfo.setPointId(operatorInfo.pointId);
    }
  }

  async setPoint(pointId: number): Promise<void> {
    await this.http.put<void>(this.apiUrl + '/point', { pointId: pointId, requestPointChange: true }).toPromise();
    this.updateOperatorInfo();
  }

  async getPoints(): Promise<CommonPointInfo[]> {
    const points: CommonPointInfo[] = [];
    let addPoints: CommonPointInfo[] = [];
    const pageSize = 100;
    let pageNumber = 0;
    do {
      addPoints = await this.http
        .get<CommonPointInfo[]>(this.apiUrl + '/points?limit=' + pageSize + '&page=' + pageNumber)
        .toPromise();
      points.push(...addPoints);
      pageNumber++;
    } while (addPoints.length === pageSize);
    return points;
  }
}

export interface CommonOperatorInfo {
  allowPointChange: boolean;
  requestPointChange: boolean;
  pointId: number;
  pointCaption: string;
  companyId: number;
  companyCaption: string;
  partnerId: number;
  partnerCaption: string;
}

export interface CommonPointInfo {
  id: number;
  caption: string;
  companyId: number;
  companyCaption: string;
  partnerId: number;
  partnerCaption: string;
  address: string;
  pointAddress: KladrAddress;
}
