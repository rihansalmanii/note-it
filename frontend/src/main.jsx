import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HashRouter } from "react-router-dom";
import NotesProvider from "./contexts/NotesContext.jsx";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <NotesProvider>
      <App />
    </NotesProvider>
  </HashRouter>,
);
