import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { Store } from '@ngxs/store';
import { FilterGames } from '../../store/actions/games.actions';
@Component({
  selector: 'app-game-carousel',
  templateUrl: './game-carousel.component.html',
  styleUrls: ['./game-carousel.component.css']
})
export class GameCarouselComponent implements OnInit {

  games: any;
  choisedIcon: string;
  filters: any = {
    typeAddRate: 0,
    gameOver: false,
    genre: '0-127'
  };
  selected: Number = -1;
  @Output() caroucelMessage =  new EventEmitter<string>();
  constructor(private store: Store) {
    // list items on carusel page
    this.games = [
      {id: 1, name: '0-127', src: 'assets/movies-genres/0-127.png', gameOver: false},
      {id: 2, name: '0-255', src: 'assets/movies-genres/0-255.png', gameOver: false},
      {id: 3, name: '0-511', src: 'assets/movies-genres/0-511.png'},
      {id: 4, name: '0-1023', src: 'assets/movies-genres/0-1023.png', gameOver: false},
      {id: 5, name: 'FAQ', src: 'assets/movies-genres/drama.png'},
      {id: 6, name: 'Info', src: 'assets/movies-genres/fantasy.png'},
      {id: 7, name: 'Statistic', src: 'assets/movies-genres/film noir.png', gameOver: true},
      {id: 8, name: 'Hot games', src: 'assets/movies-genres/horror.png'},
      {id: 9, name: 'Demo games', src: 'assets/movies-genres/romance.png'},
      {id: 10, name: 'Help', src: 'assets/movies-genres/science fiction.png'},
      {id: 11, name: 'About', src: 'assets/movies-genres/westerns.png'}
  ];
  }

  ngOnInit() {
  }

  selectGame(game, index) {
    console.log('GameCarouselComponent::selectGame() | method called');
    console.log(game);
    this.selected = index;
    this.choisedIcon = game.name;
    this.caroucelMessage.emit(game.name);
    this.filters.genre = game.name;
    this.store.dispatch([
      new FilterGames(this.filters),
    ]);
  }

}
