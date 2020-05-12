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
import { PageHeaderComponent } from './page-header.component';
import { TooltipsModule } from 'ionic4-tooltips';
import { NgSelectModule } from '@ng-select/ng-select';
import { FilterMoviePopoverComponent } from '../../popovers/filter-movie.popover';
import { LanguagesModalComponent } from '../../modals/languages-modal/languages.modal';
import { FavoritesMoviesModalComponent } from '../../modals/favorites-movies-modal/favorites.movies.modal';
import { FilterPipe } from '../../pipes/filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    StarRatingModule.forRoot(),
    TooltipsModule.forRoot(),
    TranslateWordModule,
  ],
  exports: [
    PageHeaderComponent
  ],
  declarations: [
    PageHeaderComponent,
    FilterMoviePopoverComponent,
    LanguagesModalComponent,
    FavoritesMoviesModalComponent,
  ],
  entryComponents: [
    PageHeaderComponent,
    FilterMoviePopoverComponent,
    LanguagesModalComponent,
    FavoritesMoviesModalComponent
  ],
})
export class PageHeaderModule { }
