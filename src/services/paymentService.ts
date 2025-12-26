import api from './api';

export interface MomoRequestParams {
  orderCode: string;
  totalPrice: number;
  type?: string;
}

export interface MomoReturnParams {
  [key: string]: any; // MoMo sẽ trả về nhiều tham số
}

export interface BankingCheckParams {
  code: string;
}

export const postMomoRequest = async (data: MomoRequestParams) => {
  try {
    const response = await api.post('/payment/momo', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Create MoMo payment request failed';
  }
};

export const postMomoReturn = async (data: MomoReturnParams) => {
  try {
    const response = await api.post('/payment/momo/return', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Process MoMo return failed';
  }
};

export const getBankingPaymentByCode = async (data: BankingCheckParams) => {
  try {
    const response = await api.get(`/payment/banking/check/${data.code}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Check banking payment failed';
  }
};

const paymentService = {
  postMomoRequest,
  postMomoReturn,
  getBankingPaymentByCode,
};

export default paymentService;