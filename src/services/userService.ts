import api from './api';

// Types
export interface User {
  id?: string | number;
  cccd?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  status?: string;
  [key: string]: any;
}

export interface UserInfo {
  id?: string | number;
  cccd?: string;
  fullname?: string;
  email?: string;
  phone?: string;
  birthday?: string;
  createdAt?: string;
  gender?: number;
  student_id?: string;
  address?: string;
  role?: string;
  status?: string;
  school?: string;
  district?: string;
  province?: string;
  schoolId?: string;
  schooldistrictId?: string;
  schoolprovinceId?: string;
  [key: string]: any;
}

export interface OrderDetail {
  turn: string;
  subject: string;
  date: string;
  time: string;
  orderedAt: string;
  responseTime: string | null;
  status: 'PENDING' | 'SUCCESS' | 'CANCEL' | 'EXPIRED' | 'REFUND';
}

export interface ExamDetails {
  examName: string;
  [key: string]: any;
}

export interface Order {
  orderCode: string;
  examId: string;
  status: string;
  details: OrderDetail[];
  examDetails?: ExamDetails;
  [key: string]: any;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  success?: boolean;
  [key: string]: any;
}

export interface ChangePasswordData {
  currentPassword: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  [key: string]: any;
}

export interface ConfirmKhaoSatData {
  cccdmd5: string;
  cccd: string;
}

// Service functions
export const getPublicContent = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/all');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get public content failed';
  }
};

export const getUserBoard = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/test/user');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get user board failed';
  }
};

export const getModeratorBoard = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/test/mod');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get moderator board failed';
  }
};

export const getAdminBoard = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/test/admin');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get admin board failed';
  }
};

export const getAllUser = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await api.get('/all-users');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get all users failed';
  }
};

export const getUserInfo = async (): Promise<ApiResponse<{
  id: number;
  fullname: string;
  cccd: string;
  birthday: string;
  gender: number;
  email: string;
  phone: string;
  student_id: string | null;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}>> => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get user info failed';
  }
};

export const getUserTurns = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/user/exams');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get user turns failed';
  }
};

export const getUserOrders = async (): Promise<ApiResponse<{ data: Order[] }>> => {
  try {
    const response = await api.get('/user/orders');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get user orders failed';
  }
};

export const getUserReOrders = async (): Promise<ApiResponse> => {
  try {
    const response = await api.get('/user/re-orders');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get user re-orders failed';
  }
};

export const getUserByCCCD = async (cccd: string): Promise<ApiResponse<User>> => {
  try {
    const response = await api.get(`/user/${cccd}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get user by CCCD failed';
  }
};

export const postChangePassword = async (data: ChangePasswordData): Promise<ApiResponse> => {
  try {
    const response = await api.post('/change-password', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Change password failed';
  }
};

export const updateUserInfo = async (data: UpdateUserData): Promise<ApiResponse<User>> => {
  try {
    const response = await api.put('/update-user', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Update user info failed';
  }
};

export const updateUserforAdmin = async (id: string | number, data: UpdateUserData): Promise<ApiResponse<User>> => {
  try {
    const response = await api.put(`/update-user-admin/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Update user for admin failed';
  }
};

export const resetPassword = async (userId: string | number): Promise<ApiResponse> => {
  try {
    const response = await api.put(`/reset-password/${userId}`, {});
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Reset password failed';
  }
};

export const getAvailableSlots = async (): Promise<ApiResponse> => {
  try {
    const response = await api.put('/availableSlot');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get available slots failed';
  }
};

export const getConfirmKhaoSat = async (cccdmd5: string, cccd: string): Promise<ApiResponse> => {
  try {
    const response = await api.post('/confirm-khaosat', { cccdmd5, cccd });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Confirm khaosat failed';
  }
};

// Export as default object (for backward compatibility)
const userService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
  getUserInfo,
  getUserTurns,
  getUserByCCCD,
  postChangePassword,
  getUserOrders,
  getUserReOrders,
  updateUserInfo,
  getAllUser,
  resetPassword,
  updateUserforAdmin,
  getAvailableSlots,
  getConfirmKhaoSat,
};

export default userService;