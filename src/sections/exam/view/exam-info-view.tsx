import type { Order as UserServiceOrder, ApiResponse } from 'src/services/userService';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, styled, useTheme } from '@mui/material/styles';

import UserService from 'src/services/userService';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

const SERVICE_CODE = import.meta.env.VITE_APP_SERVICE;

// Re-export types từ userService để sử dụng trực tiếp
interface OrderDetail {
  turn: string;
  subject: string;
  date: string;
  time: string;
  orderedAt: string;
  responseTime: string | null;
  status: 'PENDING' | 'SUCCESS' | 'CANCEL' | 'EXPIRED' | 'REFUND';
}

interface ExamDetails {
  examId: number;
  examName: string;
  location: string;
  openAt: string;
  closeAt: string;
  [key: string]: any;
}

// Sử dụng type từ userService
type Order = UserServiceOrder;

interface GroupedOrders {
  [examName: string]: Order[];
}

interface RootState {
  auth: {
    user: any;
    isLoggedIn: boolean;
  };
}

// Interface cho response data từ API
interface UserOrdersResponse extends ApiResponse {
  data: Order[];
}

// ----------------------------------------------------------------------

const StyledTableCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile?: boolean }>(({ theme, isMobile }) => ({
  [`&.${theme.components?.MuiTableCell?.styleOverrides?.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: isMobile ? 12 : 14,
    fontWeight: 600,
    padding: isMobile ? theme.spacing(1) : theme.spacing(2),
    whiteSpace: 'nowrap',
  },
  [`&.${theme.components?.MuiTableCell?.styleOverrides?.body}`]: {
    fontSize: isMobile ? 12 : 14,
    padding: isMobile ? theme.spacing(1) : theme.spacing(2),
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StatusChip = ({ status, isSmall = false }: { status: OrderDetail['status']; isSmall?: boolean }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'PENDING':
        return { label: 'Đang xử lý', color: 'warning' as const };
      case 'SUCCESS':
        return { label: 'Thành công', color: 'success' as const };
      case 'CANCEL':
        return { label: 'Đã hủy', color: 'error' as const };
      case 'EXPIRED':
        return { label: 'Hết hạn', color: 'secondary' as const };
      case 'REFUND':
        return { label: 'Hoàn tiền', color: 'primary' as const };
      default:
        return { label: 'Không xác định', color: 'default' as const };
    }
  };

  const { label, color } = getStatusConfig();

  return (
    <Chip
      size={isSmall ? "small" : "medium"}
      variant="outlined"
      label={label}
      color={color}
      sx={{ 
        fontWeight: 500,
        borderWidth: 1.5,
        fontSize: isSmall ? 10 : 12,
        height: isSmall ? 24 : 32,
        minWidth: isSmall ? 80 : 100,
        '& .MuiChip-label': {
          px: isSmall ? 1 : 1.5,
        }
      }}
    />
  );
};

// Compact mobile view component
const MobileOrderCard = ({ order, isVerySmall = false }: { order: Order; isVerySmall?: boolean }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.split(' ')[0];
  };

  return (
    <Card 
      sx={{ 
        mb: 2,
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography 
              variant={isVerySmall ? "caption" : "subtitle2"} 
              sx={{ fontWeight: 700, color: 'primary.dark' }}
            >
              Mã:{' '}
              <Typography 
                component="span" 
                sx={{ color: 'error.main', fontWeight: 800 }}
              >
                {order.orderCode}
              </Typography>
            </Typography>
            {order.details?.some(detail => 
              detail.status !== 'CANCEL' && 
              detail.status !== 'EXPIRED' && 
              detail.status !== 'REFUND'
            ) && (
              <Button 
                size="small" 
                variant="contained" 
                color="primary"
                href={`/payment/${SERVICE_CODE}/${order.orderCode}`}
                sx={{ 
                  borderRadius: 1,
                  fontWeight: 600,
                  fontSize: isVerySmall ? 11 : 11,
                  py: 0.5,
                  minHeight: isVerySmall ? 32 : 32
                }}
                fullWidth
              >
                Xem chi tiết
              </Button>
            )}
          </Box>
        }
        sx={{ 
          bgcolor: alpha('#104675', 0.05),
          borderBottom: 1,
          borderColor: 'divider',
          py: 1,
          px: 2
        }}
      />
      
      <CardContent sx={{ p: 2 }}>
        {order.details?.map((detail, detailIndex) => (
          <Box 
            key={detailIndex} 
            sx={{ 
              mb: 2,
              pb: 2,
              borderBottom: detailIndex < order.details.length - 1 ? 1 : 0,
              borderColor: 'divider',
              '&:last-child': { mb: 0, pb: 0 }
            }}
          >
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: 1.5, 
              mb: 1.5 
            }}>
              <Box>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: 'block', fontSize: isVerySmall ? 10 : 12 }}
                >
                  Ca thi:
                </Typography>
                <Typography 
                  variant="body2" 
                  fontWeight="medium"
                  sx={{ fontSize: isVerySmall ? 12 : 14 }}
                >
                  {detail.turn}
                </Typography>
              </Box>
              
              <Box>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: 'block', fontSize: isVerySmall ? 10 : 12 }}
                >
                  Môn thi:
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ fontSize: isVerySmall ? 12 : 14 }}
                >
                  {detail.subject}
                </Typography>
              </Box>
              
              <Box sx={{ gridColumn: 'span 2' }}>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: 'block', fontSize: isVerySmall ? 10 : 12 }}
                >
                  Ngày giờ thi:
                </Typography>
                <Typography 
                  variant="body2" 
                  fontWeight="medium"
                  sx={{ fontSize: isVerySmall ? 12 : 14 }}
                >
                  {detail.date} {detail.time}
                </Typography>
              </Box>
              
              <Box>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: 'block', fontSize: isVerySmall ? 10 : 12 }}
                >
                  Tạo hóa đơn:
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ fontSize: isVerySmall ? 12 : 14 }}
                >
                  {formatDate(detail.orderedAt)}
                </Typography>
              </Box>
              
              <Box>
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ display: 'block', fontSize: isVerySmall ? 10 : 12 }}
                >
                  Thanh toán:
                </Typography>
                <Typography 
                  variant="body2" 
                  color={detail.responseTime ? 'text.primary' : 'text.disabled'}
                  sx={{ fontSize: isVerySmall ? 12 : 14 }}
                >
                  {detail.responseTime ? formatDate(detail.responseTime) : 'Chưa có'}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mt: 1.5 
            }}>
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ fontSize: isVerySmall ? 10 : 12 }}
              >
                Trạng thái:
              </Typography>
              <StatusChip status={detail.status} isSmall={isVerySmall} />
            </Box>
          </Box>
        ))}
        
        {order.status === 'SUCCESS' && (
          <CardActions sx={{ justifyContent: 'center', p: 0, mt: 2 }}>
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<CheckIcon sx={{ fontSize: isVerySmall ? 16 : 20 }} />}
              href={`/result/${order.examId}`}
              sx={{ 
                borderRadius: 1,
                fontWeight: 600,
                fontSize: isVerySmall ? 11 : 13,
                py: 0.5,
                minHeight: isVerySmall ? 32 : 36
              }}
              fullWidth
            >
              Xem kết quả
            </Button>
          </CardActions>
        )}
      </CardContent>
    </Card>
  );
};

// ----------------------------------------------------------------------

export function ExamInfoView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user: currentUser, isLoggedIn } = useSelector((state: RootState) => state.auth);
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingExamInfos, setLoadingExamInfos] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Sử dụng useMediaQuery với breakpoints chuẩn của MUI
  const isXs = useMediaQuery(theme.breakpoints.only('xs')); // 0-599px: điện thoại nhỏ
  const isSm = useMediaQuery(theme.breakpoints.only('sm')); // 600-899px: điện thoại lớn/tablet nhỏ
  const isMd = useMediaQuery(theme.breakpoints.only('md')); // 900-1199px: tablet lớn
  const isLg = useMediaQuery(theme.breakpoints.up('lg')); // ≥1200px: desktop
  
  // Xác định các trạng thái responsive
  const isMobile = isXs || isSm;
  const isSmallMobile = isXs;
  const isTablet = isMd;
  const isDesktop = isLg;

  const goToLogin = useCallback(() => navigate('/sign-in'), [navigate]);

  const fetchUserOrders = useCallback(async () => {
    try {
      setLoadingExamInfos(true);
      setErrorMessage(null);
      
      const response = await UserService.getUserOrders() as unknown as UserOrdersResponse;
      
      if (response && response.data) {
        setOrders(response.data || []);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      console.error("Error fetching user orders:", err);
      setErrorMessage('Không thể tải thông tin đơn đăng ký. Vui lòng thử lại sau.');
      setOrders([]);
    } finally {
      setLoadingExamInfos(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchUserOrders();
    } else {
      goToLogin();
    }
  }, [isLoggedIn, goToLogin, fetchUserOrders]);

  // Nhóm đơn hàng theo tên kỳ thi
  const groupedOrders: GroupedOrders = orders.reduce((acc: GroupedOrders, order) => {
    const examName = order.examDetails?.examName || "Kỳ thi chưa đặt tên";
    if (!acc[examName]) acc[examName] = [];
    acc[examName].push(order);
    return acc;
  }, {});

  // Sắp xếp các đơn hàng trong từng nhóm theo trạng thái
  const statusOrder = {
    SUCCESS: 0,
    PENDING: 1,
    EXPIRED: 2,
    CANCEL: 3,
    REFUND: 4,
  };

  // Sắp xếp lại các đơn hàng trong mỗi nhóm
  Object.keys(groupedOrders).forEach(examName => {
    groupedOrders[examName].sort((a, b) => {
      const aStatus = a.details?.[0]?.status || 'CANCEL';
      const bStatus = b.details?.[0]?.status || 'CANCEL';
      return statusOrder[aStatus as keyof typeof statusOrder] - statusOrder[bStatus as keyof typeof statusOrder];
    });
  });

  const hasActiveOrders = orders.some(order => 
    order.details?.some(detail => 
      detail.status !== 'CANCEL' && detail.status !== 'EXPIRED' && detail.status !== 'REFUND'
    )
  );

  // Format date for better display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.split(' ')[0];
  };

  // Truncate long text for mobile
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Xác định layout dựa trên kích thước màn hình
  const getLayoutConfig = () => {
    if (isSmallMobile) {
      return {
        isCardView: true,
        spacing: 1,
        fontSizeSmall: 10,
        fontSizeMedium: 12,
        fontSizeLarge: 14,
        paddingSmall: 1,
        paddingMedium: 1.5,
        paddingLarge: 2,
      };
    }
    if (isMobile) {
      return {
        isCardView: true,
        spacing: 1.5,
        fontSizeSmall: 11,
        fontSizeMedium: 13,
        fontSizeLarge: 15,
        paddingSmall: 1.5,
        paddingMedium: 2,
        paddingLarge: 2.5,
      };
    }
    if (isTablet) {
      return {
        isCardView: false,
        spacing: 2,
        fontSizeSmall: 12,
        fontSizeMedium: 14,
        fontSizeLarge: 16,
        paddingSmall: 2,
        paddingMedium: 2.5,
        paddingLarge: 3,
      };
    }
    // Desktop
    return {
      isCardView: false,
      spacing: 3,
      fontSizeSmall: 14,
      fontSizeMedium: 16,
      fontSizeLarge: 18,
      paddingSmall: 2.5,
      paddingMedium: 3,
      paddingLarge: 4,
    };
  };

  const layout = getLayoutConfig();

  return (
    <DashboardContent>
      <Box sx={{ 
        px: isMobile ? layout.paddingSmall : 0 
      }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          sx={{ 
            mb: layout.spacing, 
            color: 'primary.main', 
            fontWeight: 700,
            fontSize: layout.fontSizeLarge,
            lineHeight: 1.2
          }}
        >
          Kết quả đăng ký dự thi
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary" 
          sx={{ 
            mb: layout.spacing * 1.5,
            fontSize: layout.fontSizeMedium,
            lineHeight: 1.5
          }}
        >
          Quản lý và theo dõi tất cả các đơn đăng ký dự thi của bạn
        </Typography>
      </Box>

      {errorMessage && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: layout.spacing * 1.5,
            borderRadius: 1,
            fontSize: layout.fontSizeMedium,
            '& .MuiAlert-icon': { alignItems: 'center' }
          }}
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Alert>
      )}

      {orders.length === 0 && !loadingExamInfos ? (
        <Card 
          sx={{ 
            p: layout.paddingLarge, 
            textAlign: 'center',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            boxShadow: 'none',
            mx: isMobile ? layout.paddingSmall : 0
          }}
        >
          <Alert 
            severity="info" 
            sx={{ 
              maxWidth: 400,
              mx: 'auto',
              fontSize: layout.fontSizeMedium,
              '& .MuiAlert-icon': { fontSize: isMobile ? 24 : 30 }
            }}
          >
            <Typography 
              variant="body1" 
              fontWeight="medium" 
              sx={{ fontSize: layout.fontSizeMedium, mb: 1 }}
            >
              Chưa có đơn đăng ký dự thi nào
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ fontSize: layout.fontSizeSmall, lineHeight: 1.4 }}
            >
              Bạn chưa đăng ký dự thi kỳ thi nào. Vui lòng đăng ký để xem thông tin tại đây.
            </Typography>
          </Alert>
        </Card>
      ) : (
        <>
          {hasActiveOrders && (
            <Alert 
              severity="info" 
              sx={{ 
                mb: layout.spacing * 1.5,
                borderRadius: 1,
                border: 1,
                borderColor: 'info.light',
                fontSize: layout.fontSizeMedium,
                '& .MuiAlert-icon': { alignItems: 'center' }
              }}
            >
              <Typography variant="body2" sx={{ fontSize: layout.fontSizeSmall }}>
                Nhấn <strong>Xem chi tiết</strong> để thực hiện thanh toán cho các đơn hàng đang chờ xử lý.
              </Typography>
            </Alert>
          )}

          {Object.entries(groupedOrders).map(([examName, examOrders], idx) => (
            <Card 
              key={idx} 
              sx={{ 
                mb: layout.spacing * 1.5,
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
                mx: isMobile ? layout.paddingSmall : 0
              }}
            >
              <CardHeader
                title={
                  <Typography 
                    variant={isMobile ? "subtitle1" : "h6"} 
                    sx={{ 
                      fontWeight: 700, 
                      color: 'primary.dark',
                      fontSize: layout.fontSizeMedium,
                      lineHeight: 1.3
                    }}
                  >
                    {layout.isCardView ? truncateText(examName, isSmallMobile ? 40 : 50) : examName}
                  </Typography>
                }
                sx={{ 
                  bgcolor: alpha('#104675', 0.05),
                  borderBottom: 1,
                  borderColor: 'divider',
                  py: layout.paddingSmall,
                  px: layout.paddingMedium
                }}
              />
              
              <CardContent sx={{ p: layout.isCardView ? layout.paddingSmall : 0 }}>
                {layout.isCardView ? (
                  // Mobile view: Card layout
                  <Box sx={{ p: layout.paddingSmall }}>
                    {examOrders.map((order, orderIndex) => (
                      <MobileOrderCard 
                        key={orderIndex} 
                        order={order} 
                        isVerySmall={isSmallMobile} 
                      />
                    ))}
                  </Box>
                ) : (
                  // Desktop/Tablet view: Table layout
                  examOrders.map((order, orderIndex) => (
                    <Box 
                      key={orderIndex} 
                      sx={{ 
                        p: layout.paddingMedium,
                        borderBottom: orderIndex < examOrders.length - 1 ? 1 : 0,
                        borderColor: 'divider',
                        '&:hover': {
                          bgcolor: alpha('#104675', 0.02)
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          mb: layout.spacing,
                          flexDirection: isTablet ? 'column' : 'row',
                          gap: isTablet ? layout.spacing : 0
                        }}
                      >
                        <Box>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600, 
                              fontSize: layout.fontSizeMedium 
                            }}
                          >
                            Mã đăng ký:{' '}
                            <Typography 
                              component="span" 
                              sx={{ 
                                color: 'error.main', 
                                fontWeight: 700,
                                ml: 1,
                                fontSize: layout.fontSizeMedium
                              }}
                            >
                              {order.orderCode}
                            </Typography>
                          </Typography>
                        </Box>
                        
                        {order.details?.some(detail => 
                          detail.status !== 'CANCEL' && 
                          detail.status !== 'EXPIRED' && 
                          detail.status !== 'REFUND'
                        ) && (
                          <Button 
                            size={isTablet ? "medium" : "large"} 
                            variant="contained" 
                            color="primary"
                            href={`/payment/${SERVICE_CODE}/${order.orderCode}`}
                            sx={{ 
                              borderRadius: 1,
                              fontWeight: 600,
                              px: layout.paddingMedium,
                              fontSize: layout.fontSizeSmall,
                              minHeight: isTablet ? 40 : 48
                            }}
                          >
                            Xem chi tiết
                          </Button>
                        )}
                      </Box>

                      <TableContainer 
                        component={Paper} 
                        variant="outlined"
                        sx={{ 
                          borderRadius: 1,
                          overflow: 'auto',
                          borderColor: 'divider',
                          mb: layout.spacing,
                          maxWidth: '100%'
                        }}
                      >
                        <Table size={isTablet ? "small" : "medium"}>
                          <TableHead>
                            <TableRow>
                              <StyledTableCell isMobile={isTablet} align="center">Ca thi</StyledTableCell>
                              <StyledTableCell isMobile={isTablet} align="center">Môn thi</StyledTableCell>
                              <StyledTableCell isMobile={isTablet} align="center">Ngày giờ thi</StyledTableCell>
                              <StyledTableCell isMobile={isTablet} align="center">Tạo hóa đơn</StyledTableCell>
                              <StyledTableCell isMobile={isTablet} align="center">Thanh toán</StyledTableCell>
                              <StyledTableCell isMobile={isTablet} align="center">Trạng thái</StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.details?.map((detail, detailIndex) => (
                              <StyledTableRow key={detailIndex}>
                                <StyledTableCell isMobile={isTablet} align="center">
                                  <Typography 
                                    variant="body2" 
                                    fontWeight="medium"
                                    sx={{ fontSize: layout.fontSizeSmall }}
                                  >
                                    {detail.turn}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell isMobile={isTablet} align="center">
                                  <Typography 
                                    variant="body2"
                                    sx={{ fontSize: layout.fontSizeSmall }}
                                  >
                                    {detail.subject}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell isMobile={isTablet} align="center">
                                  <Box>
                                    <Typography 
                                      variant="body2" 
                                      fontWeight="medium"
                                      sx={{ fontSize: layout.fontSizeSmall }}
                                    >
                                      {detail.date}
                                    </Typography>
                                    <Typography 
                                      variant="caption" 
                                      color="text.secondary"
                                      sx={{ fontSize: layout.fontSizeSmall - 2 }}
                                    >
                                      {detail.time}
                                    </Typography>
                                  </Box>
                                </StyledTableCell>
                                <StyledTableCell isMobile={isTablet} align="center">
                                  <Typography 
                                    variant="body2"
                                    sx={{ fontSize: layout.fontSizeSmall }}
                                  >
                                    {formatDate(detail.orderedAt)}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell isMobile={isTablet} align="center">
                                  <Typography 
                                    variant="body2" 
                                    color={detail.responseTime ? 'text.primary' : 'text.disabled'}
                                    sx={{ fontSize: layout.fontSizeSmall }}
                                  >
                                    {detail.responseTime ? formatDate(detail.responseTime) : 'Chưa có'}
                                  </Typography>
                                </StyledTableCell>
                                <StyledTableCell isMobile={isTablet} align="center">
                                  <StatusChip status={detail.status} isSmall={isTablet} />
                                </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>

                      {order.status === 'SUCCESS' && (
                        <CardActions sx={{ justifyContent: 'flex-end', p: 0 }}>
                          <Button
                            size={isTablet ? "medium" : "large"}
                            variant="contained"
                            color="success"
                            startIcon={<CheckIcon />}
                            href={`/result/${order.examId}`}
                            sx={{ 
                              borderRadius: 1,
                              fontWeight: 600,
                              px: layout.paddingMedium,
                              fontSize: layout.fontSizeSmall,
                              minHeight: isTablet ? 40 : 48,
                              bgcolor: 'success.main',
                              '&:hover': { bgcolor: 'success.dark' }
                            }}
                          >
                            Xem kết quả
                          </Button>
                        </CardActions>
                      )}
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </>
      )}

    </DashboardContent>
  );
}