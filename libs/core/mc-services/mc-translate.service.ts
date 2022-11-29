/* eslint-disable */
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../mc-models/language.model';
import { Observable } from 'rxjs';
import { McUtils } from '../mc-utils';

interface Options {
  languages: Language[];
  defaultLang: string;
}

interface TranslatableProperties {
  [key: string]: string;
}

interface TranslatableArrayProperty {
  name: string;
  translationKey?: string;
  translationKeyMapper?: (option: any) => string;
  translatableKey: string;
}

export interface McTranslatePropsOptions {
  translatableProperties?: TranslatableProperties;
  translatableArrayProperties?: TranslatableArrayProperty[];
  afterTranslateCallback?: () => void;
}

const setTranslatedProperty = (object, nestedProperty, value) => {
  // nestedProperty like this: `${property.name}.${index}.${property.translatableKey}`
  nestedProperty.split('.').reduce((acc, props) => {
    const isNotNested = typeof acc[props] !== 'object';
    if (isNotNested) {
      acc[props] = value;
    }
    return acc[props];
  }, object);
};

const getTranslatableProperties = (translatedObject: any, options: McTranslatePropsOptions): TranslatableProperties => {
  const translatableProperties = options.translatableProperties ? options.translatableProperties : {};

  if (options.translatableArrayProperties) {
    options.translatableArrayProperties.forEach(property => {
      const translatedArray = translatedObject[property.name] as Array<any>;
      translatedArray?.forEach((item, index) => {
        translatableProperties[item[property.translationKey]] = `${property.name}.${index}.${property.translatableKey}`;
      });
    });
  }

  return translatableProperties;
};

export interface McTranslatePropsOptions {
  translatableProperties?: TranslatableProperties;
  translatableArrayProperties?: TranslatableArrayProperty[];
  afterTranslateCallback?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class McTranslateService {
  private languages: Language[] = [];

  constructor(private translateService: TranslateService) {}

  public get currentLang(): string {
    return this.translateService.currentLang;
  }

  public get onLangChange() {
    return this.translateService.onLangChange;
  }

  public instant(key: string | Array<string>, interpolateParams?: Object): string | any {
    return this.translateService.instant(key, interpolateParams);
  }

  public get(key: string | Array<string>, interpolateParams?: Object): Observable<string | any> {
    return this.translateService.get(key, interpolateParams);
  }

  public getLanguages(): Language[] {
    return this.languages;
  }

  public use(langCode: string) {
    this.translateService.use(langCode);
  }

  public reloadLang(lang: string) {
    return this.translateService.reloadLang(lang);
  }

  public resetLang(lang: string) {
    return this.translateService.resetLang(lang);
  }

  public getDefaultLang() {
    return this.translateService.getDefaultLang();
  }

  public init({ languages, defaultLang }: Options) {
    const date = new Date(Date.now() + 31536e6); // one year
    this.translateService.onLangChange.subscribe(({ lang }) =>
      McUtils.setCookie('LOCALE', lang.toLowerCase(), { path: '/', expires: date })
    );

    this.languages = languages;
    const langs = languages.map(({ code }) => code);
    this.translateService.addLangs(langs);
    this.translateService.setDefaultLang(defaultLang);

    const userLang = McUtils.getCookie('LOCALE');
    if (this.translateService.langs.includes(userLang)) {
      return this.translateService.use(userLang);
    }

    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(this.translateService.langs.includes(browserLang) ? browserLang : defaultLang);
  }

  public translateProps(translatedObject: object, options: McTranslatePropsOptions) {
    const translate = () => {
      const translatableProperties = getTranslatableProperties(translatedObject, options);
      const translationKeys = Object.keys(translatableProperties);

      this.get(translationKeys).subscribe(translateResult => {
        translationKeys.forEach(translationKey => {
          const property = translatableProperties[translationKey];
          const translated = translateResult[translationKey];
          setTranslatedProperty(translatedObject, property, translated);
        });

        return typeof options.afterTranslateCallback === 'function' && options.afterTranslateCallback();
      });
    };

    translate(); // translate immediately on init
    this.onLangChange.subscribe(translate);
  }
}
