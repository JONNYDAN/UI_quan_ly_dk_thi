import api from './api';

// Types
export interface District {
  id: number;
  code: string;
  name: string;
  provinceCode?: string;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  [key: string]: any;
}

// Service functions
export const getDistrictsByProvince = async (
  provinceCode: string
): Promise<ApiResponse<District[]>> => {
  try {
    const response = await api.get(`/districts/${provinceCode}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get districts failed';
  }
};

const districtService = {
  getDistrictsByProvince,
};

export default districtService;