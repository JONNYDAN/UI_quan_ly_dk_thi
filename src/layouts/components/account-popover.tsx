import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter, usePathname } from 'src/routes/hooks';

import { useAuth } from 'src/contexts/AuthContext';

// ----------------------------------------------------------------------

export type AccountPopoverProps = IconButtonProps & {
  data?: {
    label: string;
    href: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
  }[];
  user?: {
    fullname?: string;
    email?: string;
    photoURL?: string;
    name?: string; // Thêm field name
    cccd?: string;
    phone?: string;
    roles?: string[];
  } | null;
};

export function AccountPopover({ 
  data = [],
  user, 
  sx, 
  ...other 
}: AccountPopoverProps) {
  const { user: authUser, logout, isAuthenticated } = useAuth(); // Lấy user từ context
  const router = useRouter();
  const pathname = usePathname();

  // Ưu tiên sử dụng user từ props, nếu không có thì dùng từ auth context
  const currentUser = user || authUser;

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  // Debug: log user data
  useEffect(() => {
    // console.log('AccountPopover - currentUser:', currentUser);
    // console.log('AccountPopover - isAuthenticated:', isAuthenticated);
    // console.log('AccountPopover - authUser from context:', authUser);
  }, [currentUser, isAuthenticated, authUser]);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleClickItem = useCallback(
    (path: string) => {
      handleClosePopover();
      router.push(path);
    },
    [handleClosePopover, router]
  );

  const handleSignIn = useCallback(() => {
    handleClosePopover();
    router.push('/sign-in'); // Điều hướng đến trang đăng nhập
  }, [handleClosePopover, router]);

  const handleLogout = useCallback(async () => {
    handleClosePopover();
    try {
      await logout();
      router.push('/sign-in'); // Điều hướng đến trang đăng nhập sau khi đăng xuất
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
  }, [handleClosePopover, router]);

  // Kiểm tra user có tồn tại không
  const isUserAuthenticated = isAuthenticated && !!currentUser;

  // Lấy chữ cái đầu của tên để hiển thị trên avatar
  const getInitial = () => {
    if (!currentUser?.fullname) return 'U';
    
    const name = currentUser.fullname|| '';
    return name.charAt(0).toUpperCase();
  };

  // Lấy tên hiển thị
  const getDisplayName = () => {
    if (!currentUser) return 'Người dùng';
    
    if (currentUser.fullname) return currentUser.fullname;
    
    return 'Người dùng';
  };

  // Lấy email
  const getEmail = () => {
    if (!currentUser) return '';
    
    if (currentUser.email) return currentUser.email;
    if (currentUser.cccd) return `CCCD: ${currentUser.cccd}`;
    
    return '';
  };

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        sx={{
          p: '2px',
          width: 40,
          height: 40,
          background: (theme) =>
            `conic-gradient(${theme.vars.palette.primary.light}, ${theme.vars.palette.warning.light}, ${theme.vars.palette.primary.light})`,
          ...sx,
        }}
        {...other}
      >
        {isUserAuthenticated ? (
          <Avatar 
            alt={getDisplayName()} 
            sx={{ 
              width: 1, 
              height: 1,
              bgcolor: 'primary.main'
            }}
          >
            {getInitial()}
          </Avatar>
        ) : (
          <Avatar sx={{ width: 1, height: 1, bgcolor: 'grey.400' }}>
            <Typography variant="caption" sx={{ color: 'white' }}>
              ?
            </Typography>
          </Avatar>
        )}
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { 
              width: 280,
              borderRadius: 1.5,
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)'
            },
          },
        }}
      >
        {isUserAuthenticated ? (
          <>
            <Box sx={{ p: 2, pb: 1.5 }}>
              <Typography variant="subtitle1" noWrap fontWeight="bold">
                {getDisplayName()}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                {getEmail()}
              </Typography>
              
              {/* Hiển thị roles nếu có */}
              {currentUser?.roles && currentUser.roles.length > 0 && (
                <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {currentUser.roles.map((role, index) => (
                    <Typography 
                      key={index} 
                      variant="caption" 
                      sx={{ 
                        px: 0.75, 
                        py: 0.25, 
                        borderRadius: 0.5,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText'
                      }}
                    >
                      {role.replace('ROLE_', '')}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>

            <Divider sx={{ borderStyle: 'dashed', my: 0.5 }} />

            <MenuList
              disablePadding
              sx={{
                p: 1,
                gap: 0.5,
                display: 'flex',
                flexDirection: 'column',
                [`& .${menuItemClasses.root}`]: {
                  px: 1,
                  gap: 2,
                  borderRadius: 0.75,
                  color: 'text.secondary',
                  '&:hover': { 
                    color: 'text.primary',
                    backgroundColor: 'action.hover'
                  },
                  [`&.${menuItemClasses.selected}`]: {
                    color: 'text.primary',
                    bgcolor: 'action.selected',
                    fontWeight: 'fontWeightSemiBold',
                  },
                },
              }}
            >
              {data.map((option) => (
                <MenuItem
                  key={option.label}
                  selected={option.href === pathname}
                  onClick={() => handleClickItem(option.href)}
                >
                  {option.icon}
                  {option.label}
                </MenuItem>
              ))}
            </MenuList>

            <Divider sx={{ borderStyle: 'dashed', my: 0.5 }} />

            <Box sx={{ p: 1.5 }}>
              <Button 
                fullWidth 
                color="error" 
                size="medium" 
                variant="outlined" 
                onClick={handleLogout}
                sx={{
                  borderRadius: 1,
                  fontWeight: 500
                }}
              >
                Đăng xuất
              </Button>
            </Box>
          </>
        ) : (
          <Box sx={{ p: 2, pb: 1.5 }}>
            <Typography variant="subtitle1" noWrap sx={{ mb: 1, fontWeight: 'bold' }}>
              Bạn chưa đăng nhập
            </Typography>
           
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Đăng nhập để sử dụng đầy đủ tính năng
            </Typography>
            
            <Button 
              fullWidth 
              color="primary" 
              variant="contained" 
              onClick={handleSignIn}
              sx={{
                borderRadius: 1,
                fontWeight: 500
              }}
            >
              Đăng nhập
            </Button>
          </Box>
        )}
      </Popover>
    </>
  );
}