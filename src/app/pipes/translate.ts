import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'translate',
  pure: false
})
export class TranslateWordPipe implements PipeTransform {
  private phrase = null;
  constructor(private translate: TranslateService) { }
  transform(items, value): string {
      this.translate.get(items, value).subscribe((res: string) => {
      //=> 'hello world'
      this.phrase = res;
      return this.phrase;
    });
    return this.phrase;
  }
}
