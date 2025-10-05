import React, { useEffect, useRef } from "react";
import { Modal } from "bootstrap";

export default function ItemModal({ show, onClose, title, children, selectedId }) {
  const modalRef = useRef(null);
  const bsModalRef = useRef(null); // <-- guardar la instancia de Bootstrap Modal

  useEffect(() => {
    // Crear instancia solo una vez
    if (!bsModalRef.current) {
      bsModalRef.current = new Modal(modalRef.current, {
        backdrop: "static",
        keyboard: false,
      });
    }
    console.log('selectedId: ', selectedId)
    // Mostrar u ocultar según prop `show`
    if (show) {
      bsModalRef.current.show();
    } else {
      bsModalRef.current.hide();
    }
  }, [show]);

  return (
    <div
      className="modal fade"
      tabIndex="-1"
      ref={modalRef}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
