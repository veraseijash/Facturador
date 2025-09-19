import React, { useState } from "react";
import InvoicingTable from "../../components/invoicing/InvoicingTable";

export default function InvoicingPage() {
    const [month, setMonth] = useState("2025-08");
    const [typeInvoicing, setTypeInvoicing] = useState("pendiente");
  return (
    <div className="container mt-4">
        <h2 className="h5 mb-3">Facturación</h2>
        <nav className="navbar navbar-expand-lg navbar-light px-2">
            <div className="collapse navbar-collapse" id="navbarGroup">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <button
                        className={`nav-link ${typeInvoicing === "pendiente" ? "active" : ""}`}
                        onClick={() => setTypeInvoicing("pendiente")}
                        >
                        Pendientes
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                        className={`nav-link ${typeInvoicing === "facturado" ? "active" : ""}`}
                        onClick={() => setTypeInvoicing("facturado")}
                        >
                        Facturado
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                        className={`nav-link ${typeInvoicing === "sin_consumo" ? "active" : ""}`}
                        onClick={() => setTypeInvoicing("sin_consumo")}
                        >
                        Sin Consumo
                        </button>
                    </li>
                </ul>
                <div className="d-flex">
                    <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input
                        type="radio"
                        className="btn-check"
                        name="btnmonth"
                        id="btnmonth-202508"
                        value="2025-08"
                        checked={month === "2025-08"}
                        onChange={(e) => setMonth(e.target.value)}
                        />
                        <label className="btn btn-outline-primary" htmlFor="btnmonth-202508">
                            2025-08
                        </label>

                        <input
                        type="radio"
                        className="btn-check"
                        name="btnmonth"
                        id="btnmonth-202507"
                        value="2025-07"
                        checked={month === "2025-07"}
                        onChange={(e) => setMonth(e.target.value)}
                        />
                        <label className="btn btn-outline-primary" htmlFor="btnmonth-202507">
                            2025-07
                        </label>

                        <input
                        type="radio"
                        className="btn-check"
                        name="btnmonth"
                        id="btnmonth-202506"
                        value="2025-06"
                        checked={month === "2025-06"}
                        onChange={(e) => setMonth(e.target.value)}
                        />
                        <label className="btn btn-outline-primary" htmlFor="btnmonth-202506">
                            2025-06
                        </label>
                    </div>
                    <button type="button" className="btn btn-outline-primary ms-1"><i className="bi bi-plus-lg"></i></button>
                </div>
            </div>
        </nav>
        <InvoicingTable setType={typeInvoicing} setDate={month} />
    </div>
  );
}
