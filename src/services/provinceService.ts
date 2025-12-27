import api from './api';

// Types
export interface Province {
  id: number;
  code: string;
  name: string;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  [key: string]: any;
}

// Service functions
export const getAllProvinces = async (): Promise<ApiResponse<Province[]>> => {
  try {
    const response = await api.get('/provinces');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get provinces failed';
  }
};

const provinceService = {
  getAllProvinces,
};

export default provinceService;