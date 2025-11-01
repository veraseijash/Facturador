import React, { useEffect, useRef, useState } from "react";
import { Modal, Tooltip } from "bootstrap";
import { getDocumentosFacturador, getCotizacionesDocumentos  } from "../../services/InvoicingService"

export default function ModalComponent({ show, onClose, idPrimerNivel, nroDocumento, periodo }) {
  
  const modalRef = useRef(null);
  const modalInstance = useRef(null);
  const uploadBtnRef = useRef(null);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  console.log('nroDocumento: ', nroDocumento);
  console.log('periodo: ', periodo);

  const [documentosFacturados, setDocumentosFacturados] = useState([]);
  const [cotizaciones, setCotizaciones] = useState([]);

  useEffect(() => {
    if (modalRef.current) {
      // Crear instancia de modal solo una vez
      modalInstance.current = new Modal(modalRef.current, {
        backdrop: "static",
      });

      // Escuchar cuando se cierre
      modalRef.current.addEventListener("hidden.bs.modal", () => {
        if (onClose) onClose();
      });
    }

    return () => {
      if (modalInstance.current) {
        modalInstance.current.dispose();
      }
    };
  }, []);

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  // Manejar archivo seleccionado
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Solo se permiten archivos PDF.");
        event.target.value = ""; // limpia el input
        return;
      }
      setFileName(file.name);
    }
  };

  // Mostrar / ocultar modal
  useEffect(() => {
    if (!modalInstance.current) return;

    if (show) {
      modalInstance.current.show();

      // 🔹 Cargar datos cuando se abra el modal
      if (idPrimerNivel) {
        getDocumentosFacturador(idPrimerNivel)
          .then((res) => {
            setDocumentosFacturados(res || []);
          })
          .catch((err) => {
            console.error("Error cargando documentos facturados:", err);
          });

        getCotizacionesDocumentos(idPrimerNivel)
          .then((res) => {
            setCotizaciones(res || []);
            console.log('cot: ', res)
          })
          .catch((err) => {
            console.error("Error cargando cotizaciones:", err);
          });
      }
      // 🔹 Iniciar tooltip al abrir el modal
      setTimeout(() => {
        if (uploadBtnRef.current) {
          new Tooltip(uploadBtnRef.current);
        }
      }, 200);
    } else {
      modalInstance.current.hide();
    }
  }, [show, idPrimerNivel]);

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      ref={modalRef}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          {/* HEADER */}
          <div className="modal-header">
            <h5 className="modal-title">Documentos</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => modalInstance.current?.hide()}
            ></button>
          </div>

          {/* BODY */}
          <div className="modal-body">
            <div className="p-3 mb-2 bg-light text-dark">
              <h6 className="mb-0">Documentos facturados</h6>
            </div>
            <table className="table table-sm my-2">
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {documentosFacturados.length > 0 ? (
                  documentosFacturados.map((doc, idx) => (
                    <tr key={idx}>
                      <td className="align-middle">
                        <a
                          className="text-decoration-none"
                          href={doc.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "200%" }}
                        >
                          <span className="ico ico-file-pdf text-danger"></span>
                        </a>
                      </td>
                      <td className="text-start">
                        <label className="text-uppercase fw-bold">
                          {doc.nombre_documento}
                        </label>
                        <p className="ant-typography">
                          {doc.tipo_documento}
                        </p>
                      </td>
                      <td className="text-end align-middle">
                        <button className="btn btn-outline-danger btn-sm">
                          <span className="ico ico-trash"></span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No hay documentos facturados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-3 mb-2 bg-light text-dark">
              <h6 className="mb-0">Cotizaciones</h6>
            </div>
            <table className="table table-sm my-2">
              <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cotizaciones.length > 0 ? (
                  cotizaciones.map((cot, idx) => (
                    <tr key={idx}>
                      <td className="align-middle">
                        <a
                          className="text-decoration-none"
                          href={cot.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "200%" }}
                        >
                          <span className="ico ico-file-pdf text-danger"></span>
                        </a>
                      </td>
                      <td className="text-start">
                        <label className="text-uppercase fw-bold">
                          {cot.nombre_documento}
                        </label>
                        <p className="ant-typography">
                          {cot.tipo_documento}
                        </p>
                      </td>
                      <td className="text-end align-middle">
                        <button className="btn btn-outline-danger btn-sm">
                          <span className="ico ico-trash"></span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">
                      No hay cotizaciones.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="p-3 mb-2 bg-light text-dark">
              <h6 className="mb-0">Nuevo documento</h6>
            </div>
            <div className="container">
              <div className="row">
                <div className="col">
                  <label htmlFor="TipoDoc" className="form-label">Tipo</label>
                  <select id="TipoDoc" className="form-select">
                    <option value={-1} disabled>Seleccione...</option>
                    <option value={1}>801 - Orden de compra</option>
                    <option value={2}>802 - Nota de pedido</option>
                    <option value={3}>803 - Contrato</option>
                    <option value={4}>804 - Resolución</option>
                    <option value={5}>HAS - HAS</option>
                    <option value={6}>EM - Entrada de mercadería</option>
                    <option value={7}>HEM - Recepción de materiales</option>
                    <option value={8}>HES - HES</option>
                    <option value={9}>CON - Conformidad</option>
                  </select>
                </div>
                <div className="col">
                  <label htmlFor="NroDoc" className="form-label">Número</label>
                  <input id="NroDoc" className="form-control" type="text" placeholder="Nro. documento..."></input>
                </div>
                <div className="col">
                  <label htmlFor="DateDoc" className="form-label">Fecha</label>
                  <input id="DateDoc" className="form-control" type="date"></input>
                </div>
                <div className="col">
                  <div className="d-flex pt-2">
                    <button 
                      ref={uploadBtnRef}
                      className="btn btn-outline-primary btn-sm"                    
                      data-bs-toggle="tooltip"
                      data-bs-placement="left"
                      data-bs-custom-class="tooltip-info"
                      title="Subir archivo"
                      onClick={handleOpenFileDialog}
                    >
                      <span className="ico ico-cloud-upload1"></span>
                    </button>
                    <button 
                      className="btn btn-outline-primary btn-sm ms-2"
                      disabled={!fileName}
                    >
                      Registrar
                    </button>
                    {/* 🔹 Input oculto para seleccionar archivo */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="ant-typography mt-2 text-end">
                    {fileName ? (
                      <span className="text-success">{fileName}</span>
                    ) : (
                      <span className="text-muted">Ningún archivo seleccionado</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => modalInstance.current?.hide()}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
