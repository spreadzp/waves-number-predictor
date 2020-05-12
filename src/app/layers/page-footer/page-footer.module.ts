import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StarRatingModule } from 'angular-star-rating';
import { ShowCommentsModalComponent } from '../../modals/show-comments-modal/show.comments.modal';
import { ShowActorsModalComponent } from '../../modals/show-actors-modal/show.actors.modal';
import { CountdownModule } from 'ngx-countdown';
import { TranslateWordPipe } from '../../pipes/translate';
import { TranslateWordModule } from '../../pipes/translate.modules';
import { PageFooterComponent } from './page-footer.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    StarRatingModule.forRoot(),
    CountdownModule,
    TranslateWordModule
  ],
  exports: [
    PageFooterComponent
  ],
  declarations: [PageFooterComponent],
  entryComponents: [PageFooterComponent],
})
export class PageFooterModule { }
