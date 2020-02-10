import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';

import { Store } from '@ngxs/store';
import { Movie } from '../../models/movie.model';

import { DeleteFavoriteMovie, DeleteAllFavoritesMovies } from '../../store/actions/movies.actions';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../providers/language.service';

@Component({
  selector: 'app-languages-modal',
  templateUrl: './languages.modal.html',
  styleUrls: ['./languages.modal.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LanguagesModalComponent implements OnInit {

  modal: any = {
    title: ''
  };
  languages = [
    { lang: 'en', src: 'assets/flags/en.svg' },
    { lang: 'ru', src: 'assets/flags/ru.svg' },
    { lang: 'zh', src: 'assets/flags/zh.svg' }
  ];

  constructor(private modalCtrl: ModalController, private navParams: NavParams, private store: Store, private router: Router,
    private alertCtrl: AlertController, private translate: LanguageService) {
  }

  ngOnInit() {
    this.modal = { ...this.navParams.data.modalProps };
    console.log(this.modal);
    this.deleteAll();
  }

  dismiss() {
    // Using the injected ModalController this page
    // can "dismiss" itself and pass back data.
    // console.log('dismiss', data);
    this.modalCtrl.dismiss();
  }

  viewMovieDetails(movie: Movie) {
    // console.log('viewMovieDetails', movie);
    const movieDetailsURL = `/detail/${movie.id}`;
    this.router.navigate([movieDetailsURL]);
    this.modalCtrl.dismiss();
  }

  deleteFavoriteMovie(movie: Movie) {
    console.log('LanguagesModalComponent::deleteFavoriteMovie() | method called');
    this.store.dispatch(new DeleteFavoriteMovie(movie));
    this.modal.favoritesMovies = this.modal.favoritesMovies.filter(m => m.title !== movie.title);
  }

  deleteAll() {
    console.log('LanguagesModalComponent::deleteAll() | method called');
    this.modal.favoritesMovies = [];
    const state = JSON.parse(localStorage.getItem('@@STATE'));
    console.log('state', state);
    state.catalog.favorites = [];
    // TODO: Dispatch deleteAll action.
    this.store.dispatch(new DeleteAllFavoritesMovies());
  }

  choiseLanguage(language) {
    console.log('language:', language);
    this.translate.use(language)
  }

  async presentAlertConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Delete all favorites',
      message: 'Are you sure you want to delete all the favorites?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this.deleteAll();
          }
        }
      ]
    });

    await alert.present();
  }

}
