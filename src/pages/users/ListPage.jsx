import React, { useState } from "react";
import UserTable from "../../components/Users/UserTable";

export default function ListPage() {
  // Arreglo de ejemplo
  const initialUsers = [
    {
      user_id: 1,
      image: null,
      user_name: "Hector Vera",
      country_id: 1,
      email: "hector@example.com",
      activo: 1,
      roles: [{ role: { description: "Admin" } }],
    },
    {
      user_id: 2,
      image: null,
      user_name: "Maria Perez",
      country_id: 2,
      email: "maria@example.com",
      activo: 0,
      roles: [{ role: { description: "User" } }],
    },
  ];

  console.log('initialUsers: ', initialUsers)
  // Estado local para manejar cambios
  const [users, setUsers] = useState(initialUsers);

  return (
    <div className="container mt-4">
      <h2 className="h5 mb-3">Lista de usuarios (ejemplo)</h2>

      {/* UserTable recibe users y setUsers */}
      <UserTable users={users} setUsers={setUsers} />
    </div>
  );
}
