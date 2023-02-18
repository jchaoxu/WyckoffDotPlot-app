import { createContext } from "react";
import { Services } from "../models";

export const ServiceContext = createContext<Services>({} as Services);
