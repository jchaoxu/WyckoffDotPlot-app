import { Services } from "../models";
import { movementService } from "./movement.servce";

export const CreateServices = (): Services => {
  const movementServiceUrl = "http://localhost:8000";

  return {
    movementSerivce: movementService(movementServiceUrl),
  };
};
