import { State, Action, StateContext, Selector, NgxsOnInit } from '@ngxs/store';
import { patch, append, removeItem, insertItem, updateItem } from '@ngxs/store/operators';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Game } from '../../models/game.model';
import { FetchGames, AddGame, EditGame, DeleteGame, FilterGames, SaveFilterGames,
         /*SearchGames,*/ GetGameTrailer, ClearGames, LikeGame, CommentGame, FavoriteGame,
         DeleteFavoriteGame, DeleteAllFavoritesGames, ClearState } from './../actions/games.actions';

import { GamesService } from '../../providers/games-service';
import { YoutubeApiService } from '../../providers/youtube-api-service';
import { Movie } from '../../models/movie.model';

export class GamesStateModel {
    games: Game[];
    gameForm: {
        model: Game,
        dirty: boolean,
        status: string,
        errors: {}
    };
    filter: {
        genre: string,
        years: {
            lower: number,
            upper: number
        },
        rate: number
    };
    favorites: Game[];
}

@State<GamesStateModel>({
    name: 'catalogGame',
    defaults: {
        games: [],
        gameForm: {
            model: null,
            dirty: false,
            status: '',
            errors: {}
        },
        filter: {
            genre: 'Food',
            years: {
                lower: 1900,
                upper: new Date().getFullYear()
            },
            rate: 0
        },
        favorites:  []
    }
})

export class GameState implements NgxsOnInit {

    constructor(private gamesService: GamesService, private youtubeApiService: YoutubeApiService) {}

    @Selector()
    static getGames(state: GamesStateModel) {
        return state.games;
    }

    @Selector()
    static gameById(state: GamesStateModel) {
        return (id: number) => {
            return state.games.filter(game => game.numberGame === id)[0];
        };
    }

    ngxsOnInit(ctx: StateContext<GamesStateModel>) {
        console.log('State initialized.');
        ctx.dispatch(new ClearState());
    }

    @Action(ClearState)
    clearState({ setState }: StateContext<GamesStateModel>) {
        setState({
            games: [],
            gameForm: {
                model: null,
                dirty: false,
                status: '',
                errors: {}
            },
            filter: {
                genre: 'Food',
                years: {
                    lower: 1900,
                    upper: new Date().getFullYear()
                },
                rate: 0
            },
        favorites:  []});
    }

    @Action(FetchGames, { cancelUncompleted: true })
    fetchGames({ getState, setState }: StateContext<GamesStateModel>, { payload }) {
        // console.log('GameState::fetchGames() | method called');
        // console.log('fetchGames payload', payload);
        const { start, end } = payload;
        return this.gamesService.getGames(start, end).pipe(
            catchError((x, caught) => {
                // console.log('inside catchError', x);
                return throwError(x);
            }),
            tap((result) => {
            // console.log('fetchGames result', result);
            const state = getState();
            // console.log('state', state);
            setState({
                ...state,
                games: [ ...state.games, ...result ]
            });
        },
        (error) => {
            console.log('error', error.message);
        }));
    }

    @Action(AddGame)
    addGame({ setState }: StateContext<GamesStateModel>, { payload }) {
        return this.gamesService.addNewGame(payload).pipe(
            catchError((x, caught) => {
                return throwError(x);
            }),
            tap((result) => {
            setState(
                patch({
                    games: append([result])
                })
            );
        }));
    }

    @Action(EditGame)
    editGame({ setState }: StateContext<GamesStateModel>, { payload }) {
        return this.gamesService.editGame(payload).pipe(
            catchError((x, caught) => {
                return throwError(x);
            }),
            tap((result) => {
            setState(
                patch({
                    games: updateItem<Game>(game => game.numberGame === result.numberGame, result)
                })
            );
        }));
    }

    @Action(DeleteGame)
    deleteGame({ setState }: StateContext<GamesStateModel>, { payload }) {
        return this.gamesService.deleteGame(payload).pipe(
            catchError((x, caught) => {
                return throwError(x);
            }),
            tap((result) => {
            setState(
                patch({
                    games: removeItem<Game>(game => game.numberGame === result.numberGame)
                })
            );
        }));
    }

    @Action(FilterGames, { cancelUncompleted: true })
    filterGames({ getState, setState }: StateContext<GamesStateModel>, { payload }) {
        console.log('167 filterGames getState :', getState);
        return this.gamesService.filterGames(payload).pipe(
            catchError((x, caught) => {
                // console.log('inside catchError', x);
                return throwError(x);
            }),
            tap((result) => {
            // console.log('filterGames result', result);
            const state = getState();
            setState({
                ...state,
                games: [ ...result ]
            });
            /*
            setState(
                patch({
                  games: append(result)
                })
            );
            */
        },
        (error) => {
            console.log('error', error.message);
        }));
    }

    @Action(SaveFilterGames)
    saveFilterGames({ setState }: StateContext<GamesStateModel>, { payload }) {
        setState(
            patch({
                filter: {...payload}
            })
          );
    }

    /*
    @Action(SearchGames, { cancelUncompleted: true })
    searchGames({ getState, setState }: StateContext<GamesStateModel>, { payload }) {
        return this.gamesService.searchGames(payload.queryText).pipe(
            catchError((x, caught) => {
                // console.log('inside catchError', x);
                return throwError(x);
            }),
            tap((result) => {
            const state = getState();
            setState({
                ...state,
                games: [ ...result ]
            });
        },
        (error) => {
            console.log('error', error.message);
        }));
    }
    */

   /*  @Action(GetGameTrailer, { cancelUncompleted: true })
    getGameTrailer({ getState, setState }: StateContext<GamesStateModel>, { payload }) {
        return this.youtubeApiService.searchGameTrailer(payload.gameTitle).pipe(
            catchError((x, caught) => {
                // console.log('inside catchError', x);
                return throwError(x);
            }),
            tap((result) => {
            console.log(result);
        },
        (error) => {
            console.log('error', error.message);
        }));
    } */

    @Action(ClearGames)
    clearGames({ getState, setState }: StateContext<GamesStateModel>) {
        console.log('GameState::clearGames() | action called');
        const state = getState();
        setState({
            ...state,
            games: []
        });
    }

    @Action(LikeGame)
    likeGame({ setState }: StateContext<GamesStateModel>, { payload }) {
        return this.gamesService.editGame(payload).pipe(
            catchError((x, caught) => {
                return throwError(x);
            }),
            tap((result) => {
           setState(
            patch({
                games: updateItem<Game>(game => game.numberGame === result.numberGame, result)
            })
        );
        }));
    }

    /* @Action(CommentGame)
    commentGame({ setState }: StateContext<GamesStateModel>, { payload }) {
        return this.gamesService.editGame(payload).pipe(
            catchError((x, caught) => {
                return throwError(x);
            }),
            tap((result) => {
           setState(
            patch({
                games: updateItem<Game>(game => game.id === result.id, result)
            })
        );
        }));
    } */

    @Action(FavoriteGame)
    favoriteGame({ setState }: StateContext<GamesStateModel>, { payload }) {
        setState(
            patch({
                favorites: append([payload])
            })
        );
    }

    @Action(DeleteFavoriteGame)
    deleteFavoriteGame({ setState }: StateContext<GamesStateModel>, { payload }) {
        setState(
            patch({
                favorites: removeItem<Game>(game => game.numberGame === payload.id)
            })
        );
    }

    @Action(DeleteAllFavoritesGames)
    deleteAllFavoritesGames({ getState, setState }: StateContext<GamesStateModel>) {
        const state = getState();
        setState({
            ...state,
            favorites: []
        });
    }
}
