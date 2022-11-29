import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  Self,
  HostBinding,
  ChangeDetectorRef,
  ElementRef,
  Optional,
  HostListener,
} from '@angular/core';
import { Router } from '@angular/router';
import { Directionality } from '@angular/cdk/bidi';
import { MatStepper, MatHorizontalStepper } from '@angular/material/stepper';
import { CdkStep } from '@angular/cdk/stepper';
import { take } from 'rxjs/operators';

import { McAlertService, McTranslateService } from '@mc/core';

import { McFormStep, McFormStepperService } from '@mc/common';

@Component({
  selector: 'mc-2021-form-stepper',
  styleUrls: ['./form-stepper.component.scss'],
  templateUrl: './form-stepper.component.html',
  providers: [{ provide: MatStepper, useExisting: Mc2021FormStepperComponent }, McFormStepperService],
  encapsulation: ViewEncapsulation.None,
})
export class Mc2021FormStepperComponent extends MatHorizontalStepper {
  formSteps: McFormStep[] = [];

  currentStep: number;

  disabled: boolean;

  @HostBinding('class.mat-stepper-horizontal') horizontal = true;

  @HostBinding('attr.role') role = 'tablist';

  @HostListener('window:popstate', ['$event']) onPopState() {
    history.pushState(null, null, location.href);

    if (this.currentStep) {
      this.previous();

      return;
    }

    setTimeout(() => this.router.navigateByUrl('/'), 0);
  }

  @Input()
  get selected() {
    return this._steps ? this._steps.toArray()[this.selectedIndex] : undefined;
  }

  set selected(step: any) {
    const clickedIndex = this._steps.toArray().indexOf(step);
    this.stepperGoto(clickedIndex);
  }

  @Input() currentStepLocalStorageKey: string;

  @Input() hideStepper = false;

  @Input() alertService: McAlertService;

  @Input() showStepHeader = true;

  @Input() stepChangeRules: (nextStep: number, currentStep: number) => string;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onStepChanged = new EventEmitter<number>();

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onFinish = new EventEmitter<void>();

  constructor(
    directionality: Directionality,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() elementRef: ElementRef,
    @Optional() _document: Document,
    private translateService: McTranslateService,
    @Self() private stepperService: McFormStepperService,
    private router: Router,
  ) {
    super(directionality, changeDetectorRef, elementRef, _document);
    stepperService.diabled.subscribe(value => (this.disabled = value));
    history.pushState(null, null, location.href);
  }

  public _getIndicatorType(index: number): string {
    if (index < this.selectedIndex) {
      return 'done';
    }
    if (index === this.selectedIndex) {
      return 'edit';
    }

    return 'number';
  }

  _onKeydown(event: KeyboardEvent) {
    const wasIndex = this.selectedIndex;
    super._onKeydown(event);
    if (wasIndex !== this.selectedIndex) {
      this.stepperGoto(this.selectedIndex);
    }
  }

  setFormSteps(value: McFormStep[]) {
    this.formSteps = value;
  }

  stepperGoto(nextStep: number) {
    if (nextStep === this.currentStep) {
      return;
    }
    if (!this.checkNewStep(nextStep)) {
      return;
    }
    if (nextStep < this.currentStep) {
      this.formSteps[this.currentStep].keep();
      this.openStep(nextStep);
      return;
    }

    if (nextStep > this.currentStep + 1) {
      this.alertService.alertSimple(this.translateService.instant('COMMON.SKIPPING_STEPS_IS_NOT_ALLOWED'), [
        this.translateService.instant('COMMON.PLEASE_PROCEED_TO_STEP') + (this.currentStep + 2),
      ]);
      return;
    }

    this.formSteps[this.currentStep].save().then(() => this.openStep(nextStep));
  }

  openStepByName(name: string) {
    const stepIndex = this.formSteps.findIndex(step => step && step.name === name);
    this.openStep(stepIndex);
  }

  keepStepNumber(step: number) {
    localStorage.setItem(this.currentStepLocalStorageKey, step.toString());
  }

  private checkNewStep(newStep: number): boolean {
    if (this.stepChangeRules) {
      const reason = this.stepChangeRules(newStep, this.selectedIndex);

      if (reason) {
        this.alertService.alertReason('Ошибка при переходе', reason);
        return false;
      }
    }

    return true;
  }

  previous() {
    if (this.currentStep) {
      this.stepperGoto(this.currentStep - 1);
    }
  }

  private async openStep(newStep: number): Promise<void> {
    this.stepperService.diabled.pipe(take(1)).subscribe(disabled => {
      if (disabled) {
        return;
      }

      let step = newStep;
      if (typeof newStep !== 'number' || newStep < 0) {
        step = 0;
      }
      if (step === this.formSteps.length) {
        this.onFinish.emit();
        return;
      }
      this.keepStepNumber(step);
      this.selectedIndex = step;
      this.currentStep = step;
      this.onStepChanged.emit(step);
      const stepHeader = document.getElementById('stepHeader');
      if (stepHeader) {
        stepHeader.scrollIntoView();
      }
      this.stepperService._setCurrentStep(this.formSteps[step]);
    });
  }

  restoreStep(defaultStartStep: number) {
    let step = +localStorage.getItem(this.currentStepLocalStorageKey);
    step = step >= defaultStartStep && step < this.formSteps.length ? step : defaultStartStep;
    this.selectedIndex = step;
    this.currentStep = step;
    this.stepperService._setCurrentStep(this.formSteps[step]);
  }

  async saveCurrentStep(): Promise<void> {
    await this.formSteps[this.currentStep].save();
  }

  selectStep(step: CdkStep) {
    if (!this.disabled) {
      step.select();
    }
  }

  disable() {
    this.stepperService.disable();
  }

  enable() {
    this.stepperService.enable();
  }
}
