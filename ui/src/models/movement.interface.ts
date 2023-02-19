export interface Movement {
  moves: number[];
  trend: Trend;
}

export enum Trend {
  Unknown = 0,
  Increasing = 1,
  Decreasing = 2,
}

export interface SearchMovementResponse {
  data: Movement[];
}

export interface SearchMovementRequest {
  startDate: string;
  endDate: string;
  stockCode: string;
  frequency: string;
  decimalPlaces: number;
  minStep: number;
}
