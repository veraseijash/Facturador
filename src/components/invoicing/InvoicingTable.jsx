import React, { useState, useEffect } from "react";
import { buscarPorFechaByTipo, updateStatusPrefactura } from "../../services/InvoicingService";
import { formatValue } from "../../utils/format";
import { toast } from "react-toastify";

export default function InvoicingTable({ setType, setDate }) {
    const [showFilter, setShowFilter] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    const [filterText, setFilterText] = useState("");
    const [filteredData, setFilteredData] = useState(data);
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

    // 🔽 Componente para manejar el dropdown de estados
    const DropdownStatus = ({ ultimo, item }) => {
        const getFechaActual = () => {
            const hoy = new Date();
            return hoy.toISOString().split("T")[0]; // yyyy-MM-dd
        };

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
                    fecha_cambio: new Date(getFechaActual()),
                    user_name: item.cliente?.user?.user_name || "desconocido",
                    color_status: statusMap[cssClass],
                };
                console.log('statusData: ', statusData);
                await updateStatusPrefactura(ultimo.id, statusData);
                // Actualizar el estado local de filteredData para cambiar el color del botón
                setFilteredData(prevData =>
                    prevData.map(d => {
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

                // Opcional: refrescar los datos para que el botón cambie de color
                fetchData();
            } catch (error) {
                console.error("❌ Error al actualizar status:", error);
                toast.error("Error al actualizar el estado.");
            }
        };

        return (
            <div className="dropdown dropup">
                <button
                    className={`btn btn-sm ${ultimo.color_status}`}
                    id={`dropdownStatus-${ultimo.id}`}
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    title={`Último cambio: ${ultimo.user_name} ${ultimo.fecha_cambio}`}
                >
                    P
                </button>
                <ul className="dropdown-menu" aria-labelledby={`dropdownStatus-${ultimo.id}`}>
                    <li><a className="dropdown-item blanco-status" href="#" onClick={() => handleStatusChange("blanco-status")}>Pendiente</a></li>
                    <li><a className="dropdown-item gris-status" href="#" onClick={() => handleStatusChange("gris-status")}>Generada</a></li>
                    <li><a className="dropdown-item amarillo-status" href="#" onClick={() => handleStatusChange("amarillo-status")}>Enviada</a></li>
                    <li><a className="dropdown-item rojo-status" href="#" onClick={() => handleStatusChange("rojo-status")}>Rechazada</a></li>
                    <li><a className="dropdown-item verde-status" href="#" onClick={() => handleStatusChange("verde-status")}>Aprobada</a></li>
                </ul>
            </div>
        );
    };

    return (
        <div className="card card-invoicing mt-2">
            <div className="card-title p-2">
                <div className="d-flex align-items-center">
                    <button
                        type="button"
                        id="listFilter"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => {
                            if (showFilter) {
                                setFilterText("");
                                setFilteredData(data);
                            }
                            setShowFilter(!showFilter);
                        }}
                    >
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
                                        setFilteredData(data);
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
                                <i className={`bi bi-chevron-up collapse-icon ${isOpen ? "" : "rotate"}`}></i>
                            </button>
                            <div className="ms-2 fw-bold h6 mb-0">Clientes con contrato:</div>
                            <span className="ms-2 h6 mb-0">{cantContrato}</span>
                            <div className="ms-5 fw-bold h6 mb-0">Total pendiente:</div>
                            <span className="ms-2 h6 mb-0">{formatValue(sumaConsumido)}</span>
                        </div>
                        <div className={`collapse-content ${isOpen ? "show" : ""}`} id="collapseContrato">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Razon Social</th>
                                        <th></th>
                                        <th>condición<br />pago</th>
                                        <th></th>
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
                                                        <button className="btn btn-sm blancoConPlan text-light-gray">
                                                        <i className="bi bi-file-earmark-fill"></i>
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="text-end">{formatValue(item.total_consumido)}</td>
                                                <td>
                                                    <span className="fw-bold text-secondary">
                                                        {item.cliente?.user?.user_name || ""}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center">No hay datos</td>
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
