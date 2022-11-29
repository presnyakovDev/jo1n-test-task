import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { McAppConfig, McMenuService, McTranslateService } from '@mc/core';
import { FuseNavigationService } from '@mc/core';

import { NavigationModel } from './navigation.model';

@Component({
  selector: 'fuse-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private navigation: NavigationModel;

  public module = 'root';

  public logo = {
    url: 'assets/images/logos/jo1n_short.svg',
    urlOnHover: 'assets/images/logos/jo1n_full.svg',
    width: '30',
    height: '30',
    widthOnHover: '65',
    heightOnHover: '40',
    paddingLeft: '9px',
    paddingLeftOnHover: '3px',
  };

  constructor(
    private config: McAppConfig,
    private navigationService: FuseNavigationService,
    private translate: McTranslateService,
    private router: Router,
  ) {
    this.config.setEnv('access-group-sales-multiple-user', 'true');
    this.navigation = new NavigationModel([]);
    this.navigationService.setNavigationModel(this.navigation);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateModuleFromUrl(event.urlAfterRedirects);
      }
      if (event instanceof NavigationStart) {
        this.updateModuleFromUrl(event.url);
      }
    });

    McMenuService.onMenuChange.subscribe(menu => {
      if (menu) {
        this.navigation = new NavigationModel(menu);
        this.navigationService.setNavigationModel(this.navigation);
      }
    });

    this.translate.init({
      languages: [
        { code: 'en', caption: 'English', iconUrl: 'assets/images/flags/en.png' },
        { code: 'ru', caption: 'Русский', iconUrl: 'assets/images/flags/ru.png' },
      ],
      defaultLang: 'en',
    });

    sessionStorage.setItem('jo1n-service-products', JSON.stringify(serviceProducts));
    sessionStorage.setItem('jo1n-dict-brand', JSON.stringify(dictBrands));
    sessionStorage.setItem('jo1n-dict-goods', JSON.stringify(dictGoods));
    sessionStorage.setItem('jo1n-dict-service_company', JSON.stringify(dictServiceCompany));
    sessionStorage.setItem('jo1n-dict-service_product_type', JSON.stringify(dictServiceProductType));
    sessionStorage.setItem('jo1n-banks', JSON.stringify(banks));
    sessionStorage.setItem('jo1n-partners', JSON.stringify(partners));

  }

  updateModuleFromUrl(url: string) {
    this.module = url.slice(1, 1 + url.slice(1).search('/'));
  }
}


const serviceProducts = [
  {
    "id": 1,
    "code": "test2",
    "caption": "test2",
    "description": "",
    "bankId": null,
    "bankCode": null,
    "extCode": null,
    "companyId": 1,
    "companyCode": "test",
    "companyCaption": "Test",
    "typeId": 1,
    "commissionRate": null,
    "partnerId": null,
    "typeCode": "commodity-insurance",
    "typeCaption": "Commodity insurance",
    "typeDescription": null,
    "installments": false,
    "brandId": 1,
    "brandCaption": "Acer",
    "goodId": 1,
    "goodCaption": "Acond. Cassette Inverter",
    "amountRule": 1,
    "baseAmount": 1.00,
    "baseRate": null,
    "scriptSettings": [],
    "scanSettings": [],
    "extensionAmountRule": 1,
    "baseExtensionAmount": 1.00,
    "baseExtRate": null,
    "beginStampRule": 1,
    "baseBeginValue": 1,
    "endStampRule": 1,
    "baseEndValue": 1,
    "reservMethod": "INTERNAL",
    "seriesStrategy": null,
    "serviceProductFields": [],
    "templateType": "html",
    "templateInfo": null,
    "bankIntegrationCode": null,
    "bankCaption": null,
    "jointAccountEnabled": null,
    "providerCompanyId": null,
    "providerCompanyCaption": null
  },
  {
    "id": 2,
    "code": "ins_standard",
    "caption": "Certificado Extensión de Garantía JO1N Standard",
    "description": "Test for black friday 14-28",
    "bankId": null,
    "bankCode": null,
    "extCode": null,
    "companyId": 2,
    "companyCode": "test",
    "companyCaption": "Test",
    "typeId": 2,
    "commissionRate": null,
    "partnerId": 2,
    "typeCode": "commodity-insurance",
    "typeCaption": "Commodity insurance",
    "typeDescription": null,
    "installments": false,
    "brandId": 2,
    "brandCaption": "Other",
    "goodId": 2,
    "goodCaption": "Abrelatas",
    "amountRule": 5,
    "baseAmount": null,
    "baseRate": null,
    "scriptSettings": [],
    "scanSettings": [],
    "extensionAmountRule": 1,
    "baseExtensionAmount": null,
    "baseExtRate": null,
    "beginStampRule": 1,
    "baseBeginValue": 1,
    "endStampRule": 1,
    "baseEndValue": 1,
    "reservMethod": "INTERNAL",
    "seriesStrategy": "none",
    "serviceProductFields": [],
    "templateType": "html",
    "templateInfo": null,
    "bankIntegrationCode": null,
    "bankCaption": null,
    "jointAccountEnabled": null,
    "providerCompanyId": null,
    "providerCompanyCaption": null
  }
];

const dictBrands = [
  {
    "id": 1,
    "code": "ACER",
    "caption": "Acer",
    "description": null,
    "orderNum": 0,
    "needAdditional": null
  },
  {
    "id": 2,
    "code": "ADL",
    "caption": "Adl",
    "description": null,
    "orderNum": 0,
    "needAdditional": null
  },
  {
    "id": 4,
    "code": "POLAROID",
    "caption": "Polaroid",
    "description": null,
    "orderNum": null,
    "needAdditional": null
  },
  {
    "id": 5,
    "code": "SAMSUNG INFORMATICA",
    "caption": "Samsung Informatica",
    "description": null,
    "orderNum": null,
    "needAdditional": null
  },
];

const dictGoods = [
  {
    "id": 1,
    "code": "FRIGORIFICO INTEGRABLE",
    "caption": "Frigorifico Integrable",
    "description": null,
    "orderNum": null,
    "needAdditional": null
  },
  {
    "id": 2,
    "code": "SECADORA INTEGRABLE",
    "caption": "Secadora Integrable",
    "description": null,
    "orderNum": null,
    "needAdditional": null
  },
  {
    "id": 3,
    "code": "AC CONSOLA",
    "caption": "Ac Consola",
    "description": null,
    "orderNum": null,
    "needAdditional": null
  },
  {
    "id": 4,
    "code": "MICROFONOS",
    "caption": "Microfonos",
    "description": null,
    "orderNum": null,
    "needAdditional": null
  }
];


const dictServiceCompany = [
  {
    "id": 1,
    "code": "test",
    "caption": "Test",
    "description": null,
    "orderNum": null,
    "needAdditional": null
  }
];

const dictServiceProductType = [
  {
    "id": 1,
    "code": "commodity-insurance",
    "caption": "Commodity insurance",
    "description": null,
    "orderNum": null,
    "needAdditional": null
  }
];

const banks = [
  {
    "id": 1,
    "status": "new",
    "name": "VIZIA",
    "code": "VIZIA",
    "officialName": null,
    "legalAddress": null,
    "regionCode": null
  },
  {
    "id": 2,
    "status": "new",
    "name": "Citadele",
    "code": "Citadele",
    "officialName": null,
    "legalAddress": null,
    "regionCode": null
  },
  {
    "id": 3,
    "status": "new",
    "name": "Bankinter",
    "code": "BANKINTER",
    "officialName": null,
    "legalAddress": null,
    "regionCode": null
  }
];

const partners = [
  {
    "id": 2,
    "infoStatusId": 48065,
    "infoStatusCaption": "In progress",
    "infoStatusCode": "hot",
    "status": "new",
    "description": null,
    "caption": "Test time zone1",
    "timezone": null,
    "documentContactFullname": null,
    "documentContactPhone": null,
    "documentContactEmail": null,
    "authorizedContactFullname": null,
    "authorizedContactPhone": null,
    "authorizedContactEmail": null,
    "accessControlGroups": [],
    "settingsGroupId": null,
    "crmSettings": null
  },
  {
    "id": 3,
    "infoStatusId": 48065,
    "infoStatusCaption": "In progress",
    "infoStatusCode": "hot",
    "status": "new",
    "description": null,
    "caption": "fdfdf",
    "timezone": null,
    "documentContactFullname": null,
    "documentContactPhone": null,
    "documentContactEmail": null,
    "authorizedContactFullname": null,
    "authorizedContactPhone": null,
    "authorizedContactEmail": null,
    "accessControlGroups": [],
    "settingsGroupId": null,
    "crmSettings": null
  },
  {
    "id": 4,
    "infoStatusId": 48065,
    "infoStatusCaption": "In progress",
    "infoStatusCode": "hot",
    "status": "new",
    "description": null,
    "caption": "May",
    "timezone": null,
    "documentContactFullname": null,
    "documentContactPhone": null,
    "documentContactEmail": null,
    "authorizedContactFullname": null,
    "authorizedContactPhone": null,
    "authorizedContactEmail": null,
    "accessControlGroups": [],
    "settingsGroupId": null,
    "crmSettings": null
  },
  {
    "id": 5,
    "infoStatusId": 48065,
    "infoStatusCaption": "In progress",
    "infoStatusCode": "hot",
    "status": "new",
    "description": null,
    "caption": "December",
    "timezone": null,
    "documentContactFullname": null,
    "documentContactPhone": null,
    "documentContactEmail": null,
    "authorizedContactFullname": null,
    "authorizedContactPhone": null,
    "authorizedContactEmail": null,
    "accessControlGroups": [],
    "settingsGroupId": null,
    "crmSettings": null
  }
];
