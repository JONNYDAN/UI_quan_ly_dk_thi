import api from './api';

export const getPublicContent = async () => {
  try {
    const response = await api.get('/all');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get public content failed';
  }
};

export const getUserBoard = async () => {
  try {
    const response = await api.get('/test/user');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get user board failed';
  }
};

export const getModeratorBoard = async () => {
  try {
    const response = await api.get('/test/mod');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get moderator board failed';
  }
};

export const getAdminBoard = async () => {
  try {
    const response = await api.get('/test/admin');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get admin board failed';
  }
};

export const getAllUser = async () => {
  try {
    const response = await api.get('/all-users');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get all users failed';
  }
};

export const getUserInfo = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get user info failed';
  }
};

export const getUserTurns = async () => {
  try {
    const response = await api.get('/user/exams');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get user turns failed';
  }
};

export const getUserOrders = async () => {
  try {
    const response = await api.get('/user/orders');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get user orders failed';
  }
};

export const getUserReOrders = async () => {
  try {
    const response = await api.get('/user/re-orders');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get user re-orders failed';
  }
};

export const getUserByCCCD = async (cccd: string) => {
  try {
    const response = await api.get(`/user/${cccd}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get user by CCCD failed';
  }
};

export const postChangePassword = async (data: any) => {
  try {
    const response = await api.post('/change-password', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Change password failed';
  }
};

export const updateUserInfo = async (data: any) => {
  try {
    const response = await api.put('/update-user', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Update user info failed';
  }
};

export const updateUserforAdmin = async (id: string|number, data: any) => {
  try {
    const response = await api.put(`/update-user-admin/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Update user for admin failed';
  }
};

export const resetPassword = async (userId: string|number) => {
  try {
    const response = await api.put(`/reset-password/${userId}`, {});
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Reset password failed';
  }
};

export const getAvailableSlots = async () => {
  try {
    const response = await api.put('/availableSlot');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get available slots failed';
  }
};

export const getConfirmKhaoSat = async (cccdmd5: string, cccd: string) => {
  try {
    const response = await api.post('/confirm-khaosat', { cccdmd5, cccd });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Confirm khaosat failed';
  }
};

export default {
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