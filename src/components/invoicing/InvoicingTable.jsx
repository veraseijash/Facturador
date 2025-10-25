import React, { useState, useEffect } from "react";
import { Popover, Tooltip } from "bootstrap";
import { buscarPorFechaByTipo, updateStatusPrefactura, compareConsumption } from "../../services/InvoicingService";
import { formatValue } from "../../utils/format";
import { toast } from "react-toastify";
import InvoicingDetails from "./InvoicingDetails";
import { createPortal } from "react-dom";

export default function InvoicingTable({ setType, setDate, setOption }) {
    const [showFilter, setShowFilter] = useState(false);
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [filterText, setFilterText] = useState("");
    const [cantContrato, setCantContrato] = useState(0);
    const [sumaConsumido, setSumaConsumido] = useState(0);
    const [expandedRows, setExpandedRows] = useState([]);
    const [comparaciones, setComparaciones] = useState({});

    const toggleRow = (id) => {
        setExpandedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };
    
    const fetchComparaciones = async (datos) => {
        const nuevasComparaciones = {};
        
        await Promise.all(
            datos.map(async (item) => {
                try {
                    const result = await compareConsumption({ 
                        id_cliente: item.id_cliente, 
                        fecha: setDate 
                    });
                    nuevasComparaciones[item.id_primer_nivel] = result?.comparacion ?? 2;
                } catch (error) {
                    console.error("Error al obtener comparación:", error);
                    nuevasComparaciones[item.id_primer_nivel] = 2; // valor por defecto si falla
                }
            })
        );

        setComparaciones(nuevasComparaciones);
    };

    const getComparacionIcon = (valor) => {
        switch(valor) {
            case 2:
                return <i className="bi bi-arrow-up-short text-success"></i>;
            case 1:
                return <i className="bi bi-arrow-down-short text-danger"></i>;
            case 0:
                return <i className="bi bi-arrows text-secondary"></i>;
            default:
                return "-";
        }
    };

    const fetchData = async () => {
        if (!setDate || !setType || !setOption) return;
        setLoading(true);
        try {
            const filter = { fecha: setDate, tipo: setType, option: setOption };
            const result = await buscarPorFechaByTipo(filter);
            setData(result);
            setFilteredData(result);
            setCantContrato(result.length);

            const suma = result.reduce((acc, item) => acc + (item.total_consumido || 0), 0);
            setSumaConsumido(suma);
            fetchComparaciones(result);
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
            setFilteredData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [setDate, setType, setOption]);

    useEffect(() => {
        const popoverTriggerList = Array.from(
            document.querySelectorAll('[data-bs-toggle="popover"]')
        );
        popoverTriggerList.forEach((el) => new Popover(el));
    }, [filteredData]);

    const DropdownStatus = ({ ultimo, item }) => {
    const [isActive, setIsActive] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0, width: 0 });

    const statusMap = {
        "blanco-status": "blancoConPlan",
        "gris-status": "grisConPlan",
        "amarillo-status": "amarilloConPlan",
        "rojo-status": "rojoConPlan",
        "verde-status": "verdeConPlan",
    };

    const handleStatusChange = async (cssClass) => {
        try {
            const newColor = statusMap[cssClass];
            const statusData = {
                fecha_cambio: new Date().toISOString().split("T")[0],
                user_name: item.cliente?.user?.user_name || "desconocido",
                color_status: newColor,
            };

            await updateStatusPrefactura(ultimo.id, statusData);

            setFilteredData((prevData) =>
                prevData.map((d) => {
                    if (d.id_primer_nivel === item.id_primer_nivel) {
                        const updatedStatusPrefacturas = [...d.statusPrefacturas];
                        updatedStatusPrefacturas[updatedStatusPrefacturas.length - 1] = {
                            ...ultimo,
                            color_status: newColor,
                            fecha_cambio: statusData.fecha_cambio,
                            user_name: statusData.user_name,
                        };
                        return { ...d, statusPrefacturas: updatedStatusPrefacturas };
                    }
                    return d;
                })
            );

            toast.success("Estado actualizado correctamente!");
            fetchData();
        } catch (error) {
            console.error("❌ Error al actualizar status:", error);
            toast.error("Error al actualizar el estado.");
        } finally {
            setIsActive(false); // cierra el menú
        }
    };

    const buttonRef = React.useRef(null);

    const toggleDropdown = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setButtonPosition({
                top: rect.top,
                left: rect.left,
                width: rect.width
            });
        }
        setIsActive(!isActive);
    };


    return (
        <>
            <button
                ref={buttonRef}
                className={`btn btn-sm ${ultimo.color_status}`}
                type="button"
                onClick={toggleDropdown}
                title={`Último cambio: ${ultimo.user_name} ${ultimo.fecha_cambio}`}
            >
                P
            </button>

            {isActive && createPortal(
                <ul
                    className="dropdown-menu active"
                    style={{
                        position: "fixed",
                        top: buttonPosition.top - 5, // ajusta según quieras que aparezca arriba
                        left: buttonPosition.left,
                        width: buttonPosition.width,
                        zIndex: 9999,
                        display: "block",
                        padding: "5px",
                    }}
                >
                    <li><a className="dropdown-item blanco-status" style={{ fontSize: "80%" }} href="#" onClick={() => handleStatusChange("blanco-status")}>Pendiente</a></li>
                    <li><a className="dropdown-item gris-status" style={{ fontSize: "80%" }} href="#" onClick={() => handleStatusChange("gris-status")}>Generada</a></li>
                    <li><a className="dropdown-item amarillo-status" style={{ fontSize: "80%" }} href="#" onClick={() => handleStatusChange("amarillo-status")}>Enviada</a></li>
                    <li><a className="dropdown-item rojo-status" style={{ fontSize: "80%" }} href="#" onClick={() => handleStatusChange("rojo-status")}>Rechazada</a></li>
                    <li><a className="dropdown-item verde-status" style={{ fontSize: "80%" }} href="#" onClick={() => handleStatusChange("verde-status")}>Aprobada</a></li>
                </ul>,
                document.body
            )}
        </>
    );
};



    return (
        <div className="card card-invoicing mt-2">
            <div className="card-title p-2">
                <div className="d-flex align-items-center">
                    <button
                        type="button"
                        className="btn btn-sign-in"
                        onClick={() => {
                            if (showFilter) {
                                setFilterText("");
                                setFilteredData(data);
                            }
                            setShowFilter(!showFilter);
                        }}
                    >
                        <span className="ico ico-search1"></span>
                    </button>
                    {showFilter && (
                        <div className="input-group input-group-sm ms-2">
                            <input
                                type="text"
                                className="form-control border-primary"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                            />
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => {
                                    if (!filterText) setFilteredData(data);
                                    else {
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
                <div className="text-primary"><strong>{setType}</strong></div>
            </div>
            <div className="card-body">
                {loading ? (
                    <p>Cargando...</p>
                ) : (
                    <>
                        <div className="d-flex justify-content-start align-items-center mb-2">
                            <button
                                className="btn btn-light btn-sm"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <i className={`bi bi-chevron-up collapse-icon ${isOpen ? "" : "rotate"}`}></i>
                            </button>
                            <div className="ms-2 fw-bold h6 mb-0">
                                {setType === "Con Plan" ? "Clientes con contrato:" : "Cliente prepago:"}
                            </div>
                            <span className="ms-2 h6 mb-0">{cantContrato}</span>
                            <div className="ms-5 fw-bold h6 mb-0">Total movimientos:</div>
                            <span className="ms-2 h6 mb-0">{formatValue(sumaConsumido)}</span>
                        </div>
                        <div className={`collapse-content ${isOpen ? "show" : ""}`}>
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Razon Social</th>
                                        <th></th>
                                        <th>Condición<br />pago</th>
                                        <th></th>
                                        <th></th>
                                        <th className="text-end">Total neto</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.length > 0 ? filteredData.map((item) => (
                                        <React.Fragment key={item.id_primer_nivel}>
                                            <tr>
                                                <td>
                                                    <button className="btn btn-sm" onClick={() => toggleRow(item.id_primer_nivel)}>
                                                        <i className={`bi ${expandedRows.includes(item.id_primer_nivel) ? "bi-chevron-down" : "bi-chevron-up"} collapse-icon`}></i>
                                                    </button>
                                                </td>
                                                <td>{item.razon_social}</td>
                                                <td>{item.nro_documento}</td>
                                                <td>{item.cliente?.condicion_pago || "30 días"}</td>
                                                <td>
                                                    {item.statusPrefacturas.length > 0 && (
                                                        <DropdownStatus
                                                            ultimo={item.statusPrefacturas[item.statusPrefacturas.length - 1]}
                                                            item={item}
                                                        />
                                                    )}
                                                </td>
                                                <td>
                                                    {(item.tiene_doc > 0 || 
                                                      (item.cliente.conOrdenCompra + item.cliente.conNumeroRecepcion + item.cliente.conEntradaMercaderia > 0)) && (
                                                        <button className="btn btn-sign-in blancoConPlan">
                                                            <span className="ico ico-files-empty"></span>
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="text-end">{formatValue(item.total_consumido)}</td>
                                                <td className="text-center">
                                                    {getComparacionIcon(comparaciones[item.id_primer_nivel])}
                                                </td>
                                                <td>
                                                    <button type="button" className="btn btn-sign-in" data-bs-container="body" data-bs-toggle="popover"
                                                     data-bs-title="Comentario" data-bs-placement="top" data-bs-content={item.cliente?.comentario || "Sin comentario"}>
                                                        <span
                                                            className={`ico ico-comment-stroke ${
                                                            !item.cliente?.comentario ? "text-secondary" : ""
                                                            }`}
                                                        ></span>
                                                    </button>
                                                </td>
                                                <td>
                                                    <span className="fw-bold text-secondary">{item.cliente?.user?.user_name || ""}</span>
                                                </td>
                                            </tr>

                                            {/* Fila expandible */}
                                            {expandedRows.includes(item.id_primer_nivel) && (
                                                <tr>
                                                    <td colSpan={10} className="bg-light">
                                                        <InvoicingDetails
                                                            idPri={item.id_primer_nivel}
                                                            setType={setType}
                                                            setOption={setOption}
                                                            onTotalsUpdate={(totals) => {
                                                                setData((prevData) => {
                                                                    // ✅ Creamos una copia actualizada de los datos
                                                                    const updatedData = prevData.map((i) =>
                                                                        i.id_primer_nivel === item.id_primer_nivel
                                                                            ? { ...i, total_consumido: totals.total_consumido }
                                                                            : i
                                                                    );

                                                                    // ✅ Recalculamos el total general usando la nueva lista
                                                                    const nuevaSuma = updatedData.reduce(
                                                                        (acc, i) => acc + (i.total_consumido || 0),
                                                                        0
                                                                    );
                                                                    setSumaConsumido(nuevaSuma);

                                                                    return updatedData;
                                                                });

                                                                // ✅ También sincronizamos filteredData
                                                                setFilteredData((prevFiltered) =>
                                                                    prevFiltered.map((i) =>
                                                                        i.id_primer_nivel === item.id_primer_nivel
                                                                            ? { ...i, total_consumido: totals.total_consumido }
                                                                            : i
                                                                    )
                                                                );
                                                            }}
                                                        />
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    )) : (
                                        <tr>
                                            <td colSpan={10} className="text-center">No hay datos</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
