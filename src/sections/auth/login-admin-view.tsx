import React, { useState } from 'react';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, TextField, IconButton, InputAdornment, Typography } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/contexts/AuthContext';
import { loginAPI } from 'src/services/authService';

export function LoginAdminView() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ cccd: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');

    if (!form.cccd || !form.password) {
      setError('Vui lòng nhập CCCD và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      const result: any = await loginAPI({ cccd: form.cccd, password: form.password });

      const user = result.user;
      const token = result.authorization?.token || result.token || '';

      const roles = user?.roles || [];
      if (Array.isArray(roles) && (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_SUPER_ADMIN'))) {
        // login in context
        login(user, token);
        router.push('/dashboard');
      } else {
        setError('Tài khoản không có quyền truy cập trang quản trị');
      }
    } catch (err: any) {
      setError(err?.toString?.() || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box sx={{ width: 420, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 4 }}>
        <Typography variant="h6" sx={{ textAlign: 'center', color: 'primary.main', mb: 2 }}>
          TRANG ĐĂNG NHẬP DÀNH CHO ADMIN
        </Typography>

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="CCCD"
            name="cccd"
            value={form.cccd}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
            autoComplete="off"
          />

          <TextField
            fullWidth
            label="Mật khẩu"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            variant="outlined"
            sx={{ mb: 2 }}
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Box sx={{ color: 'error.main', mb: 2, fontSize: 14 }}>{error}</Box>
          )}

          <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ py: 1.5 }}>
            Đăng nhập
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default LoginAdminView;
