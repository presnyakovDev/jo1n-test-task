/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { McTranslateService, Language } from '@mc/core';

@Component({
  selector: 'fuse-language-menu',
  templateUrl: './language-menu.component.html',
  styleUrls: ['./language-menu.component.scss'],
})
export class FuseLanguageMenuComponent implements OnInit {
  languages: Language[];

  constructor(public translate: McTranslateService) {}

  changeLanguage(lang) {
    this.translate.use(lang.code);
  }

  ngOnInit() {
    this.languages = this.translate.getLanguages();
  }
}
