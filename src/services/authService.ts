import api from './api';

// Lấy deviceId duy nhất cho mỗi trình duyệt
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
};

// Lưu SSO token vào localStorage
export const saveSSOToken = (ssoToken: string, sessionId: string) => {
  localStorage.setItem('ssoToken', ssoToken);
  localStorage.setItem('sessionId', sessionId);
};

// Lấy SSO token từ localStorage
export const getSSOToken = (): string | null => localStorage.getItem('ssoToken');

// Xóa SSO token (và broadcast logout đến các tab khác)
export const clearSSOToken = () => {
  localStorage.removeItem('ssoToken');
  localStorage.removeItem('sessionId');
  try {
    localStorage.setItem('SSO_BROADCAST', JSON.stringify({ type: 'SSO_LOGOUT', ts: Date.now() }));
    setTimeout(() => {
      try { localStorage.removeItem('SSO_BROADCAST'); } catch (e) { /* ignore */ }
    }, 500);
  } catch (e) {
    /* ignore */
  }
};

// Đồng bộ SSO token với các web app khác
export const syncSSOWithOtherApps = (ssoToken: string, deviceId: string) => {
  // Lưu token vào localStorage để các tab cùng origin có thể nhận 'storage' event
  localStorage.setItem('ssoToken', ssoToken);

  // Broadcast via a dedicated key so storage event always triggers (include timestamp)
  try {
    localStorage.setItem('SSO_BROADCAST', JSON.stringify({ type: 'SSO_UPDATE', ssoToken, deviceId, ts: Date.now() }));
    setTimeout(() => {
      try { localStorage.removeItem('SSO_BROADCAST'); } catch (e) { /* ignore */ }
    }, 500);
  } catch (e) {
    console.warn('SSO broadcast failed:', e);
  }

  // If in iframe or opened from another window, try postMessage as well
  try {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'SSO_UPDATE', ssoToken, deviceId }, '*');
    }
    if ((window as any).opener) {
      (window as any).opener.postMessage({ type: 'SSO_UPDATE', ssoToken, deviceId }, '*');
    }
  } catch (e) {
    console.warn('SSO postMessage failed:', e);
  }
};

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
    const deviceId = getDeviceId();
    const response = await api.post('/auth/login', {
      ...data,
      deviceId
    });
    
    if (response.data.status === 'success') {
      // Lưu SSO token
      if (response.data.sso) {
        saveSSOToken(response.data.sso.ssoToken, response.data.sso.sessionId);
        syncSSOWithOtherApps(response.data.sso.ssoToken, deviceId);
      }
    }
    
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Đăng nhập thất bại';
  }
};

export const ssoValidate = async (ssoToken: string) => {
  try {
    const deviceId = getDeviceId();
    const response = await api.post('/auth/sso/validate', {
      ssoToken,
      deviceId
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'SSO validation failed';
  }
};

export const checkSSOSession = async () => {
  try {
    const ssoToken = getSSOToken();
    if (!ssoToken) return null;
    
    const deviceId = getDeviceId();
    const response = await api.post('/auth/sso/check', {
      ssoToken,
      deviceId
    });
    return response.data;
  } catch (error: any) {
    return null;
  }
};

export const logout = async () => {
  try {
    // Gọi API logout SSO
    const sessionId = localStorage.getItem('sessionId');
    const ssoToken = getSSOToken();
    const deviceId = getDeviceId();

    // Prefer sending sessionId (server expects sessionId), fallback to ssoToken/deviceId
    if (sessionId) {
      await api.post('/auth/sso/logout', {
        sessionId,
        logoutAll: false
      });
    } else if (ssoToken) {
      await api.post('/auth/sso/logout', {
        ssoToken,
        deviceId,
        logoutAll: false
      });
    }

    // Gọi API logout cơ bản (giữ accessToken trong localStorage để middleware có thể xác thực)
    const response = await api.post('/auth/logout');

    // Xóa local storage sau khi logout server thành công
    clearSSOToken();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');

    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Đăng xuất thất bại';
  }
};

export const verifyCCCD = async (imageBase64: string) => {
  try {
    const response = await api.post('/auth/verify-cccd', {
      image_base64: imageBase64
    }, { timeout: 60000, maxContentLength: Infinity, maxBodyLength: Infinity });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message || 'Xác thực CCCD thất bại';
  }
};