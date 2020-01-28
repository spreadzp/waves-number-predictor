import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { GameDetailsComponent } from './game-details';
import { GameDetailsComponentRoutingModule } from './game-details-routing.module';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StarRatingModule } from 'angular-star-rating';
import { CommentModalComponent } from '../../modals/comment-modal/comment.modal';
import { ShowCommentsModalComponent } from '../../modals/show-comments-modal/show.comments.modal';
import { ShowActorsModalComponent } from '../../modals/show-actors-modal/show.actors.modal';
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    GameDetailsComponentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    StarRatingModule.forRoot(),
    CountdownModule
  ],
  declarations: [GameDetailsComponent, CommentModalComponent, ShowCommentsModalComponent, ShowActorsModalComponent],
  entryComponents: [GameDetailsComponent, CommentModalComponent, ShowCommentsModalComponent, ShowActorsModalComponent],
})
export class GameDetailsModule {}
