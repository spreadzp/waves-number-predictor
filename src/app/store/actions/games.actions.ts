import { Game } from '../../models/game.model';

export class FetchGames {
    static readonly type = '[Games] Fetch games';

    constructor(public payload: {start: number, end: number}) {}
}

export class AddGame {
    static readonly type = '[Games] Add game';

    constructor(public payload: Game) {}
}

export class EditGame {
    static readonly type = '[Games] Edit game';

    constructor(public payload: Game) {}
}

export class DeleteGame {
    static readonly type = '[Games] Delete game';

    constructor(public payload: Game) {}
}

export class FilterGames {
    static readonly type = '[Games] Filter games';

    constructor(public payload: {filters: {}}) {console.log('30 [Games] Filter games')}
}

export class SaveFilterGames {
    static readonly type = '[Games] Save Filter games';

    constructor(public payload: {filters: {}}) {}
}

/*
export class SearchGames {
    static readonly type = '[Games] Search games';

    constructor(public payload: { queryText: string}) {}
}
*/

export class GetGameTrailer {
    static readonly type = '[Games] Get game Trailer';

    constructor(public payload: { GameTitle: string}) {}
}

export class ClearGames {
    static readonly type = '[Games] Clear games';

    constructor() {}
}

export class LikeGame {
    static readonly type = '[Games] Like game';

    constructor(public payload: Game) {}
}

export class CommentGame {
    static readonly type = '[Games] Comment game';

    constructor(public payload: Game) {}
}

export class FavoriteGame {
    static readonly type = '[Games] Favorite game';

    constructor(public payload: Game) {}
}

export class DeleteFavoriteGame {
    static readonly type = '[Games] Delete Favorite game';

    constructor(public payload: Game) {}
}

export class DeleteAllFavoritesGames {
    static readonly type = '[Games] Delete All Favorites games';

    constructor() {}
}

export class ClearState {
    static readonly type = '[Games] Clear state';
}
