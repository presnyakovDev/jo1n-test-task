/* eslint-disable */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis',
})
export class EllipsisPipe implements PipeTransform {
  transform(str: string, end: number): string {
    return str.length < end ? str : `${str.slice(0, end)}...`;
  }
}
