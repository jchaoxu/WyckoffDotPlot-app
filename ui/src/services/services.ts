import { Services } from "../models";
import { movementService } from "./movement.servce";

export const CreateServices = (): Services => {
  const movementServiceUrl = "https://dot-app-api.azurewebsites.net";

  return {
    movementSerivce: movementService(movementServiceUrl),
  };
};
