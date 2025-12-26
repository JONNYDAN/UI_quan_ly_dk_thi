
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

import { 
  loginAPI, 
  logout, 
  checkSSOSession, 
  ssoValidate,
  getSSOToken,
  syncSSOWithOtherApps,
  getDeviceId
} from '../services/authService';

interface User {
  id: number;
  fullname: string;
  cccd: string;
  birthday: string;
  gender: number;
  email: string;
  phone: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: { cccd: string; password: string }) => Promise<any>;
  loginFromResponse: (result: any) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Kiểm tra session khi load app
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Kiểm tra SSO session trước
        const ssoToken = getSSOToken();
        if (ssoToken) {
          const sessionCheck = await checkSSOSession();
          if (sessionCheck?.valid) {
            // Tự động đăng nhập bằng SSO
            await handleSSOLogin();
          }
        }
      } catch (error) {
        console.error('Auto login failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Lắng nghe message từ app khác (postMessage) và các tab khác (storage event)
    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'SSO_UPDATE') {
        const { ssoToken } = event.data;
        await handleSSOLogin(ssoToken);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'SSO_BROADCAST' && event.newValue) {
        try {
          const data = JSON.parse(event.newValue as string);
          if (data?.type === 'SSO_UPDATE' && data.ssoToken) {
            handleSSOLogin(data.ssoToken);
          }
        } catch (e) { /* ignore */ }
      }
      if (event.key === 'ssoToken' && event.newValue) {
        handleSSOLogin(event.newValue as string);
      }
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleSSOLogin = async (ssoToken?: string) => {
    try {
      const tokenToUse = ssoToken || getSSOToken();
      if (!tokenToUse) return;

      const result = await ssoValidate(tokenToUse);
      if (result.status === 'success') {
        setUser(result.user);
        // Lưu token vào local storage của app này
        localStorage.setItem('accessToken', result.tokens.accessToken);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
    } catch (error) {
      console.error('SSO login failed:', error);
    }
  };

  const login = async (credentials: { cccd: string; password: string }) => {
    setIsLoading(true);
    try {
      const result = await loginAPI(credentials);
      if (result.status === 'success') {
        setUser(result.user);
        // Lưu token vào local storage
        if (result.tokens?.accessToken) {
          localStorage.setItem('accessToken', result.tokens.accessToken);
        }
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        // If backend returned SSO info, sync it
        if (result.sso?.ssoToken) {
          localStorage.setItem('ssoToken', result.sso.ssoToken);
          const deviceId = getDeviceId();
          syncSSOWithOtherApps(result.sso.ssoToken, deviceId);
        }
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  // Allow signing-in flows (e.g. camera OCR) to set auth using a login API response
  const loginFromResponse = (result: any) => {
    if (result?.status === 'success') {
      if (result.tokens?.accessToken) {
        localStorage.setItem('accessToken', result.tokens.accessToken);
      }
      if (result.user) {
        setUser(result.user);
        localStorage.setItem('user', JSON.stringify(result.user));
      }
      if (result.sso?.ssoToken) {
        localStorage.setItem('ssoToken', result.sso.ssoToken);
        const deviceId = getDeviceId();
        syncSSOWithOtherApps(result.sso.ssoToken, deviceId);
      }
    }
  };

  const logoutUser = async () => {
    setIsLoading(true);
    try {
      await logout();
      setUser(null);
      // Xóa local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('ssoToken');
      localStorage.removeItem('sessionId');
      localStorage.removeItem('deviceId');
    } finally {
      setIsLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      const result = await checkSSOSession();
      if (!result?.valid) {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginFromResponse,
        logout: logoutUser,
        checkSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};