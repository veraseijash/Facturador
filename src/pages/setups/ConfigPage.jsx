import { Outlet } from "react-router-dom";

export default function ConfigPage() {
  return (
    <div>
      <h2 className="h5">Configuración</h2>
      <p>Esta es la página de configuración.</p>

      {/* Aquí aparecerán las subrutas como /config/usuarios */}
      <Outlet />
    </div>
  );
}
