import React, { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

export default function ModalComponent({ show, onClose, idPrimerNivel }) {
  const modalRef = useRef(null);
  const modalInstance = useRef(null);

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

  // Mostrar / ocultar según el prop `show`
  useEffect(() => {
    if (!modalInstance.current) return;
    if (show) modalInstance.current.show();
    else modalInstance.current.hide();
  }, [show]);

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
            <p>ID primer nivel recibido: <strong>{idPrimerNivel}</strong></p>
            {/* Aquí podrías hacer una llamada a tu servicio con idPrimerNivel */}
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
