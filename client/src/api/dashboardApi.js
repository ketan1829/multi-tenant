import axiosInstance from './axiosInstance';

const getOverview = async () => {
  const response = await axiosInstance.get('/dashboard');
  return response.data.data;
};

export default {
  getOverview,
};
