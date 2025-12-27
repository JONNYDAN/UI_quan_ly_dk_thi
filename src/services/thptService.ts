import api from './api';

// Types
export interface THPT {
  id: number;
  code: string;
  name: string;
  provinceCode?: string;
  districtCode?: string;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  [key: string]: any;
}

// Service functions
export const getTHPTsByProvinceAndDistrict = async (
  provinceCode: string, 
  districtCode: string
): Promise<ApiResponse<THPT[]>> => {
  try {
    const response = await api.get(`/thpts/provinces/${provinceCode}/districts/${districtCode}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get THPTs by province and district failed';
  }
};

export const getTHPTsByDistrict = async (
  districtCode: string
): Promise<ApiResponse<THPT[]>> => {
  try {
    const response = await api.get(`/thpts/districts/${districtCode}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get THPTs by district failed';
  }
};

export const getTHPTsByProvince = async (
  provinceCode: string
): Promise<ApiResponse<THPT[]>> => {
  try {
    const response = await api.get(`/thpts/provinces/${provinceCode}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get THPTs by province failed';
  }
};

// Default export
const thptService = {
  getTHPTsByProvinceAndDistrict,
  getTHPTsByDistrict,
  getTHPTsByProvince,
};

export default thptService;