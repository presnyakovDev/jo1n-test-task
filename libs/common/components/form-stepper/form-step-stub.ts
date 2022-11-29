/* eslint-disable */
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { McFormStep } from './form-step';

export class McFormStepStub implements McFormStep {
  name: string;
  caption: string;
  form: FormGroup;
  constructor(formBuilder: FormBuilder) {
    this.form = formBuilder.group({ emptyField: [null, Validators.required] });
  }
  save() {
    return Promise.reject('Save error, this is a stub');
  }
  load() {
    return Promise.reject('Load error, this is a stub');
  }
  loadById(id: number) {
    throw new Error('LoadById error, this is a stub');
  }
  keep() {
    return Promise.reject('Keep error, this is a stub');
  }
}

export function createFormStepStubs(formBuilder: FormBuilder, qty: number) {
  const arr: Array<McFormStep> = [];
  for (let i = 0; i < qty; i++) {
    arr.push(new McFormStepStub(formBuilder));
  }
  return arr;
}
