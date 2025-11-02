import React, { useEffect, useRef, useState } from "react";
import { Modal, Tooltip } from "bootstrap";
import { 
  getDocumentosFacturador, 
  getCotizacionesDocumentos, 
  uploadPdf,
  createDocumentosFacturador,
  deleteDocumentosFacturador,
  deleteCreateCotizaciones,
} from "../../services/InvoicingService"
import { toast } from "react-toastify";

export default function ModalComponent({ show, onClose, idPrimerNivel, nroDocumento, periodo }) {
  
  const modalRef = useRef(null);
  const modalInstance = useRef(null);
  const uploadBtnRef = useRef(null);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [selecteTipo, setSelectedTipo] = useState("");
  const [selecteId, setSelectedId] = useState("");
  const [selecteDate, setSelectedDate] = useState("");

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
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        alert("Solo se permiten archivos PDF.");
        event.target.value = "";
        setFile(null);
        setFileName("");
        return;
      }
      setFile(selectedFile);
      setFileName(selectedFile.name);
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

  // 🔹 Subir archivo
  const handleUpload = async () => {
    // Validaciones front-end antes de subir el archivo
    let isValid = true;

    // Limpia estados visuales previos
    document.getElementById("TipoDoc")?.classList.remove("is-invalid");
    document.getElementById("DateDoc")?.classList.remove("is-invalid");
    document.getElementById("NroDoc")?.classList.remove("is-invalid");

    // 1️⃣ Validar tipo de documento
    if (!selecteTipo || selecteTipo === "-1") {
      document.getElementById("TipoDoc")?.classList.add("is-invalid");
      isValid = false;
    }

    // 2️⃣ Validar fecha de documento
    if (!selecteDate) {
      document.getElementById("DateDoc")?.classList.add("is-invalid");
      isValid = false;
    }

    // 3️⃣ Validar ID del documento
    if (!selecteId) {
      document.getElementById("NroDoc")?.classList.add("is-invalid");
      isValid = false;
    }

    // 4️⃣ Validar archivo seleccionado
    if (!file) {
      toast.warning("Debe seleccionar un archivo PDF antes de subirlo");
      isValid = false;
    }

    // Si hay errores, no continúa
    if (!isValid) {
      toast.error("Por favor, complete todos los campos obligatorios");
      return;
    }

    try {
      const res = await uploadPdf(file);
      console.log("Respuesta del backend:", res);

      toast.success(`Archivo ${res.fileName} subido correctamente!`);
      if (res.message === 'ok') {
        const newItem = {
          id_documento: selecteId,
          tipo_documento: selecteTipo,
          fecha_documento: new Date(selecteDate).toISOString(),
          nombre_documento: res.fileName,
          fecha: periodo,
          nro_documento: nroDocumento,
          id_primer_nivel: idPrimerNivel,
          procedencia: 'Facturacion',
          cot_id: 0,
          identificador: 0,
          id_tercer_nivel: 0,
        }
        try {
          await createDocumentosFacturador(newItem);
          toast.success(`Documento registrado correctamente!`);
          // 🔹 Actualiza la tabla con el nuevo documento
          const updatedDocs = await getDocumentosFacturador(idPrimerNivel);
          setDocumentosFacturados(updatedDocs || []);
        } catch (error) {
          console.error("Error subiendo PDF:", error);
          toast.error("Error al registrar");
        }
      }

      // Limpia los campos
      setFile(null);
      setFileName("");
      setSelectedTipo("");
      setSelectedId("");
      setSelectedDate("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      document.getElementById("TipoDoc").value = "-1";
      document.getElementById("NroDoc").value = "";
      document.getElementById("DateDoc").value = "";

      // Recarga lista de documentos
      getDocumentosFacturador(idPrimerNivel)
        .then((res) => setDocumentosFacturados(res || []))
        .catch((err) => console.error("Error recargando documentos:", err));

    } catch (error) {
      console.error("Error subiendo PDF:", error);
      alert("Error al subir el archivo");
    }
  };

  const handleDeleteDocumento = (id) => {
    toast.info(
      <div className="p-2">
        <h6 className="mb-2">¿Eliminar documento?</h6>
        <div className="text-end">
          <button
            className="btn btn-danger btn-sm me-2"
            onClick={async () => {
              try {
                await deleteDocumentosFacturador(id);
                toast.dismiss();
                toast.success("Documento eliminado correctamente");

                // Recarga lista
                const updatedDocs = await getDocumentosFacturador(idPrimerNivel);
                setDocumentosFacturados(updatedDocs || []);
              } catch (error) {
                console.error(error);
                toast.dismiss();
                toast.error("Error al eliminar el documento");
              }
            }}
          >
            <i className="bi bi-trash"></i> Sí
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => toast.dismiss()}
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        className: "border border-warning bg-light shadow",
      }
    );
  };

  const handleDeleteCotizacion = async (id) => {
    toast.info(
      <div className="p-2">
        <h6 className="mb-2">¿Eliminar documento?</h6>
        <div className="text-end">
          <button
            className="btn btn-danger btn-sm me-2"
            onClick={async () => {
              try {
                await deleteCreateCotizaciones(id);
                toast.dismiss();
                toast.success("Documento eliminado correctamente");

                // Recarga lista
                const updatedDocs = await getCotizacionesDocumentos(idPrimerNivel);
                setCotizaciones(updatedDocs || []);
              } catch (error) {
                console.error(error);
                toast.dismiss();
                toast.error("Error al eliminar el documento");
              }
            }}
          >
            <i className="bi bi-trash"></i> Sí
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => toast.dismiss()}
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        className: "border border-warning bg-light shadow",
      }
    );
  };

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
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteDocumento(doc.id)}
                        >
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
                        <button 
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteCotizacion(cot.id)}
                        >
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
                  <select 
                    id="TipoDoc" 
                    className="form-select" 
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedTipo(value);
                    }}
                  >
                    <option value={-1}>Seleccione...</option>
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
                  <input 
                    id="NroDoc" 
                    className="form-control" 
                    type="text" 
                    placeholder="Nro. documento..."
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedId(value);
                    }}
                  ></input>
                </div>
                <div className="col">
                  <label htmlFor="DateDoc" className="form-label">Fecha</label>
                  <input 
                    id="DateDoc" 
                    className="form-control" 
                    type="date"
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedDate(value);
                    }}
                  ></input>
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
                    {/* 🔹 BOTÓN REGISTRAR */}
                    <button 
                      className="btn btn-outline-primary btn-sm ms-2"
                      disabled={!fileName}
                      onClick={handleUpload} // 👈 aquí llamamos al servicio
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
