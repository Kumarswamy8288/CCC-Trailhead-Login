import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/react-app/App";      // alias works now
import "@/react-app/index.css";         // alias works now

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
