import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HomeComponent } from './home';
import { FavoritesMoviesModalComponent } from '../../modals/favorites-movies-modal/favorites.movies.modal';
import { FilterMoviePopoverComponent } from '../../popovers/filter-movie.popover';
import { HomeComponentRoutingModule } from './home-routing.module';

import { NgSelectModule } from '@ng-select/ng-select';

import { StarRatingModule } from 'angular-star-rating';

import { FilterPipe } from '../../pipes/filter.pipe';
import { GameCarouselComponent } from '../../components/game-carousel/game-carousel.component';
import { TranslateWordPipe } from '../../pipes/translate';
import { LanguagesModalComponent } from '../../modals/languages-modal/languages.modal';
import { TooltipsModule } from 'ionic4-tooltips';
import { TranslateWordModule } from '../../pipes/translate.modules';
import { PageFooterModule } from '../../layers/page-footer/page-footer.module';
import { PageHeaderModule } from '../../layers/page-header/page-header.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HomeComponentRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    StarRatingModule.forRoot(),
    TooltipsModule.forRoot(),
    TranslateWordModule,
    PageFooterModule,
    PageHeaderModule
  ],
  declarations: [
    HomeComponent,
    GameCarouselComponent,
    FilterPipe,
  ],
  entryComponents: [
    HomeComponent,
    GameCarouselComponent,
  ],
})
export class HomeModule {}
