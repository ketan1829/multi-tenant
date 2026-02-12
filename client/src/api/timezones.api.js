import axiosInstance from './axiosInstance';

const getTimezones = async () => {
  const response = await axiosInstance.get('/timezones');
  return response.data.data || [];
};

export default {
  getTimezones,
};
