import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SidebarNav() {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isAdmin = Array.isArray(storedUser.role_name)
    ? storedUser.role_name.includes("ROLE_ADMIN")
    : storedUser.role_name === "ROLE_ADMIN";
    const isFacturador = Array.isArray(storedUser.role_name)
    ? storedUser.role_name.includes("ROLE_ADMIN")
    : storedUser.role_name === "ROLE_ADMIN";
    const [openConfig, setOpenConfig] = useState(false);
    const toggleConfig = () => setOpenConfig(!openConfig);
  return (
    <nav>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link" to="/">
            <span className="ico ico-home"></span>
            <span className="text-label ms-2">Inicio</span>
          </Link>
        </li>
        {(isAdmin || isFacturador) && (
          <>          
            <li className="nav-item">
              <Link className="nav-link" to="/invoicing/">
                <span className="ico ico-document-fill"></span>
                <span className="text-label ms-2">Facturación</span>
              </Link>
            </li>
          </>
        )}
        <li className="nav-item">
          <Link className="nav-link" to="/profile">
            <span className="ico ico-user1"></span>
            <span className="text-label ms-2">Perfil</span>
          </Link>
        </li>
        {isAdmin && (
          <>
            <li className="nav-item">
              {/* Aquí el botón de toggle */}
              <button
                className="nav-link btn w-100 text-start"
                onClick={toggleConfig}
                style={{ border: "none", background: "transparent" }}
              >
                <span className="ico ico-equalizer1"></span>
                <span className="text-label ms-2">Configuración</span>
                <i
                  className={`bi ms-auto ${
                    openConfig ? "bi-chevron-up" : "bi-chevron-down"
                  }`}
                  style={{ float: "right" }}
                ></i>
              </button>
            </li>

            {openConfig && (
              <ul className="nav flex-column ms-4">
                <li className="nav-item">
                  <Link className="nav-link" to="/config/users">
                    <span className="ico ico-users1"></span>
                    <span className="ms-2">Usuarios</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/config/preferences">
                    <span className="ico ico-cog2"></span>
                    <span className="ms-2">Preferencias</span>
                  </Link>
                </li>
              </ul>
            )}
          </>
        )}
      </ul>
    </nav>
  );
}