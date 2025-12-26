import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { blue } from '@mui/material/colors';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/contexts/AuthContext';
import { checkSSOSession } from 'src/services/authService';

import { OPTIONS } from '../options';
import { CardPortal } from '../card-portal';
import { PortalContainer } from '../portal-container';

// ----------------------------------------------------------------------

// Cấu hình các web app con
const APP_CONFIGS = {
  admission: {
    url: 'https://tuyensinh.hcmue.edu.vn/',
    name: 'Thông tin tuyển sinh',
    requiresAuth: false
  },
  hsca_info: {
    url: 'https://dgnl.hcmue.edu.vn/',
    name: 'KỲ THI ĐÁNH GIÁ NĂNG LỰC CHUYÊN BIỆT',
    requiresAuth: false
  },
  account: {
    url: 'http://localhost:3039/sign-up',
    name: 'ĐĂNG KÝ TÀI KHOẢN',
    requiresAuth: false
  },
  hsca: {
    url: 'http://localhost:3039/profile',
    name: 'ĐĂNG KÝ DỰ THI ĐGNL CHUYÊN BIỆT',
    requiresAuth: true
  },
};

export function PortalView() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{ key: string; label: string } | null>(null);
  const [ssoReady, setSsoReady] = useState(false);

  // Kiểm tra SSO session khi component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await checkSSOSession();
        setSsoReady(!!session?.valid);
      } catch (error) {
        setSsoReady(false);
      }
    };
    
    checkSession();
  }, []);

  const handleOpen = (option: { key: string; label: string }) => {
    setSelectedOption(option);
    
    // Kiểm tra nếu option yêu cầu auth nhưng chưa đăng nhập
    const appConfig = APP_CONFIGS[option.key as keyof typeof APP_CONFIGS];
    
    if (appConfig?.requiresAuth && !isAuthenticated && !ssoReady) {
      setOpen(true);
    } else {
      // Đã đăng nhập hoặc không yêu cầu auth
      handleNavigate(option);
    }
  };

  const handleClose = () => {
    setOpen(false); 
  };

  const handleLoginRedirect = () => {
    handleClose();
    router.push('/sign-in');
  };

  const handleNavigate = async (option: { key: string; label: string }) => {
    const appConfig = APP_CONFIGS[option.key as keyof typeof APP_CONFIGS];
    
    if (!appConfig) {
      console.error(`No config found for ${option.key}`);
      return;
    }

    if (appConfig.requiresAuth && (isAuthenticated || ssoReady)) {
      // Tạo URL với SSO token
      const ssoToken = localStorage.getItem('ssoToken');
      const deviceId = localStorage.getItem('deviceId');
      
      let targetUrl = appConfig.url;
      
      if (ssoToken && deviceId) {
        // Thêm SSO token vào URL hoặc dùng postMessage
        targetUrl += `?ssoToken=${encodeURIComponent(ssoToken)}&deviceId=${encodeURIComponent(deviceId)}`;
      }
      
      // Mở trong tab mới (hoặc popup) và gửi postMessage nếu có token
      const popup = window.open(targetUrl, '_blank');
      if (popup && ssoToken && deviceId) {
        try {
          popup.postMessage({ type: 'SSO_UPDATE', ssoToken, deviceId }, '*');
        } catch (e) {
          // Try again after short delay (popup may not be ready)
          setTimeout(() => {
            try { popup.postMessage({ type: 'SSO_UPDATE', ssoToken, deviceId }, '*'); } catch (err) {
              console.warn('Failed to send SSO message to popup:', err);
            }
          }, 500);
        }
      }
      
      // Hoặc mở trong iframe/popup
      // openAppInPopup(targetUrl, appConfig.name);
      
    } else if (!appConfig.requiresAuth) {
      // Mở app không yêu cầu auth
      window.open(appConfig.url, '_blank');
    }
  };

  // Hàm mở app trong popup (tùy chọn)
  const openAppInPopup = (url: string, title: string) => {
    const width = 1200;
    const height = 800;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    const popup = window.open(
      url,
      title,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
    
    if (popup) {
      popup.focus();
    }
  };

  return (
    <PortalContainer>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ flexGrow: 1, fontSize: 20, fontWeight: 500 }}>
          Cổng thông tin trường Đại học Sư phạm Thành phố Hồ Chí Minh
        </Box>
        {isAuthenticated && (
          <Box sx={{ color: 'text.secondary' }}>
            Xin chào, {user?.fullname}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: 'grid',
          rowGap: 3,
          columnGap: 3.5,
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        {OPTIONS.map((option) => (
          <Box
            key={option.key}
            sx={{
              cursor: 'pointer',
              boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: 2,
              boxSizing: 'border-box',
              bgcolor: 'background.paper',
              border: '2px solid transparent',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-8px)',
                border: '2px solid #2196f3',
                boxShadow: 6,
              },
            }}
            onClick={() => handleOpen(option)}
          >
            <CardPortal
              icon={<img src={option.image} alt={option.label} />}
              title={option.label}
              topIcon={option.topIcon}
              disabled={APP_CONFIGS[option.key as keyof typeof APP_CONFIGS]?.requiresAuth && !isAuthenticated && !ssoReady}
            />
          </Box>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedOption?.label || 'Thông báo'}
        </DialogTitle>
        <DialogContent>
          {selectedOption?.key === 'admission'
            ? 'Đây là nội dung chi tiết về thông tin tuyển sinh.'
            : 'Bạn cần đăng nhập để sử dụng chức năng này.'}
        </DialogContent>
        {selectedOption?.key !== 'admission' && (
          <DialogActions>
            <Button variant="contained" onClick={handleLoginRedirect}>
              Đăng nhập
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </PortalContainer>
  );
}