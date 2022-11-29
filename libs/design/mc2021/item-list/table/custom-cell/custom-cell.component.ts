/* eslint-disable */
import {
  Component,
  ViewContainerRef,
  ViewChild,
  OnInit,
  Input,
  ComponentFactory,
  ChangeDetectorRef,
} from '@angular/core';

import { McColumnInterface } from '@mc/common';

@Component({
  selector: 'mc-2021-item-list-custom-cell',
  template: '<ng-container #container></ng-container>',
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
      }
    `,
  ],
})
export class Mc2021ItemListCustomCellComponent implements OnInit {
  @Input() factory: ComponentFactory<McColumnInterface>;
  @Input() item: any;
  @ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const componentRef = this.container.createComponent(this.factory);
    componentRef.instance.item = this.item;
    this.cdr.detectChanges();
  }
}
