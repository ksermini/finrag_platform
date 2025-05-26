import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './styles/index.css'; // This will cascade the full theme

// main.jsx or App.jsx
import { SidebarProvider } from "./context/SidebarContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SidebarProvider>
    <App />
  </SidebarProvider>
);

