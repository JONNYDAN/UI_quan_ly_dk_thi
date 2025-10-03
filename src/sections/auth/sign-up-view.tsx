import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { register } from '../../services/authService';

export function SignUpView() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  // State cho form
  const [formData, setFormData] = useState({
    cccd: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const result = await register(formData);
      console.log("Đăng ký thành công", result);
      router.push('/'); // hoặc chuyển hướng sang trang đăng nhập
    } catch (err) {
      console.error("Lỗi đăng ký", err);
    }
  };

  const renderForm = (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}>
      <TextField
        fullWidth
        name="cccd"
        label="CCCD/CMND"
        value={formData.cccd}
        onChange={handleChange}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        name="email"
        label="Địa chỉ Email"
        value={formData.email}
        onChange={handleChange}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        name="phone"
        label="Số điện thoại"
        value={formData.phone}
        onChange={handleChange}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name="password"
        label="Mật khẩu"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        sx={{ mb: 3 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        fullWidth
        name="password_confirmation"
        label="Xác nhận mật khẩu"
        type="password"
        value={formData.password_confirmation}
        onChange={handleChange}
        sx={{ mb: 3 }}
      />

      <Button
        fullWidth
        size="large"
        type="button"
        color="inherit"
        variant="contained"
        onClick={handleSubmit}
      >
        Đăng ký
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">Đăng ký</Typography>
      </Box>
      {renderForm}
      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          HCMUE
        </Typography>
      </Divider>
      <Box sx={{ gap: 1, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Bạn đã có tài khoản?
          <Link variant="subtitle2" sx={{ ml: 0.5 }} href="/sign-in">
            Tiến hành thôi !
          </Link>
        </Typography>
      </Box>
    </>
  );
}
