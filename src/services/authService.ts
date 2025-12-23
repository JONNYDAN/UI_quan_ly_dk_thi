import api from './api';

export const register = async (data: {
  fullname: string;
  cccd: string;
  birthday: string;
  gender: number;
  phone: string;
  email: string;
  password: string;
  acceptTerms: boolean;
  cccd_image?: string;
  nationality?: string;
  place_of_origin?: string;
  place_of_residence?: string;
}) => {
  try {
    console.log('Register data:', data);
    
    // Gửi ảnh CCCD riêng nếu có
    if (data.cccd_image) {
      // Tách base64 image để gửi riêng nếu cần
      const imageResponse = await api.post('/auth/verify-cccd', {
        image_base64: data.cccd_image
      });
      
      if (imageResponse.data.status !== 'success') {
        throw new Error('Xác thực CCCD thất bại: ' + imageResponse.data.message);
      }
    }
    
    // Gửi thông tin đăng ký
    const response = await api.post('/auth/register', data);
    return response.data;
  } catch (error: any) {
    console.error('Register error:', error);
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.errors?.join(', ') || 
                        error.message || 
                        'Đăng ký thất bại';
    throw new Error(errorMessage);
  }
};

export const loginAPI = async (data: { 
  cccd_image?: string;
  password: string; 
  cccd?: string;
}) => {
  try {
    const response = await api.post('/auth/login', data);
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Đăng nhập thất bại';
  }
};

export const verifyCCCD = async (imageBase64: string) => {
  try {
    const response = await api.post('/auth/verify-cccd', {
      image_base64: imageBase64
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Xác thực CCCD thất bại';
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Đăng xuất thất bại';
  }
};