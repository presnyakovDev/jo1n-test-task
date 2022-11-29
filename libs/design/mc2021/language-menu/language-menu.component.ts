/* eslint-disable */
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { Language, McTranslateService } from '@mc/core';

@Component({
  selector: 'mc-2021-language-menu',
  templateUrl: './language-menu.component.html',
  styleUrls: ['./language-menu.component.scss'],
})
export class Mc2021LanguageMenuComponent implements OnInit {
  @HostListener('document:click', ['$event'])
  public clickOutside(event: { target: EventTarget }) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showLanguagesMenu = false;
    }
  }

  public showLanguagesMenu = false;

  public languages: Language[];
  constructor(public translate: McTranslateService, private eRef: ElementRef) {}

  public ngOnInit() {
    this.languages = this.translate.getLanguages();
  }

  public changeLanguage(lang: Language) {
    this.translate.use(lang.code);
    this.showLanguagesMenu = false;
  }

  public openLanguagesMenu() {
    this.showLanguagesMenu = !this.showLanguagesMenu;
  }
}
