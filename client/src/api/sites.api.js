import axiosInstance from './axiosInstance';

const getSites = async ({ page = 1, limit = 10, search = '', status = '' }) => {
    const params = { page, limit };
    if (search) params.search = search;
    if (status) params.status = status;

    const response = await axiosInstance.get('/sites', { params });
    return {
        data: response.data.data,
        pagination: response.data.pagination,
    };
};

const getAllSites = async () => {
    const response = await axiosInstance.get('/sites', {
      params: { page: 1, limit: 100, status: 'active' },
    });
    return response.data.data || [];
  };

const createSite = async (payload) => {
    const response = await axiosInstance.post('/sites', payload);
    return response.data.data;
};

const updateSite = async (id, payload) => {
    const response = await axiosInstance.put(`/sites/${id}`, payload);
    return response.data.data;
};

const deleteSite = async (id) => {
    const response = await axiosInstance.delete(`/sites/${id}`);
    return response.data;
};

export default {
    getSites,
    getAllSites,
    createSite,
    updateSite,
    deleteSite,
};
