import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import UserTable from "../../components/Users/UserTable";
import { listUsers } from "../../services/UsersService";
import { toast } from "react-toastify";

export default function ListPage() {
  const [users, setUsers] = useState([]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: listUsers,
  });

  // Guardar data en estado local
  useEffect(() => {
    if (data) setUsers(data);

    // Mostrar toast si no hay usuarios después de cargar
    if (!isLoading && data && data.length === 0) {
      toast.error("No hay usuarios para mostrar");
    }
  }, [data, isLoading]);

  // Toast si hay error
  useEffect(() => {
    if (isError) {
      toast.error(`Error al obtener usuarios: ${error.message}`);
    }
  }, [isError, error]);

  if (isLoading) {
    return <p>Cargando usuarios...</p>;
  }

  return (
    <div className="container mt-4">
      <h2 className="h5 mb-3">Lista de usuarios</h2>
      <UserTable users={users} setUsers={setUsers} />
    </div>
  );
}
