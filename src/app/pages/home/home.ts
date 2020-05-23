import { Component, ViewEncapsulation, OnInit, ViewChild, ElementRef, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { Movie } from '../../models/movie.model';

import { ModalController, PopoverController, IonInfiniteScroll, IonContent } from '@ionic/angular';

import { Store, Select, Actions, ofActionSuccessful } from '@ngxs/store';

import {
  FetchMovies, DeleteMovie, AddMovie, EditMovie, /*SearchMovies,*/
  ClearMovies
} from '../../store/actions/movies.actions';
import { Observable } from 'rxjs';

//import { MovieModalComponent } from '../../modals/movie-modal/movie.modal';
import { FilterMoviePopoverComponent } from '../../popovers/filter-movie.popover';
import { FavoritesMoviesModalComponent } from '../../modals/favorites-movies-modal/favorites.movies.modal';

import { withLatestFrom } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

import { IziToastService } from '../../providers/izi-toast.service';
import { Game, GamerBet } from '../../models/game.model';
import { FetchGames } from '../../store/actions/games.actions';
import { trigger, state, transition, style, query, animate } from '@angular/animations';
import { fadeInAnimation } from '../../animations/fade-in.animation';
import { TranslateService } from '@ngx-translate/core';
import { LanguagesModalComponent } from '../../modals/languages-modal/languages.modal';
import { LanguageService } from '../../providers/language.service';
import { GameCarouselComponent } from '../../components/game-carousel/game-carousel.component';
import { SoundsService } from '../../providers/sounds.service';

@Component({
  selector: 'app-page-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class HomeComponent implements OnInit {

  currentYear = new Date().getFullYear();
  // Reads the name of the store from the store class.
  @Select(state => state.catalog.movies) movies$: Observable<Movie[]>;
  @Select(state => state.catalogGame.games) games$: Observable<Game[]>;
  // movies$: Observable<Movie[]>;
  title = 'TITLE_GAME';
  start: number;
  end: number;
  showScrollTop: Boolean = false;
  @ViewChild('infiniteScroll', { read: ElementRef, static: true }) infiniteScroll: IonInfiniteScroll;
  showSkeleton: Boolean = true;
  // movies: Movie[];
  @ViewChild(IonContent, { read: ElementRef, static: true }) content: IonContent;
  searchControl: FormControl;
  iconView = 'apps';
  typeChoisedIcon: string;
  @ViewChild(GameCarouselComponent, { read: ElementRef, static: true }) carousel: GameCarouselComponent;


  constructor(private store: Store, private router: Router, private modalCtrl: ModalController,
    private actions$: Actions,
    private iziToast: IziToastService) {
    console.log('constructor home');
    this.start = 0;
    this.end = 50;
    this.searchControl = new FormControl();

  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');

    /*
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      // console.log('this.searchControl.valueChanges', search);
      if (search === '') {
        this.start = 0;
        this.end = 20;
        this.store.dispatch([
          new ClearMovies(),
          new FetchMovies({start: this.start, end: this.end})
        ]);
      } else {
        this.store.dispatch(new SearchMovies({queryText: search}));
      }
    });
    */

  }

  ngOnInit() {
    console.log('ngOnInit home');
    // this.fetchMovies(this.start, this.end);
    this.fetchGames(this.start, this.end);
    // Check if we have movies in local storage.
    if (localStorage.getItem('@@STATE') !== 'undefined') {
      const state = JSON.parse(localStorage.getItem('@@STATE'));
      console.log('state', state);
      // const { movies } = state.catalog;
      // console.log('movies', movies);
    }

    this.actions$.pipe(ofActionSuccessful(AddMovie)).subscribe(() => {
      this.modalCtrl.dismiss();
      this.iziToast.success('Add movie', 'Movie added successfully.');
    },
      err => console.log('HomePage::ngOnInit ofActionSuccessful(AddMovie) | method called -> received error' + err));

    this.actions$.pipe(ofActionSuccessful(EditMovie)).subscribe(() => {
      this.modalCtrl.dismiss();
      this.iziToast.success('Edit movie', 'Movie updated successfully.');
    },
      err => console.log('HomePage::ngOnInit ofActionSuccessful(EditMovie) | method called -> received error' + err));

    this.actions$.pipe(ofActionSuccessful(DeleteMovie)).subscribe(() => {
      this.iziToast.success('Delete movie', 'Movie deleted successfully.');
    },
      err => console.log('HomePage::ngOnInit ofActionSuccessful(DeleteMovie) | method called -> received error' + err));

  }

  fetchMovies(start, end) {
    console.log('HomePage::fetchMovies | method called', start, end);
    // this.presentLoading();
    this.store.dispatch(new FetchMovies({ start: start, end: end })).pipe(withLatestFrom(this.movies$))
      .subscribe(([movies]) => {
        console.log('movies', movies);
        setTimeout(() => {
          // this.dismissLoading();
          this.showSkeleton = false;
        }, 2000);
      },
        err => console.log('HomePage::fetchMovies() | method called -> received error' + err)
      );
  }

  fetchGames(start, end) {
    console.log('HomePage::fetchGames | method called', start, end);
    // this.presentLoading();
    this.store.dispatch(new FetchGames({ start: start, end: end })).pipe(withLatestFrom(this.games$))
      .subscribe(([games]) => {
        console.log('movies', games);
        setTimeout(() => {
          // this.dismissLoading();
          this.showSkeleton = false;
        }, 2000);
      },
        err => console.log('HomePage::fetchGames() | method called -> received error' + err)
      );
  }

  setTypeIcon(event: string) {
    this.typeChoisedIcon = event.toLowerCase();
  }

  viewGameDetails(item: Movie | Game) {
    // console.log('viewMovieDetails', movie);
    console.log('this.carousel ; :', this.carousel);
    if ((item as Game).gameOver === true) {
      const selectedGame = (item as Game);
      this.showGameOver(selectedGame.secretNumberOfGame, selectedGame.winners);
    } else if (this.typeChoisedIcon === 'statistic') {
      this.router.navigate(['/statistic']);
    } else {
      console.log('item as Game :', item as Game);
      const route = (item as Game).rounds !== undefined ? '/game-details/' : '/detail/';
      console.log('!!!!!!!!!!!route  :', route);
      const detailsURL = `${route}${item.id}`;
      this.router.navigate([detailsURL]);
    }

  }

  showGameOver(secretNumber: any, winners: GamerBet[]) {
    let listWinnersWithPrizes = '';
    for (const item of winners) {
      listWinnersWithPrizes += `${item.addressGamer} : ${item.sumBets}`;
    }
    this.iziToast.gameOver(`The game is over! Secret number of the game is ${secretNumber}`,
      `Winners got prize ${listWinnersWithPrizes}`);
  }

  async presentModal(componentProps: any, component) {
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: componentProps
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      console.log('data', data);
    }
  }

  addMovie() {
    // console.log('addMovie');
    const componentProps = { modalProps: { title: 'Add Movie', buttonText: 'Add Movie' }, option: 'add' };
    //this.presentModal(componentProps, MovieModalComponent);
  }

  editMovie(movie: Movie) {
    // console.log('editMovie', movie);
    const componentProps = { modalProps: { title: 'Edit Movie', buttonText: 'Edit Movie', movie: movie }, option: 'edit' };
    //this.presentModal(componentProps, MovieModalComponent);
  }

  deleteMovie(movie: Movie) {
    // console.log('deleteMovie', movie);
    this.store.dispatch(new DeleteMovie(movie));
  }

  doInfinite(event) {
    console.log('doInfinite', event);
    event.target.complete();
    this.showSkeleton = true;
    this.start = this.end;
    this.end += 50;
    this.showScrollTop = true;
    this.fetchMovies(this.start, this.end);
  }



  scrollToTop() {
    // console.log('scrollToTop', this.content);
    this.content['nativeElement'].scrollToTop();
  }

}
