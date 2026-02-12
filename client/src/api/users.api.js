import axiosInstance from './axiosInstance';

export const getUsers = async ({ page = 1, limit = 10, search = '', status = '' }) => {

    const params = { page, limit };

    console.log('Fetching users with params:', params);

    if (search) params.search = search;
    if (status) params.status = status;

    const response = await axiosInstance.get('/users', { params });
    console.log('Received response:', response.data);

    return {
        data: response.data.data,
        pagination: response.data.pagination,
    };
};

export const createUser = async (payload) => {
    const response = await axiosInstance.post('/users', payload);
    return response.data.data;
};

export const updateUser = async (id, payload) => {
    const response = await axiosInstance.put(`/users/${id}`, payload);
    return response.data.data;
};

export const deactivateUser = async (id) => {
    const response = await axiosInstance.patch(`/users/${id}/deactivate`);
    return response.data;
};


export default {
    getUsers,
    createUser,
    updateUser,
    deactivateUser
};
