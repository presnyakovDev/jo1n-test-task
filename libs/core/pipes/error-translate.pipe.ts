/* eslint-disable */
import { Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

const ERROR_KEY_PREFIX = 'ERRORS.';

@Pipe({
  name: 'errorTranslate',
  pure: false,
})
export class ErrorTranslatePipe implements PipeTransform {
  constructor(private translate: TranslatePipe) {}

  transform(value: string, ...args: unknown[]): unknown {
    const translatedError = this.translate.transform(ERROR_KEY_PREFIX + value.toUpperCase());

    return translatedError.startsWith(ERROR_KEY_PREFIX) // not translated
      ? translatedError.slice(ERROR_KEY_PREFIX.length)
      : translatedError;
  }
}
