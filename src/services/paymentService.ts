import api from './api';

export const postMomoRequest = async (data: any) => {
  try {
    const response = await api.post('/payment/momo', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Payment request failed';
  }
};

export const postMomoReturn = async (data: any) => {
  try {
    const response = await api.post('/payment/momo/return', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Payment return failed';
  }
};

export const getBankingPaymentByCode = async (code: string) => {
  try {
    const response = await api.get(`/payment/banking/check/${code}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get banking payment failed';
  }
};

export default {
  postMomoRequest,
  postMomoReturn,
  getBankingPaymentByCode,
};