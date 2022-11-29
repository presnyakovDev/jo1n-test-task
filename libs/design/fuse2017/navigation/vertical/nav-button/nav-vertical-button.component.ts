/* eslint-disable */
import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'mc-nav-vertical-button',
  templateUrl: './nav-vertical-button.component.html',
  styleUrls: ['./nav-vertical-button.component.scss'],
})
export class McNavVerticalButtonComponent implements OnInit {
  @HostBinding('class') classes = 'nav-item';
  @Input() item: any;

  constructor() {}

  ngOnInit() {}
}
