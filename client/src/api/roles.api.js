import axiosInstance from './axiosInstance';

const getRoles = async ({ page = 1, limit = 10, search = '' }) => {
  const params = { page, limit };
  if (search) params.search = search;

  const response = await axiosInstance.get('/roles', { params });
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

const getAllRoles = async () => {
  const response = await axiosInstance.get('/roles', {
    params: { page: 1, limit: 100 },
  });
  return response.data.data || [];
};

const createRole = async (payload) => {
  const response = await axiosInstance.post('/roles', payload);
  return response.data.data;
};

const updateRole = async (id, payload) => {
  const response = await axiosInstance.put(`/roles/${id}`, payload);
  return response.data.data;
};

const deleteRole = async (id) => {
  const response = await axiosInstance.delete(`/roles/${id}`);
  return response.data;
};

export default {
  getRoles,
  getAllRoles,
  createRole,
  updateRole,
  deleteRole,
};
