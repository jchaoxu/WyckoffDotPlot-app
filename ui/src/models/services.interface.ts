import { SearchMovementRequest, SearchMovementResponse } from ".";

export interface MovementService {
  searchMovement: (
    request: SearchMovementRequest
  ) => Promise<SearchMovementResponse>;
}

export interface Services {
  movementSerivce: MovementService;
}
