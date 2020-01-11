import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { Movie } from '../../models/movie.model';

import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { YoutubeApiService } from '../../providers/youtube-api-service';

import { Plugins, Capacitor } from '@capacitor/core';

import { ModalController } from '@ionic/angular';
import { YoutubeModalComponent } from '../../modals/youtube-modal/youtube.modal';
import { CommentModalComponent } from '../../modals/comment-modal/comment.modal';
import { ShowCommentsModalComponent } from '../../modals/show-comments-modal/show.comments.modal';
import { ShowActorsModalComponent } from '../../modals/show-actors-modal/show.actors.modal';

import { LikeMovie, FavoriteMovie } from '../../store/actions/movies.actions';
import { MovieState } from '../../store/state/movies.state';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { IziToastService } from '../../providers/izi-toast.service';
import { WavesService } from '../../providers/waves-service';
import { Game, Round } from '../../models/game.model';
import { GamesService } from '../../providers/games-service';
import { GameState } from '../../store/state/games.state';

@Component({
  selector: 'app-page-game-details',
  templateUrl: './game-details.html',
  styleUrls: ['./game-details.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GameDetailsComponent implements OnInit {

  currentYear = new Date().getFullYear();
  selectedMovie: Observable<Movie>;
  selectedGame: Observable<Game>;
  movie: Movie;
  game: Game;
  games: Game[] = [];
  currentGame: Game = null;
  currentRound: Round = null;
  defaultSelectedRadio = "gamer_2";
  numberRound = 1;
  startMinNumberRange = 0;
  startMaxNumberRange = 1023;
  firstRangeMin = 0;
  firstRangeMax = 0;
  secondRangeMin = 0;
  secondRangeMax = 0;
  isWinnerRangeUp = false
  avgRange = 0;
  showSecretGame = false;


  //Get value on ionChange on IonRadioGroup
  selectedRadioGroup: any;
  //Get value on ionSelect on IonRadio item
  selectedRadioItem: any;

  radio_list = [
    {
      id: '1',
      name: 'radio_list',
      value: 'gamer_1',
      text: 'Gamer1',
      disabled: false,
      checked: false,
      color: 'primary'
    }, {
      id: '2',
      name: 'radio_list',
      value: 'gamer_2',
      text: 'Gamer2',
      disabled: false,
      checked: true,
      color: 'secondary'
    }, {
      id: '3',
      name: 'radio_list',
      value: 'gamer_3',
      text: 'Gamer3',
      disabled: false,
      checked: false,
      color: 'danger'
    },
  ];
  genreImages: string[] = ['action', 'comedy', 'crime', 'documentary', 'drama', 'fantasy', 'film noir',
    'horror', 'romance', 'science fiction', 'westerns', 'animation', 'food'];

  constructor(private store: Store, private youtubeApiService: YoutubeApiService, private modalCtrl: ModalController,
    private activatedRoute: ActivatedRoute, private iziToast: IziToastService, private wavesService: WavesService, private gamesService: GamesService) {
  }

  ngOnInit() {

    this.startNewGame()
    this.currentRound = new Round();
    this.currentRound.numberRound = 1;
    this.defineRanges(this.startMinNumberRange, this.startMaxNumberRange);
    console.log('#################this.currentRound :', this.currentRound);
  }
  ionViewWillEnter() {
    // console.log('ionViewWillEnter');

    /*
    this.selectedMovie = this.store.select(state => state.catalog.selectedMovie);

    this.selectedMovie.subscribe(
      data => {
          // console.log(data);
          this.movie = data;
          if (this.movie !== null) {
            const genre = this.movie.genre.toLowerCase().split(',', 1)[0];
            if (this.genreImages.indexOf(genre) !== -1) {
              this.movie.genreImage = 'assets/movies-genres/' + genre + '.png';
            }
          }
      },
      error => {
          console.log(<any>error);
      }
    );
    */
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('id :', id);
    this.getGameDetails(id);
  }

  getGameDetails(id: string) {
    console.log('id :', id);
    this.selectedGame = this.store.select(GameState.gameById).pipe(map(filterFn => filterFn(id)));
    this.selectedGame.subscribe(game => {
      console.log(game);
      this.game = game;
      if (this.game !== null) {
        const genre = this.game.genre.toLowerCase().split(',', 1)[0];
        if (this.genreImages.indexOf(genre) !== -1) {
          this.game.genreImage = 'assets/movies-genres/' + genre + '.png';
        }
      }
    });
  }

  watchTrailer() {
    console.log('GameDetailssPage::watchTrailer | method called');

    //  Code to use Youtube Api Service: providers/youtube-api-service.ts
    this.youtubeApiService.searchMovieTrailer(this.movie.title)
      .subscribe(result => {
        if (result.items.length > 0) {
          console.log(result);
          const { videoId } = result.items[0].id;
          this.movie.videoId = videoId;

          // Code to use capacitor-youtube-player plugin.
          console.log('GameDetailssPage::watchTrailer -> platform: ' + Capacitor.platform);
          if (Capacitor.platform === 'web') {
            const componentProps = { modalProps: { item: this.movie } };
            this.presentModal(componentProps, YoutubeModalComponent);
          } else { // Native
            this.testYoutubePlayerPlugin();
          }

          /*
          if (Capacitor.platform === 'web') {
            window.open('https://www.youtube.com/watch?v=' + videoId);
          } else { // TODO: Use capacitor-youtube-player plugin.
            window.open('https://www.youtube.com/watch?v=' + videoId, '_blank');
          }
          */
        }
      },
        error => {
          this.iziToast.show('Watch Trailer', 'Sorry, an error has occurred.', 'red', 'ico-error', 'assets/avatar.png');
        });

  }

  async presentModal(componentProps: any, component) {
    console.log('GameDetailssPage::presentModal | method called -> movie', this.movie);
    // const componentProps = { modalProps: { item: this.movie}};
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

  async testYoutubePlayerPlugin() {

    const { YoutubePlayer } = Plugins;

    const result = await YoutubePlayer.echo({ value: 'hola' });
    console.log('result', result);

    const options = { width: 640, height: 360, videoId: this.movie.videoId };
    const playerReady = await YoutubePlayer.initialize(options);
  }

  onClickLike() {
    console.log('GameDetailssPage::onClickLike');
    console.log(this.movie);
    if (typeof this.movie.likes === 'undefined') {
      this.movie.likes = 0;
    }
    console.log(this.movie.likes);
    this.movie.likes += 1;
    this.store.dispatch(new LikeMovie(this.movie));
  }

  onClickComment() {
    console.log('GameDetailssPage::onClickComment');
    const componentProps = { modalProps: { title: 'Comment', movie: this.movie } };
    this.presentModal(componentProps, CommentModalComponent);
  }

  onClickShowComment() {
    console.log('GameDetailssPage::onClickShowComment');
    const componentProps = { modalProps: { title: 'Comments', movie: this.movie } };
    this.presentModal(componentProps, ShowCommentsModalComponent);
  }

  onClickFavorite() {
    console.log('GameDetailssPage::onClickFavorite');

    if (typeof localStorage.getItem('@@STATE') !== 'undefined') {
      const state = JSON.parse(localStorage.getItem('@@STATE'));
      const favorites = state.catalog.favorites;

      if (typeof favorites !== 'undefined') {

        const exist = favorites.filter(item => {
          return item.title === this.movie.title;
        });

        if (exist.length === 0) {
          this.store.dispatch(
            new FavoriteMovie(this.movie)).subscribe(() => {
              this.iziToast.success('Favorite movie', 'Favorite Movie added.');
            });
        } else {
          this.iziToast.show('Favorite movie', 'The movie has already been added.', 'red', 'ico-error', 'assets/avatar.png');
        }
      }
    }
  }

  onClickShare() {
    console.log('GameDetailssPage::onClickShare');
    if (navigator['share']) {
      navigator['share']({
        title: 'WebShare API Demo',
        url: 'https://codepen.io/ayoisaiah/pen/YbNazJ'
      }).then(() => {
        console.log('Thanks for sharing!');
      })
        .catch(console.error);
    } else {
      // fallback
    }
  }

  showActors() {
    console.log('GameDetailssPage::showActors | method called');
    const componentProps = { modalProps: { actors: this.movie.cast } };
    this.presentModal(componentProps, ShowActorsModalComponent);
  }

  radioGroupChange(event) {
    console.log("radioGroupChange", event.detail);
    this.selectedRadioGroup = event.detail;
  }

  radioFocus() {
    console.log("radioFocus");
  }
  radioSelect(event) {
    console.log("radioSelect", event.detail);
    this.selectedRadioItem = event.detail;
  }
  radioBlur() {
    console.log("radioBlur");
  }

  makeBet() {
    return this.wavesService.makeBet(0.5);
  }
  makeBetDown() {
    if (!this.currentRound.gamersBetUp.includes(this.selectedRadioGroup.value)) {
      this.currentGame.bank += 1;
      this.currentRound.gamersBetDown.push(this.selectedRadioGroup.value);
    } else {
      console.log('had opposite bit :');
    }

  }
  makeBetUp() {
    if (!this.currentRound.gamersBetDown.includes(this.selectedRadioGroup.value)) {
      this.currentRound.gamersBetUp.push(this.selectedRadioGroup.value);
      this.currentGame.bank += 1;
    } else {
      console.log('had opposite bit :');
    }

  }
  defineRanges(minNumber: number, maxNumber: number) {
    let sumMinAndMax = maxNumber + minNumber;
    this.avgRange = sumMinAndMax % 2 === 0 ? sumMinAndMax / 2 : (sumMinAndMax + 1) / 2;
    this.firstRangeMin = minNumber;
    this.firstRangeMax = this.avgRange - 1;
    this.secondRangeMin = this.avgRange;
    this.secondRangeMax = maxNumber;
    this.currentRound.minNumberRange = minNumber;
    this.currentRound.maxNumberRange = maxNumber;
  }

  setRange(isWinnerDirectionUp: boolean, lastAvgRange: number, minRange: number, maxRange: number) {
    if (isWinnerDirectionUp) {
      this.defineRanges(lastAvgRange, maxRange);
    } else {
      this.defineRanges(minRange, lastAvgRange - 1);
    }
  }
  checkOppositeBet() {
    if (this.currentRound.gamersBetDown.length > 0 && this.currentRound.gamersBetUp.length > 0)
      return true;
  }

  nextRound() {
    if (this.checkOppositeBet()) {
      console.log('++++nextRoundthis.currentGame :', this.currentGame);
      const round = this.currentRound;
      this.currentGame.rounds.push(this.currentRound);
      this.currentRound = new Round();
      this.numberRound++;
      this.currentRound.isLastWinnerRangeUp = this.winnerRangeDirection();

      if ((this.numberRound % 11 === 0)) {
        const secretNumber = (this.currentRound.isLastWinnerRangeUp) ?
          round.maxNumberRange : round.minNumberRange;
        this.currentGame.secretNumberOfGame = secretNumber;
        this.showSecretGame = true;
      } else if ((this.numberRound === 12)) {

        this.numberRound = 1;
        this.showSecretGame = false;
        this.startNewGame(this.currentGame);
        this.defineRanges(this.startMinNumberRange, this.startMaxNumberRange);
      }
      else {
        this.showSecretGame = false;
        this.setRange(this.currentRound.isLastWinnerRangeUp, this.avgRange, round.minNumberRange, round.maxNumberRange);
      }
      this.currentRound.numberRound = this.numberRound;
    }
  }

  startNewGame(game?: Game) {
    this.currentGame = new Game();
    if (!game) {
      this.currentGame.numberGame = 1;
    } else {
      this.games.push(game);
      this.currentGame.numberGame = game.numberGame + 1;
    }
    this.currentGame.bank = 0;
  }
  winnerRangeDirection() {
    return this.isWinnerRangeUp = Math.round((Math.random() * 1) + 0) === 0;
  }
}
