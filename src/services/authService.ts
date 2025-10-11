import axios from 'axios';

const API_URL = 'http://127.0.0.1:8003/api';

export const register = async (data: {
  cccd: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const loginAPI = async (data: { email: string; password: string }) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const logout = async () => {
    try {
        const response = await axios.post(`${API_URL}/auth/logout`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};


// Thêm các hàm login, logout nếu cần ở đây