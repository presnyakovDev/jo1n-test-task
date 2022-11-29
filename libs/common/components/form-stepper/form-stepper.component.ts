/* eslint-disable */
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectorRef,
  ElementRef,
  Optional,
  Self,
} from '@angular/core';
// import { state, style, transition, trigger, animate } from '@angular/animations';
import { MatStepper, MatHorizontalStepper } from '@angular/material/stepper';
import { Directionality } from '@angular/cdk/bidi';

import { McAlertService } from '@mc/core';

import { McFormStep } from './form-step';
import { McFormStepperService } from './form-stepper.service';

@Component({
  selector: 'mc-form-stepper',
  styleUrls: ['./form-stepper.component.scss'],
  templateUrl: './form-stepper.component.html',
  host: {
    class: 'mat-stepper-horizontal',
    role: 'tablist',
  },
  /*animations: [
      trigger('stepTransition', [
        state('previous', style({transform: 'translate3d(-100%, 0, 0)', visibility: 'hidden'})),
        state('current', style({transform: 'translate3d(0%, 0, 0)', visibility: 'visible'})),
        state('next', style({transform: 'translate3d(100%, 0, 0)', visibility: 'hidden'})),
        transition('* => *',
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)'))
      ])
    ],*/
  providers: [{ provide: MatStepper, useExisting: McFormStepperComponent }, McFormStepperService],
  encapsulation: ViewEncapsulation.None,
})
export class McFormStepperComponent extends MatHorizontalStepper {
  formSteps: McFormStep[] = [];
  currentStep: number;

  @Input() currentStepLocalStorageKey: string;
  @Input() alertService: McAlertService;
  @Input() stepChangeRules: (nextStep: number, currentStep: number) => string;
  @Input()
  get selected() {
    return this._steps ? this._steps.toArray()[this.selectedIndex] : undefined;
  }
  set selected(step: any) {
    const clickedIndex = this._steps.toArray().indexOf(step);
    this.stepperGoto(clickedIndex);
  }
  @Output() onStepChanged = new EventEmitter<number>();
  @Output() onFinish = new EventEmitter<void>();

  constructor(
    directionality: Directionality,
    changeDetectorRef: ChangeDetectorRef,
    @Optional() elementRef: ElementRef,
    @Optional() _document: Document,
    @Self() private stepperService: McFormStepperService
  ) {
    super(directionality, changeDetectorRef, elementRef, _document);
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
      this.alertService.alertSimple('Переход через шаги невозможен', [
        'Пожалуйста, сначала перейдите к шагу ' + (this.currentStep + 2),
      ]);
      return;
    }

    this.formSteps[this.currentStep].save().then(newId => {
      this.openStep(nextStep);
    });
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

  private openStep(newStep: number) {
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
  }

  restoreStep(defaultStartStep: number) {
    let step = +localStorage.getItem(this.currentStepLocalStorageKey);
    step = step >= defaultStartStep && step < this.formSteps.length ? step : defaultStartStep;
    this.selectedIndex = step;
    this.currentStep = step;
    this.stepperService._setCurrentStep(this.formSteps[step]);
  }

  async saveCurrentStep(): Promise<any> {
    await this.formSteps[this.currentStep].save();
  }
}
