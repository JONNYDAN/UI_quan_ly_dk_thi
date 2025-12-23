import api from './api';

const SERVICE_CODE = 'DGNL';

export const getNewOrderCode = async (examId: number) => {
  try {
    const response = await api.get(`/order/code/${SERVICE_CODE}/${examId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get order code failed';
  }
};

export const getOrderDetails = async (code: string) => {
  try {
    const response = await api.get(`/order/details/${code}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get order details failed';
  }
};

export const getOrderReDetails = async (code: string) => {
  try {
    const response = await api.get(`/order/redetails/${code}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get re-order details failed';
  }
};

export const postOrderDetails = async (data: any) => {
  try {
    const response = await api.post('/order/details', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Post order details failed';
  }
};

export const postOrderReDetails = async (data: any) => {
  try {
    const response = await api.post('/order/redetails', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Post re-order details failed';
  }
};

export const putCancelOrder = async (payload: any) => {
  try {
    const response = await api.put('/order/cancel', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Cancel order failed';
  }
};

export const putCancelReOrder = async (payload: any) => {
  try {
    const response = await api.put('/order/re-cancel', payload);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Cancel re-order failed';
  }
};

export const postReExamOrder = async (data: any) => {
  try {
    const response = await api.post('/order/re-exam', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Post re-exam order failed';
  }
};

export const putCancelReExamOrder = async (data: any) => {
  try {
    const response = await api.put('/order/cancel-re-exam', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Cancel re-exam order failed';
  }
};

export const getOrderPayDetail = async (page: number, pageSize: number) => {
  try {
    const response = await api.get(`/order/paydetails/${pageSize}/${page}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get pay details failed';
  }
};

export const searchOrderByCode = async (codeOrder: string) => {
  try {
    const response = await api.get(`/order/paydetails/${codeOrder}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Search order failed';
  }
};

export const updateOrderStatus = async (id: string|number, status: string) => {
  try {
    const response = await api.put(`/order/${id}/status/${status}`, { status });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Update order status failed';
  }
};

export default {
  getNewOrderCode,
  getOrderDetails,
  postOrderDetails,
  putCancelOrder,
  putCancelReOrder,
  postReExamOrder,
  putCancelReExamOrder,
  getOrderPayDetail,
  updateOrderStatus,
  getOrderReDetails,
  postOrderReDetails,
  searchOrderByCode,
};