import React, { useState, useEffect } from "react";
import { listUsers, updateUser } from "../../services/usersService";
import ChileFlag from '../../assets/img/flags/chile.png';
import PeruFlag from '../../assets/img/flags/peru.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { basePath } from '../../config';

export default function ListPage() {
    const [users, setUsers] = useState([]);  // Estado para almacenar los usuarios
    const [loading, setLoading] = useState(true); // Para mostrar "cargando"
    const [error] = useState(null);

    const getFlag = (country_id) => {
        switch(country_id) {
            case 1:
            return ChileFlag;
            case 2:
            return PeruFlag;
            default:
            return ""; // o una bandera genérica
        }
    };
    
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await listUsers();
            console.log('data: ', data)
            setUsers(data);  // Guardamos la data en el estado
        } catch (err) {
            console.error(err);
            toast.error("Error al cargar los usuarios");
        } finally {
            setLoading(false);
        }
    };
    // useEffect para que se ejecute al montar el componente
    useEffect(() => {
        fetchUsers();
    }, []);
    
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Lista de Usuarios</h2>

            {loading && <p>Cargando usuarios...</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && (
            <table className="table table-striped .inter-regular">
                <thead>
                <tr>
                    <th></th>
                    <th className="text-center">ID</th>
                    <th>Nombre</th>
                    <th>País</th>
                    <th>Email</th>
                    <th className="text-center">Activo</th>
                    <th>Roles</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {users.length === 0 ? (
                    <tr>
                    <td colSpan="4" className="text-center">No hay usuarios</td>
                    </tr>
                ) : (
                    users.map(user => (
                    <tr key={user.user_id}>
                        <td>
                            <img 
                                className="rounded-circle border"
                                alt="User"
                                style={{ width: "30px", height: "30px" }}
                                src={
                                    user?.image
                                        ? `${basePath}/public/${user.image}`
                                        : `${basePath}/public/user.svg`
                                }
                                />
                        </td>
                        <td className="text-center">{user.user_id}</td>
                        <td>{user.user_name}</td>
                        <td>
                            {user.country_id ? (
                                <img 
                                    src={getFlag(user.country_id)}
                                    alt="Bandera" 
                                    style={{ width: "30px", height: "20px" }} 
                                    />
                            ) : (
                                "-"
                            )}
                        </td>
                        <td>{user.emcorreoail}</td>
                        <td className="text-center d-flex justify-content-center align-items-center">
                            <div className="form-check form-switch" style={{ marginTop: "5px"}}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`switch-${user.id}`}
                                    checked={user.activo === 1}
                                    onChange={async (e) => {
                                        const nuevoActivo = e.target.checked ? 1 : 0;
                                        try {
                                            await updateUser(user.user_id, { activo: nuevoActivo }, localStorage.getItem('token'));

                                        // actualizar estado local si lo tienes
                                        setUsers((prev) =>
                                            prev.map((u) =>
                                            u.user_id === user.user_id ? { ...u, activo: nuevoActivo } : u
                                            )
                                        );
                                        } catch (err) {
                                            console.error(err);
                                            toast.error("Error al tratar de cambiar Activo");
                                        }
                                    }}
                                />
                            </div>
                        </td>
                        <td>
                            {user.roles && user.roles.length > 0
                                ? user.roles.map(r => r.role.description).join(", ")
                                : "-"}
                        </td>
                        <td>
                            <button type="button" 
                                className="btn btn-outline-primary btn-sm rounded-circle"
                                data-bs-toggle="modal" 
                                data-bs-target="#editModal"
                            >
                                <i className="bi bi-pencil"></i>
                            </button>
                        </td>
                    </tr>
                    ))
                )}
                </tbody>
            </table>
            )}            
            <div 
                className="modal fade" 
                id="editModal" 
                tabindex="-1" 
                aria-labelledby="editModalFull" 
                style={{ display: "none" }} 
                aria-hidden="true"
            >
                <div className="modal-dialog modal-fullscreen">
                    <div className="modal-content"></div>
                </div>
            </div>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}