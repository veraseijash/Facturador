// src/components/InvoicingDetails.jsx
import React, { useEffect, useState } from "react";
import { formatValue, formatInteger } from "../../utils/format";
import { findDataPrimerNivelId } from "../../services/InvoicingService";
import { useBootstrapTooltip } from "../../hooks/useBootstrapTooltip.js";
import ItemModal from "../../components/invoicing/ItemModal.jsx"

export default function InvoicingDetails({ idPri, setType, setOption, }) {
  const [detalle, setDetalle] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  // Hook para inicializar tooltips cada vez que cambia el detalle
  useBootstrapTooltip([detalle]);

  useEffect(() => {
    const fetchDetalle = async () => {
      try {
        const filter = {
          id: idPri,
          tipo: setType,
          option: setOption,
        };
        const result = await findDataPrimerNivelId(filter);
        setDetalle(result);
      } catch (error) {
        console.error("❌ Error al cargar detalle:", error);
      } finally {
        setLoading(false);
      }
    };

    if (idPri && setType && setOption) {
      fetchDetalle();
    }
  }, [idPri, setType, setOption]);

  if (loading) return <p className="text-muted">Cargando detalle...</p>;
  if (!detalle) return <p className="text-danger">No se encontró detalle.</p>;

  return (    
    <div className="p-2">
      {detalle.dataSegundos?.map((segundo) => {
        // Sumar total de los dataTerceros
        const totalCuenta = segundo.dataTerceros.reduce(
          (acc, tercero) => acc + (tercero.total || 0),
          0
        );

        return (
          <div key={segundo.id_segundo_nivel} className="mb-3 py-2 border rounded" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="fw-bold text-primary">
                {segundo.cuenta} <span className="ms-5">Total: {formatValue(totalCuenta).toLocaleString()}</span>
              </h6>
              <div className="d-flex justify-content-end align-items-center">
                {(setOption === "pendiente" && setType === "Con Plan" && segundo.cuenta === '-General') && (
                  <button 
                    className="btn btn-sign-in"
                    data-bs-toggle="tooltip"
                    data-bs-placement="left"
                    data-bs-custom-class="tooltip-info"
                    title="Agregar item"
                    onClick={() => {
                      setSelectedId(segundo.id_segundo_nivel); // guardar id
                      setShowModal(true); // abrir modal
                    }}
                  >
                    <span className="ico ico-plus-alt"></span>
                  </button>
                )}
              </div>
            </div>

            {segundo.dataTerceros.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Servicio</th>
                      <th className="text-center">Cantidad</th>
                      <th>Valor UF</th>
                      <th>Fecha UF</th>
                      <th className="text-end">Precio</th>
                      <th className="text-end bg-primary-live">Total</th>
                      {setOption === "facturado" && (
                        <>
                          <th className="text-secondary">Fecha</th>
                          <th className="text-secondary">Nro factura</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {segundo.dataTerceros.map((tercero) => (
                      <tr key={tercero.id_tercer_nivel}>
                        <td>{tercero.servicio}</td>
                        <td className="text-center">{formatInteger(tercero.cantidad)}</td>
                        <td>{tercero.valor_uf ? formatValue(tercero.valor_uf) : "-"}</td>
                        <td>{tercero.fecha_uf ?? "-"}</td>
                        <td className="text-end">{formatValue(tercero.precio)}</td>
                        <td className="text-end bg-primary-live">{formatValue(tercero.total)}</td>
                        {setOption === "facturado" && (
                          <>
                            <td className="text-secondary">{tercero.fecha ?? "-"}</td>
                            <td className="text-secondary">{tercero.nro_factura ?? "-"}</td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted">Sin detalles de servicios.</p>
            )}
          </div>
        );
      })}
      <ItemModal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Agregar Item"
        selectedId={selectedId}
        onSubmit={(datos) => {
          console.log("Datos recibidos desde ItemModal:", datos);

          // Aquí puedes actualizar tu detalle, hacer fetch, o enviar al backend
          // Por ejemplo, refrescar la tabla:
          setShowModal(false);
        }}
      ></ItemModal>
    </div>
  );
}
