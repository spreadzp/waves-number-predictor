import { Component, OnInit } from '@angular/core';

import { Store } from '@ngxs/store';
import { FilterMovies } from '../../store/actions/movies.actions';
import { FilterGames } from '../../store/actions/games.actions';

@Component({
  selector: 'app-game-carousel',
  templateUrl: './game-carousel.component.html',
  styleUrls: ['./game-carousel.component.css']
})
export class GameCarouselComponent implements OnInit {

  games: any;
  filters: any = {
    years: {
      lower: 1900,
      upper: new Date().getFullYear()
    },
    genre: '0-127',
    rating: 0
  };
  selected: Number = -1;

  constructor(private store: Store) {
    // list items on carusel page
    this.games = [
      {id: 1, name: '0-127', src: 'assets/movies-genres/0-127.png'},
      {id: 2, name: '0-255', src: 'assets/movies-genres/0-255.png'},
      {id: 3, name: '0-511', src: 'assets/movies-genres/0-511.png'},
      {id: 4, name: '0-1023', src: 'assets/movies-genres/0-1023.png'},
      {id: 5, name: 'FAQ', src: 'assets/movies-genres/drama.png'},
      {id: 6, name: 'Info', src: 'assets/movies-genres/fantasy.png'},
      {id: 7, name: 'Statistic', src: 'assets/movies-genres/film noir.png'},
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
    this.filters.genre = game.name;
    this.store.dispatch([
      new FilterGames(this.filters),
    ]);
  }

}
