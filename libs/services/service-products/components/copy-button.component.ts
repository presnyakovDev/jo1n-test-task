/* eslint-disable */
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ServiceProduct } from '../models/service-product.model';

@Component({
  selector: 'mc-service-products-copy-button',
  template: '<button mat-raised-button (click)="copy($event)">{{ caption }}</button>',
})
export class McServiceProductsCopyButtonComponent {
  caption = 'Копировать';

  @Input()
  item: ServiceProduct;

  constructor(private router: Router) {}

  copy(event: Event) {
    event.preventDefault();
    this.router.navigate(this.item.getCopyRoute());
  }
}
