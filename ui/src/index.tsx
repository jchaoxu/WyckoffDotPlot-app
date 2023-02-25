import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { CreateServices } from "./services";
import { ServiceContext } from "./context/services.context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const services = CreateServices();

root.render(
  <React.StrictMode>
    <ServiceContext.Provider value={services}>
      <App />
    </ServiceContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
