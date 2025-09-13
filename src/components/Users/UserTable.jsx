// src/components/users/UserTable.jsx
import React, { useEffect } from "react";
import { images } from '../../assets/images';
import { basePath } from '../../config';
// import { updateUser } from '../../services/usersService';
import { toast } from "react-toastify";

export default function UserTable({ users, setUsers }) {
    useEffect(() => {
        if (!users || users.length === 0) {
            toast.error("No hay usuarios para mostrar");
        }
    }, [users]);
    return (
        <>
            <table className="table table-striped">
                <thead>
                    <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Activo</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                    <tr key={user.user_id}>
                        <td>
                        <img
                            className="rounded-circle border"
                            alt="User"
                            style={{ width: "30px", height: "30px" }}
                            src={user.image || images.ChileFlag} // imagen por defecto
                        />
                        </td>
                        <td>{user.user_name}</td>
                        <td>{user.email}</td>
                        <td>{user.roles[0]?.role?.description || "-"}</td>
                        <td>{user.activo ? "Sí" : "No"}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}