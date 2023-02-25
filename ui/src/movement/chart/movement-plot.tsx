import React, { useCallback, useContext, useEffect, useState } from "react";
import { ServiceContext } from "../../context/services.context";
import { Movement, SearchMovementRequest } from "../../models";
import { DotPlot } from "./dot-plot";
import { Filters } from "./filters";
import { mockData } from "./mock";
import "./movement-plot.scss";

export const MovementPlot: React.FC = () => {
  const [movements, setMovements] = useState<Movement[]>(mockData);
  const [searchRequest, setSearchRequest] = useState<SearchMovementRequest>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const services = useContext(ServiceContext);

  const handleSearch = useCallback(async () => {
    if (!searchRequest) return;

    setIsLoading(true);
    try {
      const response = await services.movementSerivce.searchMovement(
        searchRequest
      );
      setMovements(response.data);
    } catch (e) {
      setMovements([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchRequest, services.movementSerivce]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div className="movement-container">
      <Filters onSearch={setSearchRequest}></Filters>
      {searchRequest && (
        <DotPlot data={movements} isLoading={isLoading}></DotPlot>
      )}
    </div>
  );
};
