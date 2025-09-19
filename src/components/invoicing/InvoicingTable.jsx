import React, { useState, useEffect } from "react";
import { buscarPorFechaByTipo } from "../../services/InvoicingService";
import { formatValue } from "../../utils/format";

export default function InvoicingTable({ setType, setDate }) {
    const [showFilter, setShowFilter] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    const [filterText, setFilterText] = useState(""); // texto que escribe el usuario
    const [filteredData, setFilteredData] = useState(data); // datos filtrados
    const [cantContrato, setCantContrato] = useState(0);
    const [sumaConsumido, setSumaConsumido] = useState(0);
    // Ejecutar la consulta cada vez que cambien setDate o setType
    useEffect(() => {
        fetchData();
    }, [setDate, setType]);

    const fetchData = async () => {
        if (!setDate || !setType) return;

        setLoading(true);
        try {
            const filter = {
            fecha: setDate,
            tipo: "Con Plan",
            option: setType,
            };
            const result = await buscarPorFechaByTipo(filter);
            setData(result);
            setFilteredData(result);  
            setCantContrato(result.length);
             const suma = result.reduce(
                (acc, item) => acc + (item.total_consumido || 0),
                0
            );
            setSumaConsumido(suma);

        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="card card-invoicing mt-2">
            <div className="card-title p-2">
                <div className="d-flex align-items-center align-items-center">
                    <button type="button" id="listFilter" className="btn btn-sm btn-outline-primary" onClick={() => {
                        if (showFilter) {
                            // se va a ocultar
                            setFilterText("");
                            setFilteredData(data);
                        }
                        setShowFilter(!showFilter);
                    }}>
                        <i className="bi bi-funnel-fill"></i>
                    </button>
                    {showFilter && (
                        <div className="input-group input-group-sm ms-2">
                            <input
                                type="text"
                                className="form-control border-primary"
                                aria-describedby="button-addon2"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                            <button
                                className="btn btn-outline-primary"
                                type="button"
                                id="buttonFilter"
                                onClick={() => {
                                if (!filterText) {
                                    setFilteredData(data); // si está vacío, mostrar todos
                                } else {
                                    const lowerText = filterText.toLowerCase();
                                    setFilteredData(
                                    data.filter((item) =>
                                        item.razon_social?.toLowerCase().includes(lowerText)
                                    )
                                    );
                                }
                                }}
                            >
                                Buscar
                            </button>
                        </div>
                    )}
                </div>
                <div>Tipo: {setType}</div>
            </div>
            <div className="card-body">
                {loading ? (
                <p>Cargando...</p>
                ) : (
                    <>
                        <div className="d-flex justify-content-start align-items-center">
                            <button
                                className="btn btn-light btn-sm"
                                type="button"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <i
                                    className={`bi bi-chevron-up collapse-icon ${isOpen ? "" : "rotate"}`}
                                ></i>
                            </button>                            
                            <div className="ms-2 fw-bold h6 mb-0">
                                Clientes con contrato:
                            </div>
                            <span className="ms-2 h6 mb-0">{cantContrato}</span>
                            <div className="ms-5 fw-bold h6 mb-0">
                                Total pendiente:
                            </div>
                            <span className="ms-2 h6 mb-0">{formatValue(sumaConsumido)}</span>
                        </div>
                        <div 
                            className={`collapse-content ${isOpen ? "show" : ""}`} id="collapseContrato"
                        >
                            <table className="table table-sm">
                                <thead>
                                <tr>
                                    <th>Razon Social</th>
                                    <th></th>
                                    <th>condición<br></br>pago</th>
                                    <th></th>
                                    <th className="text-end">Total neto</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? (
                                        filteredData.map((item) => (
                                        <tr key={item.id_primer_nivel}>
                                            <td>{item.razon_social}</td>
                                            <td>{item.nro_documento}</td>
                                            <td>{item.cliente?.condicion_pago || "30 días"}</td>
                                            <td>
                                                {item.statusPrefacturas.length > 0 && (() => {
                                                    const ultimo = item.statusPrefacturas[item.statusPrefacturas.length - 1]; // tomar el último registro
                                                    return (
                                                    <button
                                                        className={`btn btn-sm ${ultimo.color_status}`} 
                                                        type="button"
                                                        title={`Último cambio: ${ultimo.user_name} ${ultimo.fecha_cambio}`}
                                                    >
                                                        P
                                                    </button>
                                                    );
                                                })()}
                                            </td>
                                            <td className="text-end">{formatValue(item.total_consumido)}</td>
                                            <td><span className="fw-bold text-secondary">{item.cliente?.user?.user_name || ""}</span></td>
                                        </tr>
                                        ))
                                    ) : (
                                        <tr>
                                        <td colSpan={6} className="text-center">
                                            No hay datos
                                        </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}