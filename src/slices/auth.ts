import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { setMessage } from "./message";
import { register, loginAPI, logout as logoutService } from "../services/authService";

// Types
interface User {
  id?: number;
  fullname?: string;
  cccd?: string;
  birthday?: string;
  gender?: string;
  phone?: string;
  email?: string;
  acceptTerms?: boolean;
  ethnic?: string;
  district?: string;
  province?: string;
  school?: string;
  schoolId?: string;
  schoolprovince?: string;
  schooldistrict?: string;
}

interface RegisterPayload {
  fullname: string;
  cccd: string;
  birthday: string;
  gender: number;
  phone: string;
  email: string;
  password: string; // Thêm trường password
  acceptTerms: boolean;
  cccd_image?: string; // Thêm trường ảnh CCCD
  ethnic?: string;
  district?: string;
  province?: string;
  school?: string;
  schoolId?: string;
  schoolprovince?: string;
  schooldistrict?: string;
}

interface LoginPayload {
  cccd: string;
  password: string;
  cccd_image?: string; // Thêm trường ảnh CCCD cho login
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

interface AuthResponse {
  user?: User;
  message?: string;
  status?: string;
  data?: any;
}

// Lấy user từ localStorage
const getUserFromStorage = (): User | null => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

const user = getUserFromStorage();

// Async Thunks
export const _register = createAsyncThunk(
  "auth/register",
  async (registerData: RegisterPayload, thunkAPI) => {
    try {
      const response = await register(registerData);
      
      // Lưu user vào localStorage nếu đăng ký thành công
      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      
      thunkAPI.dispatch(setMessage(response.data?.message || "Đăng ký thành công"));
      return response.data;
    } catch (error: any) {
      console.error("Đăng ký thất bại:", error);
      const message = error.message || "Đăng ký thất bại";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const _login = createAsyncThunk(
  "auth/login",
  async ({ cccd, password, cccd_image }: LoginPayload, thunkAPI) => {
    try {
      const data = await loginAPI({ cccd, password, cccd_image });
      
      // Lưu user vào localStorage nếu đăng nhập thành công
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      
      return { user: data.user, data } as AuthResponse;
    } catch (error: any) {
      const message = error.message || "Đăng nhập thất bại";
      thunkAPI.dispatch(setMessage(message));
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const _logout = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await logoutService();
      return { success: true };
    } catch (error: any) {
      console.error("Logout error:", error);
      // Vẫn xóa localStorage ngay cả khi có lỗi
      localStorage.removeItem("user");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Initial State
const initialState: AuthState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

// Create Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("user");
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(_register.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoggedIn = true;
        state.user = action.payload.user || action.payload.data?.user;
      })
      .addCase(_register.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(_login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoggedIn = true;
        state.user = action.payload.user || action.payload.data?.user;
      })
      .addCase(_login.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(_logout.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(_logout.rejected, (state) => {
        // Vẫn đăng xuất ngay cả khi có lỗi
        state.isLoggedIn = false;
        state.user = null;
      });
  },
});

// Export actions và reducer
export const { setUser, clearUser, updateUser } = authSlice.actions;
export default authSlice.reducer;

// Export types
export type { User, AuthState, RegisterPayload, LoginPayload };