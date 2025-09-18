import React from "react";
import { useParams } from "react-router-dom";
import { useQuery,  useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserById, getListRoles, updateUser, uploadUserImage, updateUserRoles, createUserRoles, deleteUserRoles } from "../../services/UsersService";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { basePath } from '../../config';

// ... arriba de todo los imports

export default function EditPage() {
  const { id } = useParams(); 
  const queryClient = useQueryClient();

  // Obtener usuario
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id),
    enabled: !!id,
  });

  // Obtener lista de roles disponibles
  const { data: rolesList } = useQuery({
    queryKey: ["rolesList"],
    queryFn: getListRoles,
  });

  const [formData, setFormData] = React.useState({
    user_id: null,
    user_name: "",
    correo: "",
    activo: 0,
    roles: [],
  });

  const [selectedImage, setSelectedImage] = React.useState(null); // archivo seleccionado

  // Hooks de mutation
  const uploadImageMutation = useMutation({
    mutationFn: ({ userId, imageFile }) => uploadUserImage(userId, imageFile),
    onSuccess: () => {
      toast.success("Imagen actualizada correctamente");
      queryClient.invalidateQueries(["user", id]);
    },
    onError: () => toast.error("❌ Error al subir imagen"),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }) => updateUser(userId, userData),
    onSuccess: () => {
      toast.success("Usuario actualizado correctamente");
      queryClient.invalidateQueries(["user", id]);
    },
    onError: () => toast.error("Error al actualizar usuario"),
  });

  // Llenar formData cuando llega el usuario
  React.useEffect(() => {
    if (user) {
      setFormData({
        user_id: user.user_id || null,
        user_name: user.user_name || "",
        correo: user.correo || "",
        roles: user.roles || [],
        activo: user.activo || 0,
      });
    }
  }, [user]);

  // Llenar formData cuando llega el usuario
  React.useEffect(() => {
    if (user) {
      setFormData({
        user_id: user.user_id || null,  // 👈 importante
        user_name: user.user_name || "",
        correo: user.correo || "",
        roles: user.roles || [],
        activo: user.activo || 0,
      });
    }
  }, [user]);
  
// Manejar cambio de inputs
  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });
  const handleRoleChange = (index, newRoleId) => {
    const newRoles = [...formData.roles];
    newRoles[index] = {
      ...newRoles[index],
      role_id: newRoleId,
      role: rolesList.find(r => r.role_id === parseInt(newRoleId)) || {},
    };
    setFormData({ ...formData, roles: newRoles });
  };

  const handleDeleteRole = async (index) => {
    const roleToDelete = formData.roles[index];
    
    if (roleToDelete.user_role_id) {
      try {
        await deleteUserRoles(roleToDelete.user_role_id);
        toast.success("Rol eliminado correctamente");
      } catch (err) {
        toast.error("Error al eliminar rol");
        console.error(err);
        return; // salir si falla
      }
    }

    // quitar del estado
    setFormData({
      ...formData,
      roles: formData.roles.filter((_, i) => i !== index),
    });
  };
  // Manejar click en la imagen
  const fileInputRef = React.useRef();
  const handleImageClick = () => fileInputRef.current.click();
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Manejar guardar cambios
  const handleSave = async () => {
  try {
    // 1️⃣ Subir imagen si hay nueva
    if (selectedImage) {
      await uploadImageMutation.mutateAsync({
        userId: formData.user_id,
        imageFile: selectedImage,
      });
    }

    // 2️⃣ Actualizar usuario
    await updateUserMutation.mutateAsync({
      userId: formData.user_id,
      userData: formData,
    });

    // 3️⃣ Manejar roles
    for (const role of formData.roles) {
      if (role.user_role_id) {
        // Rol existente → actualizar
        await updateUserRoles(role.user_role_id, { role_id: role.role_id, user_id: formData.user_id });
      } else if (role.role_id) {
        // Rol nuevo → crear
        await createUserRoles({ role_id: role.role_id, user_id: formData.user_id });
      }
    }

    toast.success("Todos los cambios guardados correctamente");

  } catch (err) {
    console.error(err);
    toast.error("Error al guardar los cambios");
  }
};

  // 👇 recién después puedes hacer returns condicionales
  if (isLoading) return <p>Cargando usuario...</p>;
  if (!user) return <p>No se encontró el usuario.</p>;
  return (
    <div className="container mt-4">
      <h2 className="h5">Editar usuario: {user.user_name}</h2>

      <nav className=" mb-5" aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link className="btn-breadcrumb" to="/config/users">
              Lista de usuarios
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Editar usuario
          </li>
        </ol>
      </nav>

      <div className="d-flex gap-4 align-items-start">
        {/* Imagen y input file oculto */}
        <div style={{ width: "122px", cursor: "pointer" }} onClick={handleImageClick}>
          <img
            className="rounded-circle border shadow"
            alt="User"
            style={{ width: "120px", height: "120px" }}
            src={
              selectedImage
                ? URL.createObjectURL(selectedImage) // mostrar preview
                : user.image
                ? `${basePath}/public/images/${user.image}`
                : `${basePath}/public/images/user.svg`
            }
          />
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        <div style={{ width: "calc(100% - 122px)" }}>
          <div className="row row-cols-1 row-cols-sm-2 gx-4">
            <div className="col">
              <div className="mb-3">
                <label htmlFor="user_name" className="form-label">Nombre de usuario</label>
                <input
                  type="text"
                  className="form-control"
                  id="user_name"
                  value={formData.user_name}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col">
              <div className="mb-3">
                <label htmlFor="correo" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="correo"
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col">
              {/* Lista de roles */}
              <div className="mb-3">
                <label className="form-label">Roles del usuario</label>

                {formData.roles.map((r, index) => (
                  <div 
                    className="input-group mb-3" 
                    key={r.user_role_id ?? `temp-${index}`} // 👈 clave única
                  >
                    <select
                      className="form-select"
                      value={r.role_id || ""}
                      onChange={(e) => handleRoleChange(index, e.target.value)}
                    >
                      <option value="">Seleccione un rol</option>
                      {rolesList?.map((role) => (
                        <option key={role.role_id} value={role.role_id}>
                          {role.description}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => handleDeleteRole(index)}
                    >
                      <i className="bi bi-trash3"></i>
                    </button>
                  </div>
                ))}


                {/* Botón Agregar */}
                <div className="mt-2">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        roles: [
                          ...formData.roles,
                          { user_role_id: null, role_id: "", role: {} }, // nueva fila vacía
                        ],
                      })
                    }
                  >
                    Agregar rol
                  </button>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="form-check form-switch">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="activo" 
                  checked={formData.activo === 1} 
                  onChange={(e) => setFormData({
                    ...formData,
                    activo: e.target.checked ? 1 : 0
                  })}
                />
                <label className="form-check-label" htmlFor="activo">Activo</label>
              </div>
            </div>
          </div>
          <div className="border-top my-3 pt-3 d-flex justify-content-end">
            <button
              className="btn btn-primary"
              disabled={uploadImageMutation.isLoading || updateUserMutation.isLoading}
              onClick={handleSave}
            >
              {uploadImageMutation.isLoading || updateUserMutation.isLoading
                ? "Guardando..."
                : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
