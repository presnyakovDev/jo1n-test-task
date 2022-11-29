/* eslint-disable */
import { FormGroup } from '@angular/forms';

export interface McFormStep {
  name: string;
  caption: string;

  // For step validation purposes
  form?: FormGroup;

  // Save on server before next step
  save(): Promise<any>;

  // Load from server and localStorage before show step
  load(): Promise<any>;

  // Load from server by id
  // loadById(id: number);

  // Store step data in localStorage
  keep();
}
