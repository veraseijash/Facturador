import { Link, Outlet } from "react-router-dom";
import React, { useState } from "react";
import SidebarNav from "../../components/HomePage/SidebarNav";
import Header from "../../components/HomePage/Header";

export default function HomePage() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="d-grid" style={{ gridTemplateRows: "auto 1fr", height: "100vh" }}>
      {/* Header */}
      <header className="header-gradient d-flex align-items-center justify-content-between px-3">
        <div className=" d-flex align-items-center">
          {/* Botón para colapsar */}
          <button
            className={`btn btn-outline-primary btn-sm btn-collapse me-2 ${
              collapsed ? "active" : ""
            }`}
            onClick={() => setCollapsed(!collapsed)}
          >
            <i className="bi bi-list"></i>
          </button>
          <h1 className="ms-2 h4 mb-0">Facturador</h1>
        </div>
        <div>
          <Header />
        </div>
      </header>

      {/* Contenedor principal */}
      <div className="row g-0 flex-grow-1" style={{ height: "100%" }}>
        {/* Sidebar */}
        <aside
          className={`col-3 col-md-2 main-background p-3 border-end sidebar main-body ${
            collapsed ? "collapsed" : ""
          }`}
        >
          <SidebarNav />
        </aside>

        {/* Contenido dinámico */}
        <main className="col bg-light p-4 main-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
