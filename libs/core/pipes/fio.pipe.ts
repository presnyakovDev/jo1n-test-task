/* eslint-disable */
import { Pipe, PipeTransform } from '@angular/core';
import { McUtils } from './../mc-utils';

@Pipe({ name: 'fio' })
export class FioPipe implements PipeTransform {
  transform(value: string): any {
    return McUtils.processNamePart(value);
  }
}
