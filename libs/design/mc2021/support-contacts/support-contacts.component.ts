/* eslint-disable */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'mc-2021-support-contacts',
  templateUrl: './support-contacts.component.html',
  styleUrls: ['./support-contacts.component.scss'],
})
export class Mc2021SupportContactsComponent {
  @Input()
  public managerInfo: any;

  @Input()
  public hotLineInfo: any;
}
