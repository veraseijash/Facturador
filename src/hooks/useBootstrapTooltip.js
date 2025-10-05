import { useEffect } from "react";
import { Tooltip } from "bootstrap";

export function useBootstrapTooltip(deps) {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    const tooltips = [...tooltipTriggerList].map(
      (el) => new Tooltip(el)
    );
    return () => {
      tooltips.forEach((t) => t.dispose()); // limpiar tooltips al desmontar
    };
  }, deps); // deps ahora sí puede ser un array literal en el uso
}