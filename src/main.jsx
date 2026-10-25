import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Wait until script.js has finished setting up its saved data
document.addEventListener("DOMContentLoaded", function () {
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
});