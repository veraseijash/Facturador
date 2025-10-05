import React, { useState } from "react";
import InvoicingTable from "../../components/invoicing/InvoicingTable";

const getLastMonths = (n) => {
  const months = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push(month);
  }
  return months;
};

export default function InvoicingPage() {
    const [typeOption, settypeOption] = useState("pendiente");
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))
    const [monthsCount, setMonthsCount] = useState(3);
    const months = getLastMonths(monthsCount);
  return (
    <div className="container mt-4">
        <h2 className="h5 mb-3">Facturación</h2>
        <nav className="navbar navbar-expand-lg navbar-light px-2">
            <div className="collapse navbar-collapse" id="navbarGroup">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <button
                        className={`nav-link ${typeOption === "pendiente" ? "active" : ""}`}
                        onClick={() => settypeOption("pendiente")}
                        >
                        Pendientes
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                        className={`nav-link ${typeOption === "facturado" ? "active" : ""}`}
                        onClick={() => settypeOption("facturado")}
                        >
                        Facturado
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                        className={`nav-link ${typeOption === "sin_consumo" ? "active" : ""}`}
                        onClick={() => settypeOption("sin_consumo")}
                        >
                        Sin Consumo
                        </button>
                    </li>
                </ul>
                <div className="d-flex">
                    <div className="btn-group" role="group" aria-label="Basic radio toggle button group">
                        {months.map((m) => (
                            <React.Fragment key={m}>
                                <input
                                type="radio"
                                className="btn-check"
                                name="btnmonth"
                                id={`btnmonth-${m.replace("-", "")}`}
                                value={m}
                                checked={month === m}
                                onChange={(e) => setMonth(e.target.value)}
                                />
                                <label className="btn btn-outline-primary" htmlFor={`btnmonth-${m.replace("-", "")}`}>
                                {m}
                                </label>
                            </React.Fragment>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="btn btn-outline-primary ms-1"
                        onClick={() => setMonthsCount((prev) => prev + 1)} // 🔹 incrementa monthsCount
                        >
                            <i className="bi bi-plus-lg"></i>
                    </button>
                </div>
            </div>
        </nav>
        <InvoicingTable setOption={typeOption} setDate={month} setType="Con Plan" />
        <InvoicingTable setOption={typeOption} setDate={month} setType="Sin Plan" />
    </div>
  );
}
