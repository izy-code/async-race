export interface Car {
  id: number;
  name: string;
  color: string;
  [key: string]: unknown;
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
