import {
  MovementService,
  SearchMovementRequest,
  SearchMovementResponse,
} from "../models";

export const movementService = (serviceUrl: string): MovementService => ({
  searchMovement: async (request: SearchMovementRequest) => {
    const response = await fetch(serviceUrl + "/movement/search", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      method: "POST",
    });
    return response.json() as Promise<SearchMovementResponse>;
  },
});
