import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { GameDetailsComponent } from './game-details';
import { GameDetailsComponentRoutingModule } from './game-details-routing.module';


import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StarRatingModule } from 'angular-star-rating';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    GameDetailsComponentRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    StarRatingModule.forRoot()
  ],
  declarations: [GameDetailsComponent],
  entryComponents: [GameDetailsComponent],
})
export class GameDetailsModule {}
