import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class LanguageService {
  constructor(private translate: TranslateService) {

  }
  use(lang: string) {
    this.translate.use(lang);
  }

  setDefaultLang(lang: string) {
    this.translate.setDefaultLang(lang);
  }
}
