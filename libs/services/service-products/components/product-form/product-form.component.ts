/* eslint-disable */
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgOption } from '@ng-select/ng-select';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from 'file-saver';

import {
  McAlertService,
  McUtils,
  BanksApiService,
  DictionariesApiService,
  FuseConfirmDialogComponent,
  Bank,
  McTranslateService, McPartnerSelectDialogComponent,
} from '@mc/core';
import { McCompanySelectDialogComponent } from '@mc/core';

import { ServiceProductsApiService } from '../../services/service-products-api.service';
import { ServiceProductsTemplateApiService } from '../../services/service-products-template-api.service';
import { ServiceProduct, ServiceProductScanSetting } from '../../models/service-product.model';
import {filter, map, take} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'mc-service-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DictionariesApiService, BanksApiService],
})
export class McServiceProductFormComponent implements OnInit {
  id: number;
  sourceId: number;
  item: ServiceProduct;
  pageTitle = '';

  form: FormGroup;
  formErrors = new Map<string, string>();

  fieldTitles = ServiceProduct.getFieldNames();
  scanFieldTitles = ServiceProduct.getScanFieldNames();

  amountRuleVariants: Array<NgOption> = ServiceProduct.getAmountRuleVariants();
  extensionAmountRuleVariants: Array<NgOption> = ServiceProduct.getExtensionAmountRuleVariants();
  reservMethodVariants: Array<NgOption> = ServiceProduct.getReservMethodVariants();
  beginStampRuleVariants: Array<NgOption> = ServiceProduct.getBeginStampRuleVariants();
  endStampRuleVariants: Array<NgOption> = ServiceProduct.getEndStampRuleVariants();
  seriesStrategyVariants: Array<NgOption> = ServiceProduct.getSeriesStrategyVariants();

  companyVariants: Array<NgOption> = [];
  typeVariants: Array<NgOption> = [];
  brandVariants: Array<NgOption> = [];
  goodVariants: Array<NgOption> = [];
  bankVariants: Array<NgOption> = [];

  @BlockUI() blockUI: NgBlockUI;

  banks: Bank[];
  objectType = 'groups';

  constructor(
    private formBuilder: FormBuilder,
    private itemsApiService: ServiceProductsApiService,
    private templateApiService: ServiceProductsTemplateApiService,
    private dictService: DictionariesApiService,
    private banksService: BanksApiService,
    private alertService: McAlertService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private translate: McTranslateService,
  ) {
    this.form = this.createForm();
  }


  ngOnInit() {
    this.dictService
      .getDictionaryAsNgOptions('brand')
      .then(variants => {
        console.log( 'variants', variants );
        variants.sort(McUtils.compareByCaption);
        this.brandVariants = variants;
      })
      .catch(reason => {
        this.alertService.alertReason('Ошибка при загрузке брендов', reason);
      });

    this.dictService
      .getDictionaryAsNgOptions('goods')
      .then(variants => {
        variants.sort(McUtils.compareByCaption);
        this.goodVariants = variants;
      })
      .catch(reason => {
        this.alertService.alertReason('Ошибка при загрузке товаров', reason);
      });

    this.dictService
      .getDictionaryAsNgOptions('service_company')
      .then(variants => {
        variants.sort(McUtils.compareByCaption);
        this.companyVariants = variants;
      })
      .catch(reason => {
        this.alertService.alertReason('Ошибка при загрузке компаний', reason);
      });

    this.dictService
      .getDictionaryAsNgOptions('service_product_type')
      .then(variants => {
        variants.sort(McUtils.compareByCaption);
        this.typeVariants = variants;
      })
      .catch(reason => {
        this.alertService.alertReason('Ошибка при загрузке типов продуктов', reason);
      });

    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id');
      this.sourceId = +params.get('sourceId');

      this.updateProductById();
    });

  }

  formFieldReplaces(): any[] {
    const result = [];
    const prefixes = ['create', 'update'];

    prefixes.forEach(prefix => {
      Object.keys(this.fieldTitles).forEach(key => {
        result.push({
          from: prefix + '.' + key,
          to: key,
        });
      });
    });

    return result;
  }

  createForm() {
    return this.formBuilder.group({
      code: '',
      caption: '',
      description: '',
      installments: false,
      reservMethod: null,

      brandId: null,
      goodId: null,
      companyId: null,
      typeId: null,

      amountRule: null,
      baseAmount: null,
      baseRate: null,

      extensionAmountRule: null,
      baseExtensionAmount: null,
      baseExtRate: null,

      beginStampRule: null,
      baseBeginValue: null,

      endStampRule: null,
      baseEndValue: null,
      companyCaption: '',

      jointAccountEnabled: false,
      providerCompanyCaption: '',
      providerCompanyId: false,
      bankId: false,
      seriesStrategy: '',
      scanSettings: this.formBuilder.array([]),
    });
  }

  updateItemFromForm() {
    const formData = this.form.getRawValue();

    this.item.code = formData.code;
    this.item.caption = formData.caption;
    this.item.description = formData.description;
    this.item.installments = formData.installments;
    this.item.reservMethod = formData.reservMethod;

    this.item.brandId = formData.brandId;
    this.item.goodId = formData.goodId;
    this.item.companyCaption = formData.companyCaption;
    this.item.companyId = formData.companyId;
    this.item.typeId = formData.typeId;

    this.item.amountRule = formData.amountRule;
    this.item.baseAmount = formData.baseAmount;
    this.item.baseRate = formData.baseRate;

    this.item.extensionAmountRule = formData.extensionAmountRule;
    this.item.baseExtensionAmount = formData.baseExtensionAmount;
    this.item.baseExtRate = formData.baseExtRate;

    this.item.beginStampRule = formData.beginStampRule;
    this.item.baseBeginValue = formData.baseBeginValue;

    this.item.endStampRule = formData.endStampRule;
    this.item.baseEndValue = formData.baseEndValue;

    this.item.jointAccountEnabled = formData.jointAccountEnabled;
    this.item.providerCompanyCaption = formData.providerCompanyCaption;
    this.item.providerCompanyId = formData.providerCompanyId;
    this.item.bankId = formData.bankId;
    this.item.seriesStrategy = formData.seriesStrategy;

  }

  updateFormFromItem() {
    console.log( this.item )
    const item = this.item;

    this.form.patchValue({
      code: item.code,
      caption: item.caption,
      description: item.description,
      installments: item.installments,
      reservMethod: item.reservMethod,

      brandId: item.brandId,
      goodId: item.goodId,
      companyCaption: item.companyCaption,
      companyId: item.companyId,
      typeId: item.typeId,

      amountRule: item.amountRule,
      baseAmount: item.baseAmount,
      baseRate: item.baseRate,

      extensionAmountRule: item.extensionAmountRule,
      baseExtensionAmount: item.baseExtensionAmount,
      baseExtRate: item.baseExtRate,

      beginStampRule: item.beginStampRule,
      baseBeginValue: item.baseBeginValue,

      endStampRule: item.endStampRule,
      baseEndValue: item.baseEndValue,

      jointAccountEnabled: item.jointAccountEnabled,
      providerCompanyCaption: item.providerCompanyCaption,
      providerCompanyId: item.providerCompanyId,
      bankId: item.bankId,
      seriesStrategy: item.seriesStrategy,
    });

    const scanSettingsLength = this.scanSettings.length;
    this.item.scanSettings.forEach((scanSetting, i) => {
      if (i < scanSettingsLength) {
        this.scanSettings.controls[i].setValue(scanSetting);
      } else {
        this.addScanSettingLine(scanSetting);
      }
    });

    this.formErrors.clear();
  }

  addScanSettingLine(newItem?: ServiceProductScanSetting) {
    const item = {
      scanCode: newItem?.scanCode || null,
    };
    this.scanSettings.push(this.formBuilder.group(item));
  }

  removeScanSettingLine(index: number) {
    this.scanSettings.removeAt(index);
  }

  get scanSettings(): FormArray {
    return this.form.get('scanSettings') as FormArray;
  }

  updateProductById() {
    this.blockUI.start(this.translate.instant('COMMON.LOADING_'));
    const itemId = !this.id && this.sourceId ? this.sourceId : this.id;
    const promises: Promise<any>[] = [this.itemsApiService.getItem(itemId)];
    if (!this.banks) {
      promises.push(this.banksService.getItems());
    }
    Promise.all(promises)
      .then(responses => {
        this.blockUI.stop();

        this.item = responses[0];
        this.item.id = this.id;
        this.pageTitle = this.item.getTitle();

        if (!this.banks) {
          this.banks = responses[1];
          this.bankVariants = McUtils.convertIdCaptionListToNgOptions(this.banks);
        }

        this.updateFormFromItem();
      })
      .catch(reason => {
        this.blockUI.stop();
        this.alertService.alertReason('Ошибка при загрузке настроек продукта', reason);
      });
  }

  remove() {
    const confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false,
    });

    confirmDialogRef.componentInstance.confirmMessage = 'Вы уверены, что хотите удалить продукт?';

    confirmDialogRef.afterClosed().subscribe(confirmation => {
      if (confirmation) {
        this.blockUI.start(this.translate.instant('COMMON.DELETION_'));
        this.itemsApiService
          .deleteItem(this.id)
          .then(response => {
            this.blockUI.stop();
            this.router.navigate(['/service-products/items']);
          })
          .catch(reason => {
            this.blockUI.stop();
            this.alertService.alertReason(this.translate.instant('COMMON.ERRORS.DELETION_ERROR'), reason);
          });
      }
    });
  }

  save() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.updateItemFromForm();
      this.blockUI.start(this.translate.instant('COMMON.SAVING_'));
      this.itemsApiService
        .updateItem(this.item)
        .then(response => {
          this.blockUI.stop();
          this.router.navigate(['/service-products/items']);
        })
        .catch(reason => {
          this.blockUI.stop();
          const patchedReason = McUtils.responseFieldsReplace(reason, this.formFieldReplaces());

          McUtils.decodeErrors(patchedReason, this.form, this.formErrors);
          this.alertService.alert({
            title: this.translate.instant('COMMON.ERRORS.SAVING_ERROR'),
            content: patchedReason,
            fieldTitles: this.fieldTitles,
          });
        });
    }
  }

  choosePartner() {
    const dialogRef = this.dialog.open(McPartnerSelectDialogComponent, {
      data: {
        title: 'Выберите организацию предоставляющую доп.услугу',
      },
    });
    dialogRef.afterClosed()
      .pipe(
        take(1),
        filter((selectionResult) => selectionResult && selectionResult.selectedItem),
        map(selectionResult => selectionResult.selectedItem)
      )
      .subscribe((partner) => {
        if (this.form.get('companyId').value) {
          this.confirmPartnerChange()
            .pipe(
              take(1),
              filter((result) => result)
            )
            .subscribe(() => {
              this.form.patchValue({
                companyCaption: partner.caption,
                companyId: partner.id,
              });
            })
        } else {
          this.form.patchValue({
            companyCaption: partner.caption,
            companyId: partner.id,
          });
        }
      });
  }

  chooseCompany() {
    const dialogRef = this.dialog.open(McCompanySelectDialogComponent, {
      panelClass: 'company-select',
      data: {
        title: 'Выберите компанию',
      },
    });

    dialogRef.afterClosed().subscribe((selectionResult: any) => {
      if (!selectionResult) {
        return;
      }
      const selection = selectionResult.selectedItem;
      if (selection === undefined) {
        return;
      }

      this.form.patchValue({
        providerCompanyCaption: selection.caption,
        providerCompanyId: selection.id,
      });
    });
  }

  private confirmPartnerChange(): Observable<boolean> {
    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {});
    return dialogRef.afterClosed()
  }
}
