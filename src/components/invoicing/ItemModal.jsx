import React, { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import { findActiveByCountry, getValoresEconomicos, getDataSegundoNivelId, createDataTercerNivel, actualizarTotales  } from "../../services/InvoicingService";

export default function ItemModal({ show, onClose, title, selectedId, onSubmit}) {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [selectedServiceName, setSelectedServiceName] = useState("");
  const [selectedUnidad, setSelectedUnidad ] = useState("$");
  const [selecteCantidad, setSelectedCantidad] = useState("");
  const [selectedPrecio, setSelectedPrecio] = useState("");
  const [valoresEconomicos, setValoresEconomicos] = useState([]);
  const [selectedValorFecha, setSelectedValorFecha] = useState("");
  const [selectedValorUf, setSelectedValorUf] = useState("");
  const [cuenta, setCuenta] = useState("");
  const [idPriNivel, setIdPriNivel] = useState("");
  const [nroDocumento, setNroDocumento] = useState("");
  const [fecha, setFecha] = useState("");

  // Estados para validación
  const [errors, setErrors] = useState({
    selectedService: false,
    selectedUnidad: false,
    selecteCantidad: false,
    selectedPrecio: false,
    selectedValorFecha: false,
    selectedValorUf: false
  });

  useEffect(() => {
    if (!bsModalRef.current) {
      bsModalRef.current = new Modal(modalRef.current, {
        backdrop: "static",
        keyboard: false,
      });
      // Escucha cuando la modal termina de ocultarse
      modalRef.current.addEventListener("hidden.bs.modal", () => {
        onClose(); // llama para desmontar React después
      });
    }

    if (show) {
      bsModalRef.current.show();

      if (storedUser?.country_id) {
        findActiveByCountry(storedUser.country_id)
          .then((data) => setServices(data))
          .catch((error) => console.error("Error al cargar servicios:", error));
      }

      if (selectedId) {
      getDataSegundoNivelId(selectedId)
        .then((data) => {
          setCuenta(data.cuenta || "");
          setNroDocumento(data.nro_documento || "");
          setFecha(data.fecha || "");
          setIdPriNivel(data.id_primer_nivel);
        })
        .catch((error) =>
          console.error("Error al cargar datos del segundo nivel:", error)
        );
      }
    } else {
      bsModalRef.current.hide();
    }
  }, [show, onClose]);

  const handleSelectChange = (e) => {
    const id = e.target.value;
    const text = e.target.options[e.target.selectedIndex].text; 
    setSelectedService(id);
    setSelectedServiceName(text);
  };

  const handleSelectUnidad = async (e) => {
    const value = e.target.value;
    setSelectedUnidad(value);

    if (value === "UF") {
      try {
        const data = await getValoresEconomicos();
        setValoresEconomicos(data);
      } catch (error) {
        console.error("Error al cargar valores económicos:", error);
      }
    } else {
      setValoresEconomicos([]);
      setSelectedValorFecha("");
      setSelectedValorUf("");
    }
  };

  // Función de validación y envío
  const handleEnviar = async () => {
    const newErrors = {
      selectedService: selectedService === "",
      selectedUnidad: !(selectedUnidad === "$" || selectedUnidad === "UF"),
      selecteCantidad: selecteCantidad === "",
      selectedPrecio: selectedPrecio === "",
      selectedValorFecha: selectedUnidad === "UF" && selectedValorFecha === "",
      selectedValorUf: selectedUnidad === "UF" && selectedValorUf === ""

    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) {
      console.log("Campos incompletos");
      return;
    }

    // Formulario válido, aquí puedes enviar los datos
    const newItem = {
      cuenta: cuenta,
      id_servicio: parseInt(selectedService, 10),
      servicio: selectedServiceName,
      cantidad: parseInt(selecteCantidad, 10),
      precio: selectedPrecio.toString(),
      total:
        selectedUnidad === "UF"
          ? Math.round(selecteCantidad * selectedPrecio * selectedValorUf)
          : Math.round(selecteCantidad * selectedPrecio),
      nro_documento: nroDocumento,
      fecha: fecha,
      tipo: "Con Plan",
      unidad: selectedUnidad,
      fecha_uf: selectedUnidad === "UF" ? selectedValorFecha : null,
      valor_uf: selectedUnidad === "UF" ? selectedValorUf.toString() : null,
      id_primer_nivel: idPriNivel,
      id_segundo_nivel: selectedId,
      tiene_doc: 0,
      tipo_modal: "Prefactura",
      etiqueta: "agregado"
    };
    console.log('newItem: ', newItem)
    try {
      await createDataTercerNivel(newItem);
      const totalResponse = await actualizarTotales(idPriNivel);
      if (onSubmit) {
        onSubmit({
          success: true,
          totalFacturado: totalResponse.totalFacturado,
          totalPendiente: totalResponse.totalPendiente,
        });
      }

      if (bsModalRef.current) {
        bsModalRef.current.hide();
      }
    } catch (error) {
      console.error("Error al crear el tercer nivel:", error);
      if (onSubmit) onSubmit({ success: false });
    }
  };

  return (
    <div className="modal fade" tabIndex="-1" ref={modalRef} aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="mb-3 p-2 border rounded bg-light">
              <h6 className="fw-bold mb-1">Cuenta: {cuenta}</h6>
              <p className="mb-0"><strong>N° Documento:</strong> {nroDocumento}</p>
              <p className="mb-0"><strong>Fecha:</strong> {fecha}</p>
            </div>
            <label htmlFor="serviceSelect" className="form-label">Servicio</label>
            <select
              id="serviceSelect"
              className={`form-select ${errors.selectedService ? "is-invalid" : ""}`}
              value={selectedService}
              onChange={handleSelectChange}
            >
              <option value="">-- Seleccione --</option>
              {services.map((srv) => (
                <option key={srv.ser_id} value={srv.ser_id}>{srv.ser_servicio}</option>
              ))}
            </select>

            <label htmlFor="unidadSelect" className="mt-2 form-label">Unidad:</label>
            <select
              id="unidadSelect"
              className={`form-select ${errors.selectedUnidad ? "is-invalid" : ""}`}
              value={selectedUnidad}
              onChange={handleSelectUnidad}
            >
              <option value="$">$</option>
              <option value="UF">UF</option>
            </select>

            {selectedUnidad === "UF" && (
              <>
                <label htmlFor="valorFecha" className="mt-2 form-label">Fecha UF</label>
                <select
                  id="valorFecha"
                  className={`form-select ${errors.selectedValorFecha ? "is-invalid" : ""}`}
                  value={selectedValorFecha}
                  onChange={(e) => {
                    const fechaSeleccionada = e.target.value;
                    setSelectedValorFecha(fechaSeleccionada);
                    const valor = valoresEconomicos.find(v => v.fecha === fechaSeleccionada);
                    if (valor) setSelectedValorUf(valor.uf);
                    else setSelectedValorUf("");
                  }}
                >
                  <option value="">-- Seleccione fecha --</option>
                  {valoresEconomicos.map((val) => (
                    <option key={val.id_valor} value={val.fecha}>
                      {new Date(val.fecha).toLocaleDateString()} — UF {val.uf}
                    </option>
                  ))}
                </select>

                <label htmlFor="valorUf" className="mt-2 form-label">Valor UF</label>
                <input
                  type="text"
                  id="valorUf"
                  className="form-control"
                  value={selectedValorUf}
                  readOnly
                />
              </>
            )}

            <label htmlFor="cantidad" className="mt-2 form-label">Cantidad</label>
            <input
              type="text"
              id="cantidad"
              className={`form-control ${errors.selecteCantidad ? "is-invalid" : ""}`}
              value={selecteCantidad}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) setSelectedCantidad(value);
              }}
              inputMode="numeric"
              pattern="[0-9]*"
            />

            <label htmlFor="precio" className="mt-2 form-label">Precio</label>
            <input
              type="text"
              id="precio"
              className={`form-control ${errors.selectedPrecio ? "is-invalid" : ""}`}
              value={selectedPrecio}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d{0,2}$/.test(value)) setSelectedPrecio(value);
              }}
              inputMode="decimal"
              pattern="^\d*\.?\d{0,2}$"
            />
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
            <button className="btn btn-primary" onClick={handleEnviar}>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
