/* eslint-disable */
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { McItemListSpecs } from '@mc/common';

import { fuseAnimations } from '@mc/core';

@Component({
  selector: 'mc-2021-item-list-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss'],
  animations: fuseAnimations,
})
export class Mc2021ItemListAddButtonComponent {
  @Input() specs: McItemListSpecs;

  constructor(private router: Router) {}

  public onClick() {
    this.router.navigate(this.specs.addItemRoute());
  }
}
