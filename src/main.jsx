import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./App";
import Admin from "./pages/Admin";
import AuthGate from "./components/AuthGate";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthGate>
              <App />
            </AuthGate>
          }
        />

        <Route
          path="/admin"
          element={
            <AuthGate>
              <Admin />
            </AuthGate>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
