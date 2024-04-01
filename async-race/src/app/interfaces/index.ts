export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface EngineResponse {
  velocity: number;
  distance: number;
}

export interface Winner {
  id: number;
  time: string;
  wins: string;
}

export interface WinnersData {
  winners: (Winner & Car)[];
  winnersCount: number;
  currentPage: number;
  pageCount: number;
}
