/* eslint-disable */
import {
  Component,
  ViewContainerRef,
  ViewChild,
  OnInit,
  Input,
  ComponentFactory,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';

import { McColumnInterface } from '../../../../common/models/item-list-specs.model';

@Component({
  selector: 'mc-item-list-custom-cell',
  template: '<ng-container #container></ng-container>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class McItemListCustomCellComponent implements OnInit {
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
