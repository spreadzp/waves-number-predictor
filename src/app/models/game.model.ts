export class Game {
    id: string;
    typeGame: string;
    gameOver: boolean;
    genre: string;
    title: string;
    genreImage: string;
    notes: string;
    poster: string;
    likes: number;
    rate: number;
    comments: string[];
    minBet: number;
    count: number;
    numberGame: number;
    secretNumberOfGame: number;
    gamerBets: GamerBet[];
    bank: number;
    rounds: Round[];
    winners: GamerBet[]
    constructor() {
        this.gamerBets = new Array();
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

export interface ResultsGames {
  idGame: string,
  isFinished: boolean
}
export interface GamerBet {
    addressGamer: string;
    sumBets: number
}

export class Round {
    numberRound: number;
    isLastWinnerRangeUp: boolean;
    isRoundFinish: boolean;
    gamersBetUp: Array<string>;
    gamersBetDown: Array<string>;
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

export enum DirectionBet {
  RangeDown = 1,
  RangeUp = 2
}
