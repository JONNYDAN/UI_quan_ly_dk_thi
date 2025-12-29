import api from './api';

const SERVICE_CODE = import.meta.env.VITE_APP_SERVICE || 'DGNL';

export interface OrderParams {
  code: string;
}

export interface OrderCreateParams {
  examId?: number;
  [key: string]: any;
}

export interface CancelOrderParams {
  orderCode: string;
}

export interface OrderSearchParams {
  codeOrder?: string;
  page?: number;
  pageSize?: number;
}

export const getNewOrderCode = async (data: { examId: number }) => {
  try {
    const response = await api.get(`/order/code/${SERVICE_CODE}/${data.examId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get new order code failed';
  }
};

export const getOrderDetails = async (data: { code: string }) => {
  try {
    const response = await api.get(`/order/details/${data.code}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get order details failed';
  }
};

export const getOrderReDetails = async (data: { code: string }) => {
  try {
    const response = await api.get(`/order/redetails/${data.code}`);
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
    throw error.response?.data?.message || error.message || 'Create order failed';
  }
};

export const postOrderReDetails = async (data: any) => {
  try {
    const response = await api.post('/order/redetails', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Create re-order failed';
  }
};

export const putCancelOrder = async (data: { orderCode: string }) => {
  try {
    const response = await api.put('/order/cancel', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Cancel order failed';
  }
};

export const putCancelReOrder = async (data: { orderCode: string }) => {
  try {
    const response = await api.put('/order/re-cancel', data);
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
    throw error.response?.data?.message || error.message || 'Create re-exam order failed';
  }
};

export const putCancelReExamOrder = async (data: { orderCode: string }) => {
  try {
    const response = await api.put('/order/cancel-re-exam', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Cancel re-exam order failed';
  }
};

export const getOrderPayDetail = async (page: number = 1, pageSize: number = 10) => {
  try {
    const response = await api.get(`/order/paydetails/${pageSize}/${page}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Get order pay details failed';
  }
};

export const searchOrderByCode = async (codeOrder: string) => {
  try {
    const response = await api.get(`/order/paydetails/${codeOrder}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Search order by code failed';
  }
};

export const updateOrderStatus = async (id: number, status: string) => {
  try {
    const response = await api.put(`/order/${id}/status/${status}`, { status });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Update order status failed';
  }
};

const orderService = {
  getNewOrderCode,
  getOrderDetails,
  getOrderReDetails,
  postOrderDetails,
  postOrderReDetails,
  putCancelOrder,
  putCancelReOrder,
  postReExamOrder,
  putCancelReExamOrder,
  getOrderPayDetail,
  searchOrderByCode,
  updateOrderStatus,
};

export default orderService;