import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StarRatingModule } from 'angular-star-rating';
import { CommentModalComponent } from '../../modals/comment-modal/comment.modal';
import { ShowCommentsModalComponent } from '../../modals/show-comments-modal/show.comments.modal';
import { ShowActorsModalComponent } from '../../modals/show-actors-modal/show.actors.modal';
import { CountdownModule } from 'ngx-countdown';
import { TranslateWordPipe } from '../../pipes/translate';
import { TranslateWordModule } from '../../pipes/translate.modules';
import { InfoComponent } from './info';
import { InfoComponentRoutingModule } from './info-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    InfoComponentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    StarRatingModule.forRoot(),
    CountdownModule,
    TranslateWordModule

  ],
  declarations: [InfoComponent],
  entryComponents: [InfoComponent],
})
export class InfoModule {}
