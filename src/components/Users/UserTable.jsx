// src/components/users/UserTable.jsx
import React from "react";
import { images } from '../../assets/images';
import { basePath } from '../../config';
import { toast } from "react-toastify";
import { updateUser } from "../../services/UsersService";
import { useNavigate } from "react-router-dom";


export default function UserTable({ users, setUsers }) {
    const navigate = useNavigate();

    // Función para cambiar el estado activo
    const handleToggleActivo = async (userId, currentActivo) => {
        console.log('currentActivo: ', currentActivo)
        const newActivo = !currentActivo;
        try {
            // Actualiza en la API
            await updateUser(userId, { activo: newActivo });

            // Actualiza localmente el estado
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.user_id === userId ? { ...user, activo: newActivo } : user
                )
            );

            toast.success("Estado actualizado correctamente");
        } catch (error) {
            console.error("Error actualizando estado:", error);
            toast.error("No se pudo actualizar el estado");
        }        
    };
    const handleEdit = (userId) => {
        navigate(`/config/edit/user/${userId}`);
    };
    return (
        <>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th></th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>País</th>
                        <th className="d-flex justify-content-center">Activo</th>
                        <th></th>
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
                            src={user.image 
                                ? `${basePath}/public/images/${user.image}` 
                                : `${basePath}/public/images/user.svg`} // imagen por defecto
                        />
                        </td>
                        <td>{user.user_name}</td>
                        <td>{user.correo}</td>
                        <td>
                            {user.roles.length > 0 ? (
                                user.roles.map((r) => (
                                <div key={r.user_role_id || r.role_id} className="d-block">
                                    {r.role?.description || "-"}
                                </div>
                                ))
                            ) : (
                                "-"
                            )}
                        </td>
                        <td>
                            <img
                                className="rounded-circle border"
                                alt="User"
                                style={{ width: "30px", height: "30px" }}
                                src={user.country_id === 1
                                    ? `${images.ChileFlag}` 
                                    : `${images.PeruFlag}`}
                            />
                        </td>
                        <td style={{ height: "100%" }}>
                            <div 
                                className="form-check form-switch d-flex justify-content-center align-items-center" 
                            >
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={user.activo}    // true o false
                                    readOnly                 // para que no sea editable si solo quieres mostrar
                                    id={`switch-${user.user_id}`}
                                    onChange={() => handleToggleActivo(user.user_id, user.activo)}
                                />
                            </div>
                        </td>
                        <td>
                            <button 
                                type="button" 
                                className="btn btn-outline-primary btn-sm rounded-circle d-flex justify-content-center align-items-center"
                                onClick={() => handleEdit(user.user_id)}
                            >
                                <i className="bi bi-pen"></i>
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}