import axiosInstance from './axiosInstance';

const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data.data;
};

export default {
  login,
};
