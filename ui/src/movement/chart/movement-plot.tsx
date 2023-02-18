import React, { useState } from "react";
import { Movement } from "../../models";
import { DotPlot } from "./dot-plot";
import { Filters } from "./filters";
import { mockData } from "./mock";
import "./movement-plot.scss";

export const MovementPlot: React.FC = () => {
  const [movements, setMovements] = useState<Movement[]>(mockData);

  return (
    <div className="movement-container">
      <Filters></Filters>
      <DotPlot data={movements}></DotPlot>
    </div>
  );
};
