/* eslint-disable */
import { Injectable, Injector, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval } from 'rxjs';

import { FuseConfirmDialogComponent } from '../mc-components/confirm-dialog/confirm-dialog.component';
import { McAuthInterceptor } from '../mc-auth.interceptor';
import { McAuthService } from './auth.service';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class McAppConfig {
  private config: any = {};
  private envData: any = {};

  private updateSpaDialogOpened = false;

  private version = '';

  private configLoaded$ = new BehaviorSubject(false);
  public configLoaded = this.configLoaded$.asObservable();

  constructor(private inj: Injector, private ngZone: NgZone) {}

  /**
   * Use to get the data found in the second file (config file)
   */
  public get(key: any) {
    return this.config[key];
  }

  /**
   * Use to get the data found in the first file (env file)
   */
  public getEnv(key: any) {
    return this.envData[key];
  }

  public setEnv(key: any, value: any) {
    this.envData[key] = value;
  }

  /**
   * Loads "version.json" to set current spa version
   */
  public async getSpaVersion(): Promise<any> {
    const http = this.inj.get(HttpClient);
    try {
      const versionFile: any = await http.get('configs/version.json?rand=' + Math.random()).toPromise();
      return versionFile;
    } catch (error) {}
  }

  private updateSpa() {
    window.location.reload();
  }

  public autoUpdateInit(dialog: MatDialog) {
    this.ngZone.runOutsideAngular(() => {
      interval(1000 * 60 * 5).subscribe(async seconds => {
        try {
          const versionFile = await this.getSpaVersion();
          const currentVersion = this.get('spa-version');
          const minRequiredVersion = versionFile.minRequiredVersion;
          const minRecommendedVersion = versionFile.minRecommendedVersion;

          if (minRequiredVersion > currentVersion) {
            setTimeout(() => this.updateSpa(), 1000 * 60 * 3);
          }

          const needUpdateSpa = minRequiredVersion > currentVersion || minRecommendedVersion > currentVersion;
          if (needUpdateSpa && !this.updateSpaDialogOpened) {
            this.updateSpaDialogOpened = true;
            const dialogRef = dialog.open(FuseConfirmDialogComponent, {});
            const requiredUpdate = minRequiredVersion > currentVersion;
            const updateTypeSpecificNotes = requiredUpdate
              ? 'Через 3 минуты веб-приложение будет обновлено.'
              : 'Рекомендуем обновить веб-приложение.';
            const updateCommonNotes =
              'Пожалуйста, сохраните все не сохраненные данные. Обновить сейчас? (обновить позже можно нажав Ctrl+R на клавиатуре)';
            dialogRef.componentInstance.confirmMessage = updateTypeSpecificNotes + ' ' + updateCommonNotes;
            dialogRef.componentInstance.confirmButtonText = 'Обновить';
            dialogRef.afterClosed().subscribe(confirmed => {
              this.updateSpaDialogOpened = false;
              if (confirmed) {
                this.updateSpa();
              }
            });
          }
        } catch (error) {}
      });
    });
  }

  /**
   * This method:
   *   a) Loads "env.json" to get the current working environment (e.g.: 'prod', 'preprod', 'test1', 'test2')
   *   b) Loads "config.non-dev.json"
   */
  public async load(): Promise<any> {
    const http = this.inj.get(HttpClient);
    const auth = this.inj.get(McAuthService);
    const versionFile = await this.getSpaVersion();
    if (versionFile) {
      this.version = versionFile.version;
    }

    try {
      const envResponse = await http.get('env.json?rand=' + Math.random()).toPromise();
      this.envData = envResponse;
    } catch (error) {
      this.envData = {
        env: 'default',
        e2e: true,
        config: {
          'do-not-ask-push-notifications': false,
          'dadata-suggestions-url': 'https://suggestions.dadata.ru/suggestions/api',
        },
      };
    }

    try {
      const env = this.envData.env;
      const request1 = http.get('configs/servers.' + env + '.json?rand=' + Math.random()).toPromise();
      const request2 = http.get('configs/config.dev.json?rand=' + Math.random()).toPromise();
      const responseData1 = await request1;
      const responseData2 = await request2;
      this.config = { ...responseData1, ...responseData2, ...this.envData.config };
      McAuthInterceptor.setMcServerUrl(this.get('api-server'));
      this.config['spa-version'] = this.version;

      await auth.init(this);
      this.configLoaded$.next(true);

      return true;
    } catch (error) {
      return true;
    }
  }
}
