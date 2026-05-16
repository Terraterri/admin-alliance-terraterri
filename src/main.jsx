import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// const currentPath = document.location.pathname
// console.log(currentPath);

ReactDOM.createRoot(document.getElementById("root")).render(
  // <BrowserRouter>
  <BrowserRouter>
    <App />
  </BrowserRouter>
);