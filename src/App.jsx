import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/dashboard/HomePage";
import PrivateRoute from "./components/PrivateRoute";
import PerfilPage from "./pages/setups/PerfilPage";
import ConfigPage from "./pages/setups/ConfigPage";
import InicioPage from "./pages/dashboard/InicioPage";
import ListPage from "./pages/users/ListPage";


export default function App() {
  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || null;

    if (storedUser?.loginAt) {
      const loginTime = new Date(storedUser.loginAt).getTime();
      const now = Date.now();
      const diffHours = (now - loginTime) / (1000 * 60 * 60);

      if (diffHours >= 24) {
        localStorage.removeItem("user");
        return null;
      }
    }
    return storedUser;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={(u) => setUser(u)} />}
        />

        <Route
          path="/"
          element={
            user ? (
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<InicioPage />} />
          <Route path="profile" element={<PerfilPage />} />

          {/* Rutas de configuración */}
          <Route path="config/preferences" element={<ConfigPage />} />
          <Route path="config/users" element={<ListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
