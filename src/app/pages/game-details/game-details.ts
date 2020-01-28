import { Component, ViewEncapsulation, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, Subscription, timer } from 'rxjs';

import { YoutubeApiService } from '../../providers/youtube-api-service';

import { Plugins, Capacitor } from '@capacitor/core';

import { ModalController } from '@ionic/angular';
import { YoutubeModalComponent } from '../../modals/youtube-modal/youtube.modal';
import { CommentModalComponent } from '../../modals/comment-modal/comment.modal';
import { ShowCommentsModalComponent } from '../../modals/show-comments-modal/show.comments.modal';
import { ShowActorsModalComponent } from '../../modals/show-actors-modal/show.actors.modal';

import { LikeMovie, FavoriteMovie } from '../../store/actions/movies.actions';
import { map, skip, takeUntil, filter, scan, withLatestFrom } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

import { IziToastService } from '../../providers/izi-toast.service';
import { WavesService } from '../../providers/waves-service';
import { Game, Round, DirectionBet, GamerBet } from '../../models/game.model';
import { GamesService } from '../../providers/games-service';
import { GameState } from '../../store/state/games.state';
import { LikeGame, AddGame, FilterGames, EditGame } from '../../store/actions/games.actions';
import { SoundsService } from '../../providers/sounds.service';
import { interval } from 'rxjs/observable/interval';
import { CountdownComponent } from 'ngx-countdown';

@Component({
  selector: 'app-page-game-details',
  templateUrl: './game-details.html',
  styleUrls: ['./game-details.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GameDetailsComponent implements OnInit, AfterViewInit {

  currentYear = new Date().getFullYear();
  selectedGame: Observable<Game>;
  // movie: Movie;
  game: Game;
  games: Game[] = [];
  currentGame: Game = null;
  currentRound: Round = null;
  defaultSelectedRadio = "gamer_2";
  numberRound = 1;
  // timeNextRound = 10;
  startMinNumberRange = 0;
  startMaxNumberRange = 7;
  degreeGame = Math.log2(this.startMaxNumberRange + 1);
  downRange = '';
  upRange = '';
  firstRangeMin = 0;
  firstRangeMax = 0;
  secondRangeMin = 0;
  secondRangeMax = 0;
  isWinnerRangeUp = false
  avgRange = 0;
  showSecretGame = false;
  betValue = 1;
  timerEndRound: Subscription;
  timeLeft: number = 60;
  interval;
  subscribeTimer: any;
  configTime = { leftTime: 30 };
  filters: any = {
    typeGame: 128,
    id: ''
  }


  //Get value on ionChange on IonRadioGroup
  selectedRadioGroup: any;
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

  @ViewChild('betDown', { static: false }) betDown: any;
  @ViewChild('betUp', { static: false }) betUp: any;
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  constructor(private store: Store, private youtubeApiService: YoutubeApiService, private modalCtrl: ModalController,
    private activatedRoute: ActivatedRoute, private iziToast: IziToastService, private wavesService: WavesService,
    private gamesService: GamesService, private soundsService: SoundsService) {
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    const gameFromId = this.getGameDetails(id);
    this.currentRound = new Round();
    this.setImageGame(gameFromId);
    // this.startNewGame(); start 128 512 1024 type of games
    /* this.notFinishGame(this.startMaxNumberRange + 1)
      .subscribe(game => {
        if (!game) {
          this.startNewGame();
        }
      }); */
    gameFromId.subscribe(game => {
      if (!game) {
        console.log('????game :', game);
        //  this.startNewGame();
        this.defineRanges(this.startMinNumberRange, this.startMaxNumberRange);
      }
      if (game.gameOver) {
        this.showGameOver(game.secretNumberOfGame, game.winners);
      } else {
        this.currentGame = game;
        this.defineCurrentRound(this.currentGame.rounds);
        const numRounds = this.currentRound.numberRound - 1;
        console.log('numRounds :', numRounds);
        this.defineRanges(this.currentGame.rounds[this.currentRound.numberRound - 1].minNumberRange,
          this.currentGame.rounds[this.currentRound.numberRound - 1].maxNumberRange);
      }
    })
    console.log('#################this.currentRound :', this.currentRound);
  }

  defineCurrentRound(rounds: Round[]) {
    // this.currentRound = new Round();
    if (rounds && rounds.length) {
      this.currentRound.numberRound = rounds.length + 1 ;
    } else {
      this.currentRound.numberRound = 1
    }
  }

  ngAfterViewInit() {
    this.soundsService.preload('click', 'assets/sounds/click.mp3');
    if (this.betDown && this.betUp) {
      this.betDown.ionChange.pipe(skip(1)).subscribe((ev) => {

        this.soundsService.play('click');

      });
      this.betUp.ionChange.pipe(skip(1)).subscribe((ev) => {

        this.soundsService.play('click');

      });
    }
  }

  notFinishGame(typeGame: number): Observable<Game> {
    this.filters.typeGame = typeGame;
    return this.store.dispatch([
      new FilterGames(this.filters.typeGame),
    ]);
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter');


    /* this.selectedGame = this.store.select(state => state.catalogGame.selectedGame);
    console.log('this.selectedGame :', this.selectedGame);
    this.selectedGame.subscribe(
      data => {
           console.log('@@data',data);
          this.game = data;
          if (this.game !== null) {
            const genre = this.game.genre.toLowerCase().split(',', 1)[0];
            if (this.genreImages.indexOf(genre) !== -1) {
              this.game.genreImage = 'assets/movies-genres/' + genre + '.png';
            }
          }
      },
      error => {
          console.log(<any>error);
      }
    );  */

    /* const id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('id :', id);
    this.getGameDetails(id); */
  }

  getGameDetails(id: string) {
    console.log('id :', id);
    return this.store.select(GameState.gameById).pipe(map(filterFn => filterFn(id)));

  }

  setImageGame(game: Observable<Game>) {
    game.subscribe(game => {
      console.log(game);
      this.game = game;
      console.log('187 this.game :', this.game);
      let genre = '';
      if (this.game && this.game.genre) {
        genre = this.game.genre.toLowerCase().split(',', 1)[0];
        if (this.genreImages.indexOf(genre) !== -1) {
          this.game.genreImage = 'assets/movies-genres/' + genre + '.png';
        }
      } else {
        genre = 'action';
        if (this.game && this.genreImages.indexOf(genre) !== -1) {
          this.game.genreImage = 'assets/movies-genres/' + genre + '.png';
        }
      }
    });
  }

  watchTrailer() {
    console.log('GameDetailssPage::watchTrailer | method called');

    //  Code to use Youtube Api Service: providers/youtube-api-service.ts
    this.youtubeApiService.searchMovieTrailer(this.game.title)
      .subscribe(result => {
        if (result.items.length > 0) {
          console.log(result);
          const { videoId } = result.items[0].id;
          //this.game.videoId = videoId;

          // Code to use capacitor-youtube-player plugin.
          console.log('GameDetailssPage::watchTrailer -> platform: ' + Capacitor.platform);
          if (Capacitor.platform === 'web') {
            const componentProps = { modalProps: { item: this.game } };
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
    console.log('GameDetailssPage::presentModal | method called -> movie', this.game);
    // const componentProps = { modalProps: { item: this.game}};
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

    //const options = { width: 640, height: 360, videoId: this.game.videoId };
    //const playerReady = await YoutubePlayer.initialize(options);
  }

  onClickLike() {
    console.log('GameDetailssPage::onClickLike');
    console.log(this.game);
    if (typeof this.game.likes === 'undefined') {
      this.game.likes = 0;
    } else {
      console.log(this.game.likes);
      this.game.likes += 1;
    }

    this.store.dispatch(new LikeGame(this.game));
  }

  onClickComment() {
    console.log('GameDetailssPage::onClickComment');
    const componentProps = { modalProps: { title: 'Comment', game: this.game } };
    this.presentModal(componentProps, CommentModalComponent);
  }

  onClickShowComment() {
    console.log('GameDetailssPage::onClickShowComment');
    const componentProps = { modalProps: { title: 'Comments', game: this.game } };
    this.presentModal(componentProps, ShowCommentsModalComponent);
  }

  onClickFavorite() {
    console.log('GameDetailssPage::onClickFavorite');

    if (typeof localStorage.getItem('@@STATE') !== 'undefined') {
      const state = JSON.parse(localStorage.getItem('@@STATE'));
      const favorites = state.catalog.favorites;

      if (typeof favorites !== 'undefined') {

        const exist = favorites.filter(item => {
          return item.title === this.game.title;
        });

        if (exist.length === 0) {
          this.store.dispatch(
            new FavoriteMovie(this.game)).subscribe(() => {
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

  showGamers() {
    console.log('GameDetailssPage::showActors | method called');
    console.log('this.currentGame :', this.currentGame);
    const componentProps = {
      modalProps: {
        game: this.currentGame
      }
    };
    this.presentModal(componentProps, ShowActorsModalComponent);
  }

  radioGroupChange(event) {
    // console.log("radioGroupChange", event.detail);
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

  defineRange(flagRange: DirectionBet) {
    if (flagRange === DirectionBet.RangeDown) {
      return (this.firstRangeMax - this.firstRangeMin) === 0 ?
        this.firstRangeMax.toString() : this.firstRangeMin.toString() + " - " + this.firstRangeMax.toString();

    } else {
      return (this.secondRangeMax - this.secondRangeMin) === 0 ?
        this.secondRangeMax.toString() : this.secondRangeMin.toString() + " - " + this.secondRangeMax.toString()
    }
  }

  makeBetDown() {
    if (!this.currentRound.gamersBetUp.includes(this.selectedRadioGroup.value)) {
      this.currentRound.gamersBetDown.push(this.selectedRadioGroup.value);
      this.currentGame.bank += this.betValue;
      this.currentGame.rounds[this.currentRound.numberRound - 1].gamersBetUp.push(this.selectedRadioGroup.value);1
      this.store.dispatch(
        new EditGame(this.currentGame)
      ).subscribe((t) => console.log('471 t :', t)
      );
      // this.soundsService.play('click');
      this.iziToast.success(`Success bet in the range ${this.defineRange(DirectionBet.RangeDown)}`, `${this.selectedRadioGroup.value} made bet ${this.betValue} tokens`);
    } else {
      this.iziToast.show('Fail bet', `You has already been bet in the range ${this.defineRange(DirectionBet.RangeUp)}`, 'red', 'ico-error', 'assets/avatar.png');
    }

  }

  makeBetUp() {
    if (!this.currentRound.gamersBetDown.includes(this.selectedRadioGroup.value)) {
      this.currentRound.gamersBetUp.push(this.selectedRadioGroup.value);
      this.currentGame.bank += this.betValue;
      this.currentGame.rounds[this.currentRound.numberRound - 1].gamersBetUp.push(this.selectedRadioGroup.value);1
      this.store.dispatch(
        new EditGame(this.currentGame)
      ).subscribe((t) => console.log('471 t :', t)
      );
      // this.soundsService.play('click');
      this.iziToast.success(`Success bet in the range ${this.defineRange(DirectionBet.RangeUp)}`, `${this.selectedRadioGroup.value}  made bet ${this.betValue} tokens`);
    } else {
      this.iziToast.show('Fail bet', `You has already been bet in the range ${this.defineRange(DirectionBet.RangeDown)}`, 'red', 'ico-error', 'assets/avatar.png');
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
    if (this.currentRound.gamersBetDown.length > 0 && this.currentRound.gamersBetUp.length > 0) {
      this.timerForStartNextRound();
      return true;
    }

  }

  handleEvent($event) {
    if ($event.action === 'done') {
      this.nextRound();
      this.countdown.begin();
    }
    // console.log(' $event :', $event);
  }

  timerForStartNextRound() {
    this.countdown.restart();
    this.countdown.begin();
  }

  nextRound() {
    if (this.checkOppositeBet()) {
      this.timerForStartNextRound();
      console.log(' ++++nextRoundthis.currentGame :', this.currentGame);
      const round = this.currentRound;
      this.currentGame.rounds.push(this.currentRound);
      this.currentRound = new Round();
      this.numberRound++;
      this.currentRound.isLastWinnerRangeUp = this.winnerRangeDirection();

      if ((this.numberRound % (this.degreeGame + 1) === 0)) {
        const secretNumber = (this.currentRound.isLastWinnerRangeUp) ?
          round.maxNumberRange : round.minNumberRange;
        this.currentGame.secretNumberOfGame = secretNumber;
        let listWinnersWithPrizes = '';
        let countWinners = (this.currentRound.isLastWinnerRangeUp) ? round.gamersBetUp.length : round.gamersBetDown.length;
        let avgPrize = this.currentGame.bank / countWinners;
        console.log('this.currentRound :', this.currentRound);
        console.log('this.currentGame.bank  :', this.currentGame.bank);
        console.log('countWinners :', countWinners);
        console.log('avgPrize :', avgPrize);
        /// need refactoring
        if (this.currentRound.isLastWinnerRangeUp) {
          for (const item of round.gamersBetUp) {
            this.currentGame.winners.push({
              addressGamer: item,
              sumBets: avgPrize
            })
            console.log('item :', item);
            listWinnersWithPrizes += `${item} : ${avgPrize}`;
          }
        } else {
          for (const item of round.gamersBetDown) {
            this.currentGame.winners.push({
              addressGamer: item,
              sumBets: avgPrize
            })
            /* console.log('item :', item);
            listWinnersWithPrizes += `${item} : ${avgPrize}`; */
          }
          this.showSecretGame = false;
          this.currentGame.gameOver = true;
        }
        // console.log('listWinnersWithPrizes :', listWinnersWithPrizes);

        this.showGameOver(secretNumber, this.currentGame.winners);
        //this.iziToast.gameOver(`Secret number of the game is ${secretNumber}`, `Winners got prize ${listWinnersWithPrizes}`);
        this.finishOldAndStartNewGame();
      } else {
        this.showSecretGame = false;
        this.setRange(this.currentRound.isLastWinnerRangeUp, this.avgRange, round.minNumberRange, round.maxNumberRange);
      }
      this.currentRound.numberRound = this.numberRound;
    }
  }

  showGameOver(secretNumber: any, winners: GamerBet[]) {
    let listWinnersWithPrizes = '';
    for (const item of winners) {
      listWinnersWithPrizes += `${item.addressGamer} : ${item.sumBets}`;
    }
    this.iziToast.gameOver(`The game is over! Secret number of the game is ${secretNumber}`, `Winners got prize ${listWinnersWithPrizes}`);
  }

  finishOldAndStartNewGame() {
    this.numberRound = 1;
    this.startNewGame(this.currentGame);
    this.defineRanges(this.startMinNumberRange, this.startMaxNumberRange);
  }

  startNewGame(game?: Game) {
    if (!game) {
      this.currentGame = new Game();
      this.currentGame.bank = 0;
      this.currentGame.gameOver = false;
      this.currentGame.typeGame = (this.startMaxNumberRange + 1).toString();
      this.currentGame.numberGame = 1;
      this.store.dispatch(
        new AddGame(this.currentGame)
      ).subscribe((t) => console.log('471 t :', t)
      );
    } else {
      this.games.push(game);
      this.store.dispatch(
        new EditGame(this.currentGame)
      ).subscribe((t) => console.log('471 t :', t)
      );
      this.currentGame.numberGame = game.numberGame + 1;
    }
    /// this.gamesService.addNewGame(this.currentGame);
  }

  winnerRangeDirection() {
    return this.isWinnerRangeUp = Math.round((Math.random() * 1) + 0) === 0;
  }
}
