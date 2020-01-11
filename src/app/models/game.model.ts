export class Game {
    id: string;
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
/* {
    "id": "1",
    "typeGame": "1024",
    "bankGame": 58,
    "minBetGame": "1",
    "winNumber": null,
    "winners": [
      {
        "addressWinner": "adf",
        "sumPrize": 15
      },
      {
        "addressWinner": "ajdf",
        "sumPrize": 15
      }
    ],
    "rounds": [
      {
        "round": "1",
        "winDirection": 0,
        "gameMinNumber": 0,
        "gameMaxNamber": 1023,
        "rates": [
          {
            "address": "abc",
            "bet": 1,
            "betDirection": 0
          },
          {
            "address": "fjh",
            "bet": 1,
            "betDirection": 1
          }
        ]
      } */

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
