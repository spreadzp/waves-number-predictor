import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, retryWhen, delay, map, filter } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { Game } from '../models/game.model';

@Injectable()
export class GamesService {

  private readonly URL_BASE: string = 'http://localhost:3000/';
  //private readonly URL_BASE: string = 'https://c194d2e6.ngrok.io/';

  constructor(private http: HttpClient) {
  }

  getGames(start: number, end: number): Observable<Game[]> {
    return this.http
    // Type-checking the response => .get<Game[]>
    .get<Game[]>(this.URL_BASE + `games?_start=${start}&_end=${end}&_sort=year,title&_order=desc,asc`)
    .pipe(
      retryWhen(error => error.pipe(delay(500))),
      timeout(5000)
    );
  }

  getGame(title: string): Observable<Game> {
    // console.log(encodeURI(this.URL_BASE + `Games?title=${title}`));
    return this.http
    // Type-checking the response => .get<Game>
    .get<Game>(encodeURI(this.URL_BASE + `games?title=${title}`))
    .pipe(
      retryWhen(error => error.pipe(delay(500))),
      timeout(5000)
    );
  }

  addNewGame(game: Game): Observable<Game> {

    game['id'] = uuid();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    // console.log('Game in addGame', Game);
    return this.http
      // Type-checking the response => .post<Game>
    .post<Game>(encodeURI(this.URL_BASE + `games/`), game, httpOptions)
    .pipe(
      retryWhen(error => error.pipe(delay(500))),
      timeout(5000)
    );
  }

  editGame(game: Game): Observable<Game> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    console.log('@@@game :', game);
    let t = encodeURI(this.URL_BASE + `games/${game['id']}`);
    console.log('t :', t);
    // console.log('Game in editGame', Game);
    return this.http
      // Type-checking the response => .post<Game>
    .put<Game>(encodeURI(this.URL_BASE + `games/${game['id']}`), game, httpOptions)
    .pipe(
      retryWhen(error => error.pipe(delay(500))),
      timeout(5000)
    );
  }

  deleteGame(game: Game): Observable<Game> {

    // console.log('Game in deleteGame', Game);
    return this.http
      // Type-checking the response => .post<Game>
    .delete<Game>(encodeURI(this.URL_BASE + `games/${game['id']}`))
    .pipe(
      retryWhen(error => error.pipe(delay(500))),
      timeout(5000)
    );
  }

  filterGames(filters): Observable<Game[]> {
    console.log('filterGames in Games-services', filters);

    const strFilters = this.checkFilters(filters);
    console.log('strFilters', strFilters);
    return this.http
    // Type-checking the response => .get<Game[]>
    .get<Game[]>(this.URL_BASE + 'game?typeGame=1024&&isFinished=false') // `games${strFilters}_sort=year,title&_order=desc,asc&_limit=20`)
    .pipe(
      retryWhen(error => error.pipe(delay(500))),
      timeout(5000)
    );
  }

  filterNotFinishGames(filters): Observable<Game[]> {
    console.log('filterGames in Games-services', filters);

    const strFilters = this.checkFilters(filters);
    console.log('strFilters', strFilters);
    return this.http
    // Type-checking the response => .get<Game[]>
    .get<Game[]>(this.URL_BASE + `games?typeGame=${filters}&&gameOver=false`)
    // `games${strFilters}_sort=year,title&_order=desc,asc&_limit=20`)
    .pipe(
      retryWhen(error => error.pipe(delay(500))),
      timeout(5000)
    );
  }

  checkFilters(filters: any) {
    let strFilters = '';
    strFilters += typeof filters['genre'] !== 'undefined' && filters['genre'] !== ''  ? `?genre=${filters.genre}&` : '?';
    strFilters += typeof filters['years'] !== 'undefined' ? `year_gte=${filters.years.lower}&year_lte=${filters.years.upper}&` : '';
    strFilters += typeof filters['rate'] !== 'undefined' ? `rate=${filters.rate}&` : '';
    return strFilters;
  }

  searchGames(queryText: string): Observable<Game[]> {
    console.log(this.URL_BASE + `games?q=${queryText}&_limit=20`);
    return this.http
    // Type-checking the response => .get<Game[]>
    .get<Game[]>(this.URL_BASE + `games?q=${queryText}&_limit=20`)
    .pipe(
      retryWhen(error => error.pipe(delay(500))),
      timeout(5000)
    );
  }
}
