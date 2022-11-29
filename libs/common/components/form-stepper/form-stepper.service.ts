import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { McFormStep } from './form-step';

@Injectable()
export class McFormStepperService {
  private currentStep$ = new BehaviorSubject<McFormStep | null>(null);

  private diabled$ = new BehaviorSubject<boolean>(false);

  public currentStep = this.currentStep$.asObservable();

  public diabled = this.diabled$.asObservable();

  _setCurrentStep(step: McFormStep) {
    this.currentStep$.next(step || null);
  }

  public getCurrentStep(): McFormStep | null {
    return this.currentStep$.value;
  }

  public disable() {
    this.diabled$.next(true);
  }

  public enable() {
    this.diabled$.next(false);
  }
}
