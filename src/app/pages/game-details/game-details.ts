import {
  Component,
  ViewEncapsulation,
  OnInit,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
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
import {
  map,
  skip,
  takeUntil,
  filter,
  scan,
  withLatestFrom,
} from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

import { IziToastService } from '../../providers/izi-toast.service';
import { WavesService } from '../../providers/waves-service';
import { Game, Round, DirectionBet, GamerBet } from '../../models/game.model';
import { GamesService } from '../../providers/games-service';
import { GameState } from '../../store/state/games.state';
import {
  LikeGame,
  AddGame,
  FilterGames,
  EditGame,
  FavoriteGame,
} from '../../store/actions/games.actions';
import { SoundsService } from '../../providers/sounds.service';
import { CountdownComponent } from 'ngx-countdown';
import { TypeGame } from '../../helpers/type-game';
import { TypeAddRate } from '../../helpers/typeAddRate';

@Component({
  selector: 'app-page-game-details',
  templateUrl: './game-details.html',
  styleUrls: ['./game-details.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GameDetailsComponent implements OnInit, AfterViewInit {
  currentYear = new Date().getFullYear();
  selectedGame: Observable<Game>;
  id: string;
  genreGame: string;
  countDownStart = false;
  typeAddRate: number;
  game: Game;
  games: Game[] = [];
  currentGame: Game = null;
  currentRound: Round = null;
  defaultSelectedRadio = 'gamer_2';
  numberRound = 1;
  startMinNumberRange = 0;
  startMaxNumberRange: number;
  degreeGame: number;
  downRange = '';
  upRange = '';
  firstRangeMin = 0;
  firstRangeMax = 0;
  secondRangeMin = 0;
  secondRangeMax = 0;
  isWinnerRangeUp = false;
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
    id: '',
  };
  title = 'INFO';
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
      color: 'primary',
    },
    {
      id: '2',
      name: 'radio_list',
      value: 'gamer_2',
      text: 'Gamer2',
      disabled: false,
      checked: true,
      color: 'secondary',
    },
    {
      id: '3',
      name: 'radio_list',
      value: 'gamer_3',
      text: 'Gamer3',
      disabled: false,
      checked: false,
      color: 'danger',
    },
  ];
  genreImages: string[] = [
    '0-127',
    'comedy',
    'crime',
    'documentary',
    'drama',
    'fantasy',
    'film noir',
    'horror',
    'romance',
    'science fiction',
    'westerns',
    'animation',
    'food',
  ];

  @ViewChild('betDown', { static: false }) betDown: any;
  @ViewChild('betUp', { static: false }) betUp: any;
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;

  constructor(
    private store: Store,
    private youtubeApiService: YoutubeApiService,
    private modalCtrl: ModalController,
    private activatedRoute: ActivatedRoute,
    private iziToast: IziToastService,
    private wavesService: WavesService,
    private gamesService: GamesService,
    private soundsService: SoundsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    const gameFromId = this.getGameDetails(this.id);
    this.currentRound = new Round();
    this.setImageGame(gameFromId);
    timer(0, 1000).subscribe(() => {
      this.fetchGameById(this.id).subscribe(
        (game) => {
          if (game && Array.isArray(game) && !game[0].gameOver) {
            this.fetchGameState(game[0]);
            this.currentRound.numberRound = game[0].rounds.length;
          }
        },
        (err) => {
          this.iziToast.errorConnection(
            'Error connection!',
            `You have error connection ${err}`,
            'red'
          );
        }
      );
    });
  }

  fetchGameById(id: string) {
    return this.gamesService.getGame(id);
  }

  fetchGameState(game: Game) {
    if (!game) {
      this.fetchGameById(this.id).subscribe((game) => {
        // console.log('@@@@@@@@@@@@@@@@@game :', game);

        if (game && Array.isArray(game)) {
          this.fetchGameState(game[0]);
          this.currentRound.numberRound = game[0].rounds.length;
        }
      });
    } else if (game.gameOver && game.id === this.id) {
      //this.showGameOver(game.secretNumberOfGame, game.winners);
      this.router.navigateByUrl('/home');
    } else {
      this.currentGame = game;
      this.genreGame = this.currentGame.typeGame;
      this.startMaxNumberRange = TypeGame[this.genreGame];
      this.degreeGame = Math.log2(this.startMaxNumberRange + 1);
      if (!this.currentGame.rounds.length) {
        this.currentGame.rounds.push(new Round());
        this.defineRanges(this.startMinNumberRange, this.startMaxNumberRange);
        this.defineCurrentRound(this.currentGame.rounds);
        this.currentGame.rounds[
          this.currentRound.numberRound - 1
        ].minNumberRange = this.startMinNumberRange;
        this.currentGame.rounds[
          this.currentRound.numberRound - 1
        ].maxNumberRange = this.startMaxNumberRange;
      }
      if (
        this.currentGame.rounds.length &&
        this.checkRoundRangeNumbers(this.currentGame.rounds.length - 1)
      ) {
        this.defineCurrentRound(this.currentGame.rounds);
        const numRounds = this.currentRound.numberRound - 1;
        //console.log('numRounds :', numRounds);
        this.defineRanges(
          this.currentGame.rounds[this.currentRound.numberRound - 1]
            .minNumberRange,
          this.currentGame.rounds[this.currentRound.numberRound - 1]
            .maxNumberRange
        );
      }
    }
  }

  checkRoundRangeNumbers(numberRange) {
    const r = this.currentGame.rounds[numberRange].minNumberRange;
    const e = this.currentGame.rounds[numberRange].maxNumberRange;
    return r + e ? true : false;
  }

  defineCurrentRound(rounds: Round[]) {
    if (rounds && rounds.length) {
      this.currentRound.numberRound = rounds.length;
    } else {
      this.currentRound.numberRound = 1;
    }
  }

  ngAfterViewInit() {
    this.soundsService.preload('click', 'assets/sounds/click.mp3');
    if (
      this.betDown &&
      this.betUp &&
      this.betDown.ionChange &&
      this.betUp.ionChange
    ) {
      this.betDown.ionChange.pipe(skip(1)).subscribe((ev) => {
        this.soundsService.play('click');
      });
      this.betUp.ionChange.pipe(skip(1)).subscribe((ev) => {
        this.soundsService.play('click');
      });
    }
  }

  ionViewWillEnter() {
    console.log('252 ionViewWillEnter');
  }

  getGameDetails(id: string) {
    console.log('id :', id);
    return this.store
      .select(GameState.gameById)
      .pipe(map((filterFn) => filterFn(id)));
  }

  setImageGame(game: Observable<Game>) {
    game.subscribe((game) => {
      // console.log(game);
      this.game = game;
      // console.log('187 this.game :', this.game);
      let genre = '';
    });
  }

  watchTrailer() {
    console.log('GameDetailssPage::watchTrailer | method called');

    //  Code to use Youtube Api Service: providers/youtube-api-service.ts
    this.youtubeApiService.searchMovieTrailer(this.game.title).subscribe(
      (result) => {
        if (result.items.length > 0) {
          console.log(result);
          const { videoId } = result.items[0].id;
          //this.game.videoId = videoId;

          // Code to use capacitor-youtube-player plugin.
          console.log(
            'GameDetailssPage::watchTrailer -> platform: ' + Capacitor.platform
          );
          if (Capacitor.platform === 'web') {
            const componentProps = { modalProps: { item: this.game } };
            this.presentModal(componentProps, YoutubeModalComponent);
          } else {
            // Native
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
      (error) => {
        this.iziToast.show(
          'Watch Trailer',
          'Sorry, an error has occurred.',
          'red',
          'ico-error',
          'assets/avatar.png'
        );
      }
    );
  }

  async presentModal(componentProps: any, component) {
    console.log(
      'GameDetailssPage::presentModal | method called -> movie',
      this.game
    );
    // const componentProps = { modalProps: { item: this.game}};
    const modal = await this.modalCtrl.create({
      component: component,
      componentProps: componentProps,
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
    const componentProps = {
      modalProps: { title: 'Comment', game: this.game },
    };
    this.presentModal(componentProps, CommentModalComponent);
  }

  onClickShowComment() {
    console.log('GameDetailssPage::onClickShowComment');
    const componentProps = {
      modalProps: { title: 'Comments', game: this.game },
    };
    this.presentModal(componentProps, ShowCommentsModalComponent);
  }

  onClickFavorite() {
    console.log('GameDetailssPage::onClickFavorite');

    if (typeof localStorage.getItem('@@STATE') !== 'undefined') {
      const state = JSON.parse(localStorage.getItem('@@STATE'));
      const favorites = state.catalog.favorites;

      if (typeof favorites !== 'undefined') {
        const exist = favorites.filter((item) => {
          return item.title === this.game.title;
        });

        if (exist.length === 0) {
          this.store.dispatch(new FavoriteGame(this.game)).subscribe(() => {
            this.iziToast.success('Favorite movie', 'Favorite Movie added.');
          });
        } else {
          this.iziToast.show(
            'Favorite movie',
            'The movie has already been added.',
            'red',
            'ico-error',
            'assets/avatar.png'
          );
        }
      }
    }
  }

  onClickShare() {
    console.log('GameDetailssPage::onClickShare');
    if (navigator['share']) {
      navigator['share']({
        title: 'WebShare API Demo',
        url: 'https://codepen.io/ayoisaiah/pen/YbNazJ',
      })
        .then(() => {
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
        game: this.currentGame,
      },
    };
    this.presentModal(componentProps, ShowActorsModalComponent);
  }

  radioGroupChange(event) {
    // console.log('radioGroupChange', event.detail);
    this.selectedRadioGroup = event.detail;
  }

  radioFocus() {
    console.log('radioFocus');
  }
  radioSelect(event) {
    console.log('radioSelect', event.detail);
    this.selectedRadioItem = event.detail;
  }
  radioBlur() {
    console.log('radioBlur');
  }

  makeBet() {
    return this.wavesService.makeBet(0.5);
  }

  defineRange(flagRange: DirectionBet) {
    if (flagRange === DirectionBet.RangeDown) {
      return this.firstRangeMax - this.firstRangeMin === 0
        ? this.firstRangeMax.toString()
        : this.firstRangeMin.toString() + ' - ' + this.firstRangeMax.toString();
    } else {
      return this.secondRangeMax - this.secondRangeMin === 0
        ? this.secondRangeMax.toString()
        : this.secondRangeMin.toString() +
            ' - ' +
            this.secondRangeMax.toString();
    }
  }
  makeBetDown() {
    const gamerAddress = this.selectedRadioGroup.value;
    if (
      !this.currentGame.rounds[
        this.currentRound.numberRound - 1
      ].gamersBetUp.includes(gamerAddress)
    ) {
      this.currentRound.gamersBetDown.push(gamerAddress);
      const gamerBetInTheRound = this.defineBet(gamerAddress);
      this.addGamerBet(gamerAddress);
      this.updateGame(this.currentRound.numberRound - 1, {
        gamersBetDown: gamerAddress,
      });
      this.soundsService.play('click');
      this.iziToast.success(
        `Success bet in the range ${this.defineRange(DirectionBet.RangeDown)}`,
        `${gamerAddress} made bet ${gamerBetInTheRound} tokens`
      );
    } else {
      this.iziToast.show(
        'Fail bet',
        `You has already been bet in the range ${this.defineRange(
          DirectionBet.RangeUp
        )}`,
        'red',
        'ico-error',
        'assets/avatar.png'
      );
    }
  }

  findIndexGamersBet(gamerAddress) {
    if (this.currentGame) {
      if (this.currentGame.gamerBets.length > 0) {
        return this.currentGame.gamerBets.findIndex(
          (item) => item.addressGamer === gamerAddress
        );
      } else {
        return 0;
      }
    }
  }

  totalGamersBeds(gamerAddress) {
    if (this.currentGame) {
      if (this.currentGame.gamerBets.length > 0) {
        const gamerBet = this.currentGame.gamerBets.find(
          (item) => item.addressGamer === gamerAddress
        );
        return gamerBet ? gamerBet.sumBets : 0;
      } else {
        return 0;
      }
    }
  }

  defineBet(gamerAddress) {
    if (this.currentRound.numberRound === 1) {
      return this.currentGame.minBet;
    } else {
      if (this.currentGame) {
        const prevRound = this.currentGame.rounds[
          this.currentRound.numberRound - 2
        ];
        const isTrueLastBet = prevRound.isLastWinnerRangeUp
          ? prevRound.gamersBetUp.includes(gamerAddress)
          : prevRound.gamersBetDown.includes(gamerAddress);
        return isTrueLastBet
          ? this.currentGame.minBet
          : this.defineRoundBet() > this.totalGamersBeds(gamerAddress)
          ? this.defineRoundBet() - this.totalGamersBeds(gamerAddress)
          : this.currentGame.minBet;
      } else {
        return this.currentGame.minBet;
      }
    }
  }

  defineRoundBet() {
    if (this.currentGame) {
      if (this.currentGame.typeAddRate === TypeAddRate.geometric) {
        return this.currentRound.numberRound ** 2 + this.currentGame.minBet;
      } else {
        return (
          this.currentGame.minBet * this.currentRound.numberRound +
          this.currentGame.minBet
        );
      }
    }
  }

  addGamerBet(addressGamer) {
    const gamerBet = this.defineBet(addressGamer);
    this.currentGame.bank += gamerBet;
    const indexGamerBets = this.findIndexGamersBet(addressGamer);
    if (indexGamerBets === -1 || this.currentGame.gamerBets.length === 0) {
      const newBets = {
        addressGamer: addressGamer,
        sumBets: gamerBet,
      };
      this.currentGame.gamerBets.push(newBets);
    } else {
      this.currentGame.gamerBets[indexGamerBets].addressGamer = addressGamer;
      this.currentGame.gamerBets[indexGamerBets].sumBets += gamerBet;
    }
  }

  makeBetUp() {
    const gamerAddress = this.selectedRadioGroup.value;
    if (
      !this.currentGame.rounds[
        this.currentRound.numberRound - 1
      ].gamersBetDown.includes(gamerAddress)
    ) {
      this.currentRound.gamersBetUp.push(gamerAddress);
      const gamerBetInTheRound = this.defineBet(gamerAddress);
      this.addGamerBet(this.selectedRadioGroup.value);
      this.updateGame(this.currentRound.numberRound - 1, {
        gamersBetUp: gamerAddress,
      });
      this.soundsService.play('click');
      this.iziToast.success(
        `Success bet in the range ${this.defineRange(DirectionBet.RangeUp)}`,
        `${gamerAddress}  made bet ${gamerBetInTheRound} tokens`
      );
    } else {
      this.iziToast.show(
        'Fail bet',
        `You has already been bet in the range ${this.defineRange(
          DirectionBet.RangeDown
        )}`,
        'red',
        'ico-error',
        'assets/avatar.png'
      );
    }
  }
  defineRanges(minNumber: number, maxNumber: number) {
    let sumMinAndMax = maxNumber + minNumber;
    this.avgRange =
      sumMinAndMax % 2 === 0 ? sumMinAndMax / 2 : (sumMinAndMax + 1) / 2;
    this.firstRangeMin = minNumber;
    this.firstRangeMax = this.avgRange - 1;
    this.secondRangeMin = this.avgRange;
    this.secondRangeMax = maxNumber;
    this.currentRound.minNumberRange = minNumber;
    this.currentRound.maxNumberRange = maxNumber;
  }

  defineRangesRound(minNumber: number, maxNumber: number) {
    let sumMinAndMax = maxNumber + minNumber;
    this.avgRange =
      sumMinAndMax % 2 === 0 ? sumMinAndMax / 2 : (sumMinAndMax + 1) / 2;
    this.firstRangeMin = minNumber;
    this.firstRangeMax = this.avgRange - 1;
    this.secondRangeMin = this.avgRange;
    this.secondRangeMax = maxNumber;
    this.currentRound.minNumberRange = minNumber;
    this.currentRound.maxNumberRange = maxNumber;
    return { min: minNumber, max: maxNumber };
  }

  setRange(
    isWinnerDirectionUp: boolean,
    lastAvgRange: number,
    minRange: number,
    maxRange: number
  ) {
    let newRanges: { min: number; max: number };
    if (isWinnerDirectionUp) {
      newRanges = this.defineRangesRound(lastAvgRange, maxRange);
    } else {
      newRanges = this.defineRangesRound(minRange, lastAvgRange - 1);
    }
    const newRound = new Round();
    newRound.numberRound = this.currentRound.numberRound + 1;
    newRound.maxNumberRange = newRanges.max;
    newRound.minNumberRange = newRanges.min;
    this.currentGame.rounds.push(newRound);
    this.updateGame(this.currentRound.numberRound, {
      isLastWinnerRangeUp: isWinnerDirectionUp,
      maxNumberRange: this.currentRound.maxNumberRange,
      minNumberRange: this.currentRound.minNumberRange,
      numberRound: this.currentRound.numberRound,
    });
  }

  updateGame(numberRound: number, data: Object) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        debugger;
        if (Array.isArray(this.currentGame.rounds[numberRound][key])) {
          this.currentGame.rounds[numberRound][key].push(data[key]);
          console.log('data[key] 1:', data[key]);
        } else if (
          this.currentGame.hasOwnProperty(key) === data.hasOwnProperty(key)
        ) {
          this.currentGame[key] = data[key];
          console.log('data[key] 2:', data[key]);
        } else {
          this.currentGame.rounds[numberRound][key] = data[key];
          console.log('data[key] 3:', data[key]);
        }
      }
    }
    this.store
      .dispatch(new EditGame(this.currentGame))
      .subscribe((t) => console.log('471 t :', t));
  }

  checkOppositeBet() {
    if (!this.currentGame || !this.currentGame.rounds.length) {
      return false;
    } else {
      const countBetUp = this.currentGame.rounds[
        this.currentRound.numberRound - 1
      ].gamersBetUp.length;
      const countBetDown = this.currentGame.rounds[
        this.currentRound.numberRound - 1
      ].gamersBetDown.length;
      if (countBetUp > 0 && countBetDown > 0) {
        this.timerForStartNextRound();
        return true;
      } else {
        return false;
      }
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
    this.countDownStart = true;
  }

  nextRound() {
    if (this.checkOppositeBet()) {
      this.timerForStartNextRound();
      console.log(' ++++nextRoundthis.currentGame :', this.currentGame);
      const round = this.currentRound;
      //
      console.log(' ?????nextRoundthis.currentGame :', this.currentGame);
      this.numberRound++;
      this.currentRound.isLastWinnerRangeUp = this.winnerRangeDirection();

      if (this.currentRound.numberRound % this.degreeGame === 0) {
        const winnersRound = this.currentGame.rounds[
          this.currentRound.numberRound - 1
        ];
        const secretNumber = this.currentRound.isLastWinnerRangeUp
          ? round.maxNumberRange
          : round.minNumberRange;
        this.currentGame.secretNumberOfGame = secretNumber;
        let listWinnersWithPrizes = '';
        let countWinners = this.currentRound.isLastWinnerRangeUp
          ? winnersRound.gamersBetUp.length
          : winnersRound.gamersBetDown.length;
        let avgPrize = this.currentGame.bank / countWinners;
        console.log('this.currentRound :', this.currentRound);
        console.log('this.currentGame.bank  :', this.currentGame.bank);
        console.log('countWinners :', countWinners);
        console.log('avgPrize :', avgPrize);
        /// need refactoring
        if (this.currentRound.isLastWinnerRangeUp) {
          for (const item of winnersRound.gamersBetUp) {
            this.currentGame.winners.push({
              addressGamer: item,
              sumBets: avgPrize,
            });
            console.log('item :', item);
            // listWinnersWithPrizes += `${item} : ${avgPrize}`;
          }
        } else {
          for (const item of winnersRound.gamersBetDown) {
            this.currentGame.winners.push({
              addressGamer: item,
              sumBets: avgPrize,
            });
          }

          this.showSecretGame = true;
          this.currentGame.gameOver = true;
        }
        this.updateGame(this.currentRound.numberRound - 1, {
          secretNumberOfGame: this.currentGame.secretNumberOfGame,
          isLastWinnerRangeUp: this.currentRound.isLastWinnerRangeUp,
          gameOver: true,
          winners: this.currentGame.winners,
        });
        // console.log('listWinnersWithPrizes :', listWinnersWithPrizes);
        this.finishOldAndStartNewGame();

        //this.iziToast.gameOver(`Secret number of the game is ${secretNumber}`, `Winners got prize ${listWinnersWithPrizes}`);
      } else {
        this.showSecretGame = false;
        this.setRange(
          this.currentRound.isLastWinnerRangeUp,
          this.avgRange,
          round.minNumberRange,
          round.maxNumberRange
        );
      }
    }
  }

  showGameOver(secretNumber: any, winners: GamerBet[]) {
    let listWinnersWithPrizes = '';
    for (const item of winners) {
      listWinnersWithPrizes += `${item.addressGamer} : ${item.sumBets}`;
    }
    this.iziToast.gameOver(
      `The game is over! Secret number of the game is ${secretNumber}`,
      `Winners got prize ${listWinnersWithPrizes}`
    );
  }

  finishOldAndStartNewGame() {
    this.numberRound = 1;

    this.startNewGame(this.currentGame);
    this.defineRanges(this.startMinNumberRange, this.startMaxNumberRange);
  }

  startNewGame(game?: Game) {
    const endedGame = game;
    this.currentGame = new Game();
    this.currentGame.bank = 0;
    this.currentGame.gameOver = false;
    this.currentGame.typeGame = this.genreGame;
    this.currentGame.numberGame = game.numberGame + 1;
    this.currentGame.minBet = game.minBet;
    this.currentGame.typeAddRate = this.game.typeAddRate;
    console.log('startNewGame :', this.currentGame);
    this.id = '';
    this.store.dispatch(new AddGame(this.currentGame)).subscribe((t) => {
      if (endedGame.gameOver) {
        console.log('game.gameOver :', game.gameOver);
        this.showGameOver(endedGame.secretNumberOfGame, endedGame.winners);
        this.router.navigateByUrl('/home');
      }
    });
  }

  winnerRangeDirection() {
    return (this.isWinnerRangeUp = Math.round(Math.random() * 1 + 0) === 0);
  }

  switchSound() {
    this.soundsService = null;
  }

  betOnWawes() {
    this.wavesService.login();
  }
}
