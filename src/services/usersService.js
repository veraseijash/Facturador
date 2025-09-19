import api from "./api";

export const listUsers = async () => {
  const { data } = await api.get("/users/list");
  return data;
};

export const getUserById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const updateUser = async (userId, userData) => {
  const { data } = await api.patch(`/users/${userId}`, userData);
  return data;
};

export const updateUserRoles = async (roleId, roleData) => {
  const { data } = await api.patch(`/usersRoles/${roleId}`, roleData);
  return data;
};

export const createUserRoles = async (roleData) => {
  const { data } = await api.post(`/usersRoles/insert`, roleData);
  return data;
};

export const deleteUserRoles = async (roleId) => {
  const { data } = await api.delete(`/usersRoles/${roleId}`);
  return data;
};

export const uploadUserImage = async (userId, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const { data } = await api.post(`/users/${userId}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const getListRoles = async () => {
  const { data } = await api.get(`/roles/list-roles`);
  return data;
};
