import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement as HTMLElement);
  root.render(
    // <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    // </React.StrictMode>
  );
} else {
  throw new Error("Root element not found");
}
