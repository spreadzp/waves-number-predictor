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
    genre: 'Food',
    rating: 0
  };
  selected: Number = -1;

  constructor(private store: Store) {
    // list items on carusel page
    this.games = [
      {text: 'Science fiction', src: 'assets/movies-genres/image1.png'},
      {text: 'Westerns', src: 'assets/movies-genres/image2.png'},
      {text: 'Crime', src: 'assets/movies-genres/image3.png'},
       /*    {text: 'Romance', src: 'assets/movies-genres/image4.png'},
      {text: 'Comedy', src: 'assets/movies-genres/image5.png'},
      {text: 'Drama', src: 'assets/movies-genres/image6.png'},
      {text: 'Cartoon', src: 'assets/movies-genres/image7.png'},
      {text: 'Action', src: 'assets/movies-genres/image8.png'},
      {text: 'Adventure', src: 'assets/movies-genres/image9.png'},
      {text: 'Thriller', src: 'assets/movies-genres/image10.png'},
      {text: 'Fantasy', src: 'assets/movies-genres/image11.png'},
      {text: 'Horror', src: 'assets/movies-genres/image12.png'}, */
      {text: 'Food', src: 'assets/movies-genres/image13.png'},
    ];
  }

  ngOnInit() {
  }

  selectGame(game, index) {
    console.log('GameCarouselComponent::selectGame() | method called');
    console.log(game);
    this.selected = index;
    this.filters.genre = game.text;
    this.store.dispatch([
      new FilterGames(this.filters),
    ]);
  }

}
