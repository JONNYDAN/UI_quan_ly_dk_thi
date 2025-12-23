import api from './api';

export const getDistrictsByProvince = async (provinceCode: string) => {
  try {
    const response = await api.get(`/districts/${provinceCode}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get districts failed';
  }
};

export default {
  getDistrictsByProvince,
};