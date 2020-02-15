import { NgModule } from '@angular/core';
import { GameDetailsModule } from './game-details/game-details.module';
import { StatisticModule } from './statistic/statistic.module';
import { InfoModule } from './info/info.module';
// import { DetailModule } from './detail/detail.module';

@NgModule({
  imports: [
    GameDetailsModule,
    StatisticModule,
    InfoModule
  ]
   /*  declarations: [CommentModalComponent, ShowCommentsModalComponent, ShowActorsModalComponent,
    YoutubeModalComponent] */
})
export class PagesModule {}
