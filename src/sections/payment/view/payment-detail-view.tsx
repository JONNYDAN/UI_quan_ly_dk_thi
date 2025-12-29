import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { 
  Box, 
  Paper, 
  Alert, 
  AlertTitle, 
  Card, 
  CardHeader, 
  CardContent, 
  CardActions, 
  Typography, 
  ButtonGroup, 
  Button, 
  Divider, 
  Stack, 
  Table, 
  TableBody, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Dialog, 
  DialogActions, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  Snackbar,
  CircularProgress,
  styled,
  Chip
} from '@mui/material';

import { useAuth } from 'src/contexts/AuthContext';
import orderService from 'src/services/orderService';
import paymentService from 'src/services/paymentService';

const SERVICE_CODE = import.meta.env.VITE_APP_SERVICE;

// Styled Components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#104675',
    color: theme.palette.common.white,
    fontSize: 16
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}));

const StyledTableCellTotal = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#cf3439',
    backgroundColor: "#e5fcff",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

interface OrderDetail {
  subject: string;
  date: string;
  time: string;
  price: number;
}

interface OrderData {
  exam: {
    turn: string;
    location: string;
    openAt: string;
    closeAt: string;
  };
  fullname: string;
  examStatus: string;
  createdAt: string;
  expireAt: string;
  totalPrice: number;
  turns: OrderDetail[];
  paymentInfo: any;
  paymentGateway: string;
  paymentAt: string;
  status: string;
  message: string;
}

export function PaymentDetailView() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { orderCode, type } = useParams<{ orderCode: string; type?: string }>();

  const [exam, setExam] = useState<any>(null);
  const [examStatus, setExamStatus] = useState('OPEN');
  const [orderDate, setOrderDate] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [fullname, setFullname] = useState('');
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [paymentGateway, setPaymentGateway] = useState('');
  const [paymentAt, setPaymentAt] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [checkBankingSnack, setCheckBankingSnack] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [snackType, setSnackType] = useState<'success' | 'error' | 'warning' | 'info'>('warning');
  const [qrCodeData, setQrCodeData] = useState('');
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const isMobile = width <= 768;
  const vertical = 'bottom';
  const horizontal = 'center';

  const goToProfile = () => navigate('/profile');
  const goToExam = () => navigate('/exam');
  const goToLogin = () => navigate('/sign-in');
  const goToPayment = () => navigate(`/payment/${orderCode}`);

  useEffect(() => {
    const handleWindowSizeChange = () => {
      setWidth(window.innerWidth);
    };

    if (!isAuthenticated) {
      goToLogin();
      return () => {};
    }

    if (!orderCode || orderCode === '') {
      goToProfile();
      return () => {};
    }

    setLoadingPayment(true);
    orderService.getOrderDetails({ code: orderCode }).then(
      (response: any) => {
        const data = response.data || response;
        if (data.status === 'CANCEL' || data.status === 'EXPIRED') {
          goToProfile();
          return;
        }
        setExam(data.exam);
        setFullname(data.fullname);
        setExamStatus(data.examStatus);
        setOrderDate(data.createdAt);
        setExpireDate(data.expireAt);
        setTotalPrice(data.totalPrice);
        setOrderDetails(data.turns || []);
        setPaymentInfo(data.paymentInfo);
        setPaymentGateway(data.paymentGateway);
        setPaymentAt(data.paymentAt);
        setStatus(data.status);
        setMessage(data.message);
        setLoadingPayment(false);
      },
      (error: any) => {
        const _content =
          (error.response && error.response.data && error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(_content);
        setLoadingPayment(false);
      },
    );

    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, [isAuthenticated, orderCode]);

  useEffect(() => {
    if (!orderCode || !fullname || totalPrice <= 0) return;

    const link = `${SERVICE_CODE} ${orderCode} ${fullname}`;
    const processedLink = removevn(link).substr(0, 75);
    const amount = totalPrice.toString().replace(/\D/g, '');

    let stk = '00020101021238540010A00000072701240006970436011019006688880208QRIBFTTA5303704540';
    stk += amount.length + amount + '5802VN62';

    const dai = processedLink.length + 4;
    stk += dai + '08' + processedLink.length + processedLink + '6304';

    const checksum = crcChecksum(stk);
    stk += checksum;

    setQrCodeData(stk);
  }, [orderCode, fullname, totalPrice]);

  const handleOpenCancel = () => setCancelDialog(true);
  const handleCloseCancel = () => setCancelDialog(false);

  const handleMoMoPayment = () => {
    if (!orderCode) return;

    paymentService
      .postMomoRequest({
        orderCode: orderCode,
        totalPrice: totalPrice,
        type: type || 'payment',
      })
      .then((res: any) => {
        const payUrl = res.data?.payUrl || res.payUrl;
        if (payUrl) {
          window.location.href = payUrl;
        }
      });
  };

  const handleCancelOrder = () => {
    if (!orderCode) return;

    orderService
      .putCancelOrder({
        orderCode: orderCode,
      })
      .then((res: any) => {
        if (res.data?.count || res.count) {
          goToExam();
        }
      });
  };

  const handleCheckBankingClick = () => {
    setCheckBankingSnack(true);
    setSnackType('info');
    setSnackMsg('Đang kiểm tra thông tin. Vui lòng chờ trong giây lát ...');

    if (!orderCode) return;

    const url = `https://docs.google.com/spreadsheets/d/1AuQ1AidWomm3s65b5VB_UVU1IO_4lnr3E6LWqeNuMIA/gviz/tq?tqx=out:csv&sheet=Main&range=A:E&tq=select+*+where+D=%27${orderCode}%27`;

    fetch(url)
      .then((res) => res.text())
      .then((data) => {
        const rows = data.split(/\r?\n/);
        if (rows[1]) {
          const cells = rows[1].split(/",/);
          const amount = parseInt(cells[1]?.replace(/\D/g, '') || '0');

          if (amount === totalPrice) {
            setSnackType('success');
            setSnackMsg('Hệ thống đã ghi nhận thanh toán! Dữ liệu đang được đồng bộ ...');
          } else {
            setSnackType('warning');
            setSnackMsg('Số tiền chuyển khoản không khớp với lệ phí thi!');
          }

          setTimeout(() => {
            window.location.reload();
          }, 5000);
        } else {
          setSnackType('error');
          setSnackMsg('Chưa có thông tin chuyển khoản!');
        }
      })
      .catch((error) => {
        console.error('Error fetching data from Google Sheets:', error);
        setSnackType('error');
        setSnackMsg('Lỗi khi kiểm tra thanh toán!');
      });
  };

  const handleCheckBankingClose = () => {
    setCheckBankingSnack(false);
    setOpenDialog(false);
  };

  const handleVietQROpen = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // QR Code generation
  const generateQRCode = () => (
    <QRCodeCanvas
      value={qrCodeData}
      size={isMobile ? 200 : 250}
      level="H"
      includeMargin
      imageSettings={{
        src: '/logo_hcmue.png',
        height: 30,
        width: 60,
        excavate: true,
      }}
    />
  );

  // Utility functions
  function removevn(st: string) {
    return st
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-zA-Z0-9\s]/g, '');
  }

  /* eslint-disable no-bitwise */
  function crcChecksum(data: string) {
    const polynomial = 0x1021;
    let crc = 0xffff;

    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ polynomial;
        } else {
          crc <<= 1;
        }
        crc &= 0xffff;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }
  /* eslint-enable no-bitwise */

  if (!isAuthenticated) {
    return null;
  }

  const isPending = status === "PENDING";
  const isSuccess = status === "SUCCESS";

  return (
    <Box sx={{ p: { xs: 1, sm: 3 }, maxWidth: "lg", mx: 'auto' }}>
      <Paper 
        elevation={3}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: 3,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Card variant="outlined" sx={{ border: 'none' }}>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5" fontWeight="600">
                  Nộp lệ phí thi
                </Typography>
                <Chip 
                  label={isPending ? "Chờ thanh toán" : "Đã thanh toán"} 
                  color={isPending ? "warning" : "success"}
                  size="medium"
                  sx={{ fontWeight: 500 }}
                />
              </Box>
            }
            sx={{ 
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid',
              borderColor: 'divider',
              p: 1.5
            }}
          />
          
          <Divider />
          
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            {exam && (
              <Box sx={{ flexGrow: 1 }}>
                {/* Layout điều kiện: Nếu đã thanh toán, hiển thị full width */}
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: { xs: 'column', md: isSuccess ? 'column' : 'row' },
                  gap: 3
                }}>
                  {/* Phần thông tin đơn hàng - Chiếm full width nếu đã thanh toán */}
                  <Box sx={{ 
                    flex: 1,
                    minWidth: 0 // Để tránh overflow
                  }}>
                    <Card variant="outlined" sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                            Kì thi: Đợt {exam.turn} tại {exam.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Thời gian: {exam.openAt} đến {exam.closeAt}
                          </Typography>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 2, 
                            mt: 2,
                            alignItems: 'center'
                          }}>
                            <Box sx={{ 
                              backgroundColor: '#e3f2fd', 
                              p: 1.5, 
                              borderRadius: 1,
                              flex: 1,
                              minWidth: 'fit-content'
                            }}>
                              <Typography variant="caption" color="text.secondary">
                                Mã đăng ký
                              </Typography>
                              <Typography variant="body1" fontWeight="600" color="primary">
                                {orderCode}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ 
                              backgroundColor: '#f3e5f5', 
                              p: 1.5, 
                              borderRadius: 1,
                              flex: 1,
                              minWidth: 'fit-content'
                            }}>
                              <Typography variant="caption" color="text.secondary">
                                Ngày đăng ký
                              </Typography>
                              <Typography variant="body1">
                                {orderDate}
                              </Typography>
                            </Box>
                            
                            {isPending && (
                              <Box sx={{ 
                                backgroundColor: '#fff3e0', 
                                p: 1.5, 
                                borderRadius: 1,
                                flex: 1,
                                minWidth: 'fit-content'
                              }}>
                                <Typography variant="caption" color="text.secondary">
                                  Hạn thanh toán
                                </Typography>
                                <Typography variant="body1" color="error.main" fontWeight="500">
                                  {expireDate}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>

                        {isSuccess && (
                          <Alert 
                            severity="success" 
                            sx={{ 
                              mb: 3, 
                              borderRadius: 2,
                              '& .MuiAlert-message': { width: '100%' }
                            }}
                          >
                            <AlertTitle>Thanh toán thành công</AlertTitle>
                            <Box sx={{ 
                              display: 'flex', 
                              flexWrap: 'wrap', 
                              gap: 3,
                              mt: 1 
                            }}>
                              <Box>
                                <Typography variant="caption" color="inherit">
                                  Ngày thanh toán
                                </Typography>
                                <Typography variant="body1" fontWeight="500">
                                  {paymentAt}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="inherit">
                                  Cổng thanh toán
                                </Typography>
                                <Typography variant="body1" fontWeight="500">
                                  {paymentGateway}
                                </Typography>
                              </Box>
                            </Box>
                          </Alert>
                        )}

                        <TableContainer 
                          component={Paper} 
                          variant="outlined" 
                          sx={{ 
                            borderRadius: 2,
                            overflow: 'hidden'
                          }}
                        >
                          <Table aria-label="customized table">
                            <TableHead>
                              <TableRow>
                                <StyledTableCell align="left">Môn thi</StyledTableCell>
                                <StyledTableCell align="right">Lệ phí</StyledTableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {orderDetails.map((row, index) => (
                                <StyledTableRow key={index}>
                                  <StyledTableCell>
                                    <Typography fontWeight="500">{row.subject}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {row.date} • {row.time}
                                    </Typography>
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    <Typography fontWeight="500">
                                      {new Intl.NumberFormat().format(row.price)}đ
                                    </Typography>
                                  </StyledTableCell>
                                </StyledTableRow>
                              ))}
                              <StyledTableRow>
                                <StyledTableCellTotal align="center" colSpan={2}>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography>Tổng lệ phí</Typography>
                                    <Typography>
                                      {new Intl.NumberFormat().format(totalPrice)}đ
                                    </Typography>
                                  </Box>
                                </StyledTableCellTotal>
                              </StyledTableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>

                        {isPending && (
                          <CardActions sx={{ 
                            justifyContent: 'flex-end', 
                            px: 0,
                            pt: 3 
                          }}>
                            <ButtonGroup variant="outlined" aria-label="text button group">
                              <Button 
                                size="large" 
                                color="error" 
                                onClick={handleOpenCancel}
                                sx={{ 
                                  borderRadius: 2,
                                  px: 3
                                }}
                              >
                                Huỷ đăng ký
                              </Button>
                            </ButtonGroup>
                          </CardActions>
                        )}
                      </CardContent>
                    </Card>

                    {isPending && totalPrice > 0 && (
                      <Alert 
                        severity="warning" 
                        sx={{ 
                          mt: 3, 
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'warning.light'
                        }}
                      >
                        <Typography variant="body1" fontWeight="600" color="error" gutterBottom>
                          ⚠️ Lưu ý quan trọng
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          Bạn cần hoàn tất việc thanh toán lệ phí trong vòng <strong>24 giờ</strong> tính từ ngày đăng ký!
                        </Typography>
                        <Typography variant="body2">
                          Nếu kết quả thanh toán chưa được cập nhật sau 24 giờ tính từ thời điểm giao dịch thành công, 
                          vui lòng liên hệ: 
                          <Box component="span" fontWeight="600" color="primary.main" sx={{ ml: 0.5 }}>
                            dgnl.hotro@hcmue.edu.vn
                          </Box>
                        </Typography>
                      </Alert>
                    )}
                  </Box>

                  {/* Phần QR Code - Chỉ hiển thị khi đang chờ thanh toán */}
                  {isPending && totalPrice > 0 && (
                    <Box sx={{ 
                      width: { xs: '100%', md: 400 },
                      minWidth: { md: 400 }
                    }}>
                      <Card variant="outlined" sx={{ 
                        borderRadius: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <CardContent sx={{ 
                          flex: 1,
                          p: { xs: 2, sm: 3 },
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Typography variant="h6" color="primary.main" fontWeight="600" gutterBottom>
                              Chuyển tiền bằng mã QR
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Quét mã QR để chuyển khoản nhanh chóng
                            </Typography>
                          </Box>
                          
                          <Box sx={{ 
                            border: '2px solid',
                            borderColor: 'divider',
                            p: 2,
                            borderRadius: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            my: 2,
                            mx: 'auto',
                            width: 'fit-content'
                          }}>
                            {qrCodeData ? (
                              generateQRCode()
                            ) : (
                              <CircularProgress size={40} />
                            )}
                          </Box>
                          
                          <Box sx={{ flex: 1 }}>
                            <Alert severity="info" sx={{ borderRadius: 2 }}>
                              <Typography variant="body2" fontWeight="500">
                                Nội dung chuyển khoản:
                              </Typography>
                            </Alert>
                            <Box sx={{ 
                              backgroundColor: '#f5f5f5', 
                              p: 1.5, 
                              borderRadius: 1,
                              mt: 1,
                              border: '1px dashed',
                              borderColor: 'divider',
                              mb: 2
                            }}>
                              <Typography variant="body2" fontWeight="600" sx={{ wordBreak: 'break-all' }}>
                                {SERVICE_CODE} {orderCode} {fullname}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                              <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
                                <Typography variant="body2" fontWeight="500">
                                  ⛔ KHÔNG SỬ DỤNG VÍ SHOPEE để thanh toán
                                </Typography>
                              </Alert>
                              
                              <Alert severity="warning" variant="outlined" sx={{ borderRadius: 2 }}>
                                <Typography variant="body2">
                                  <strong>NGÂN HÀNG AGRIBANK VÀ VÍ MOMO</strong> sẽ được xác nhận sau 24-36 giờ
                                </Typography>
                              </Alert>
                              
                              <Alert severity="success" variant="outlined" sx={{ borderRadius: 2 }}>
                                <Typography variant="body2">
                                  <strong>CÁC NGÂN HÀNG VÀ VÍ ĐIỆN TỬ KHÁC</strong> sẽ được xác nhận sau 15 phút
                                </Typography>
                              </Alert>
                            </Box>
                          </Box>
                          
                          <Stack spacing={2} sx={{ mt: 3 }}>
                            <Button 
                              variant="outlined" 
                              onClick={handleCheckBankingClick}
                              sx={{ borderRadius: 2 }}
                            >
                              Kiểm tra kết quả thanh toán
                            </Button>
                            <Button 
                              variant="contained" 
                              onClick={handleMoMoPayment}
                              sx={{ borderRadius: 2, py: 1.5 }}
                            >
                              Thanh toán bằng MoMo
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Box>
                  )}
                </Box>

                {/* Cancel Dialog */}
                <Dialog
                  open={cancelDialog}
                  onClose={handleCloseCancel}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                  PaperProps={{ sx: { borderRadius: 2 } }}
                >
                  <DialogTitle id="alert-dialog-title" fontWeight="600">
                    Xác nhận hủy đăng ký
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                        Tất cả môn thi bạn đăng ký với mã <strong>{orderCode}</strong> sẽ bị hủy!
                      </Alert>
                      Bạn có chắc chắn muốn hủy đăng ký này không?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                      onClick={handleCloseCancel}
                      sx={{ borderRadius: 2 }}
                    >
                      Quay lại
                    </Button>
                    <Button 
                      color="error" 
                      onClick={handleCancelOrder} 
                      autoFocus
                      variant="contained"
                      sx={{ borderRadius: 2 }}
                    >
                      Xác nhận hủy
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            )}
          </CardContent>
        </Card>
      </Paper>

      {/* Snackbar for banking check */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={5000}
        open={checkBankingSnack}
        onClose={handleCheckBankingClose}
      >
        <Alert
          onClose={handleCheckBankingClose}
          severity={snackType}
          variant="filled"
          sx={{ 
            width: '100%',
            borderRadius: 2,
            alignItems: 'center'
          }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}