export class Game {
    numberGame: number;
    secretNumberOfGame: number;
    gamerBets: GamerBet;
    bank: number;
    rounds: Round[];
    winners: GamerBet[]
    constructor() {
        this.rounds = new Array();
        this.winners = new Array();
    }
}

export interface GamerBet {
    addressGamer: string;
    sumBets: number
}

export class Round {
    numberRound: number;
    isLastWinnerRangeUp: boolean;
    gamersBetUp: GamerRoundBet[];
    gamersBetDown: GamerRoundBet[];
    minNumberRange: number;
    maxNumberRange: number;
    constructor() {
        this.gamersBetUp = new Array();
        this.gamersBetDown = new Array();
    }
}

export interface GamerRoundBet {
    roundAndAddressGamer: string;
    bet: number
}
