import api from './api';

export const getAllProvinces = async () => {
  try {
    const response = await api.get('/provinces');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get provinces failed';
  }
};

export default {
  getAllProvinces,
};