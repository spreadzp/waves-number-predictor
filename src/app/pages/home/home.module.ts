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

import { GenreCarouselComponent } from '../../components/genre-carousel/genre-carousel.component';

import { FilterPipe } from '../../pipes/filter.pipe';
import { GameCarouselComponent } from '../../components/game-carousel/game-carousel.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    HomeComponentRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    StarRatingModule.forRoot()
  ],
  declarations: [HomeComponent, FilterMoviePopoverComponent, FavoritesMoviesModalComponent, GenreCarouselComponent, GameCarouselComponent,
                 FilterPipe],
  entryComponents: [HomeComponent, FilterMoviePopoverComponent, FavoritesMoviesModalComponent, GenreCarouselComponent, GameCarouselComponent],
})
export class HomeModule {}
