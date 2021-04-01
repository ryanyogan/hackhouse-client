import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { Listings } from "./sections";

ReactDOM.render(
  <React.StrictMode>
    <Listings title="TinyHouse Listings" />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
