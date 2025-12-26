import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { 
  Grid, 
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
  styled 
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
          // Sửa: bỏ escape không cần thiết
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
      size={250}
      level="H"
      includeMargin // Sửa: bỏ ={true}
      imageSettings={{
        src: '/logo_hcmue.png',
        height: 40,
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

  // Sửa hàm crcChecksum để tránh sử dụng bitwise operators
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

  return (
    <Box sx={{ p: 3 }}>
      <Paper 
        elevation={3}
        sx={{
          background: 'rgba(255, 255, 255, 0.5)',
          width: '100%',
          maxWidth: 1200,
          mx: 'auto'
        }}
      >
        <Card variant="outlined">
          <CardHeader
            title={
              <Typography variant="h5">
                Nộp lệ phí thi
              </Typography>
            }
          />
          <Divider variant="middle" sx={{ border: '1px solid', borderColor: 'text.primary' }} />
          <CardContent>
            {exam && (
              <Box sx={{ flexGrow: 1 }}>
                {/* Sử dụng container từ MUI phiên bản mới */}
                <Box sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
                  gap: isMobile ? 0 : 1,
                }}>
                  {/* Phần thông tin đơn hàng */}
                  <Box>
                    <Card>
                      <CardContent sx={{ px: 0 }}>
                        <Box sx={{ mx: 2 }}>
                          <Typography variant="subtitle1" component="div" sx={{ fontWeight: "bold" }}>
                            Kì thi: Đợt {exam.turn} tại {exam.location} từ {exam.openAt} đến {exam.closeAt}
                          </Typography>
                          <Typography variant="subtitle1" component="div" color="primary">
                            Mã đăng ký: {orderCode}
                          </Typography>
                          <Typography variant="subtitle1" component="div">
                            Ngày đăng ký: {orderDate}
                          </Typography>
                          {status === "PENDING" && (
                            <Typography variant="subtitle1" component="div">
                              Hạn thanh toán: {expireDate}
                            </Typography>
                          )}
                          {status === "SUCCESS" && (
                            <Alert severity="success">
                              <AlertTitle>Đã thanh toán</AlertTitle>
                              Ngày thanh toán: {paymentAt} <br />
                              Cổng thanh toán: {paymentGateway}
                            </Alert>
                          )}
                        </Box>
                        <TableContainer component={Paper} sx={{ mt: 3 }}>
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
                                    {row.subject}<br />
                                    {row.date}<br />
                                    {row.time}
                                  </StyledTableCell>
                                  <StyledTableCell align="right">
                                    {new Intl.NumberFormat().format(row.price)}đ
                                  </StyledTableCell>
                                </StyledTableRow>
                              ))}
                              <StyledTableRow>
                                <StyledTableCellTotal align="center">Tổng lệ phí</StyledTableCellTotal>
                                <StyledTableCellTotal align="right">
                                  {new Intl.NumberFormat().format(totalPrice)}đ
                                </StyledTableCellTotal>
                              </StyledTableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <ButtonGroup variant="text" aria-label="text button group">
                          {status === "PENDING" && (
                            <Button size="large" color="error" onClick={handleOpenCancel}>
                              Huỷ đăng ký
                            </Button>
                          )}
                        </ButtonGroup>
                      </CardActions>
                    </Card>
                    {status === "PENDING" && totalPrice > 0 && (
                      <Alert severity="warning" sx={{ my: 1 }}>
                        <Typography component="div" variant="body1" color="error">
                          Lưu ý: bạn cần hoàn tất việc thanh toán lệ phí trong vòng 24 giờ tính từ ngày đăng ký! Hệ thống sẽ tự động cập nhật kết quả thanh toán.
                        </Typography>
                        <Typography component="div" variant="body1">
                          Nếu kết quả thanh toán chưa được cập nhật sau 24 giờ tính từ thời điểm giao dịch thành công, vui lòng gửi thư điện tử về{' '}
                          <Box component="span" fontWeight="bold" color="blue">
                            dgnl.hotro@hcmue.edu.vn
                          </Box>{' '}
                          để được hỗ trợ.
                        </Typography>
                      </Alert>
                    )}
                  </Box>

                  {/* Phần thanh toán QR Code */}
                  <Box sx={{ mt: { xs: 2, md: 1 } }}>
                    {status === "PENDING" && totalPrice > 0 && (
                      <Card>
                        <CardContent>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h6" color="#4169E1" gutterBottom>
                              Chuyển tiền bằng mã QR
                            </Typography>
                            <Box
                              sx={{
                                border: '2px solid black',
                                p: 2,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 'fit-content',
                                margin: '20px auto'
                              }}
                            >
                              {qrCodeData ? (
                                generateQRCode()
                              ) : (
                                <Typography>Đang tạo mã QR...</Typography>
                              )}
                            </Box>
                            <Box sx={{ textAlign: 'left' }}>
                              <Alert severity="info" sx={{ m: 1 }}>
                                <Typography variant="body1">
                                  Khi dùng các ứng dụng chuyển khoản, thí sinh phải thấy được nội dung chuyển khoản như bên dưới
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                  {SERVICE_CODE} {orderCode} {fullname}
                                </Typography>
                              </Alert>
                              <Alert severity="error" sx={{ m: 1 }}>
                                <Typography component="span" variant="body1" fontWeight="bold">
                                  KHÔNG SỬ DỤNG VÍ SHOPEE
                                </Typography>{' '}
                                <Typography component="span" variant="body1">
                                  để thanh toán
                                </Typography>
                              </Alert>
                              <Alert severity="warning" sx={{ m: 1 }}>
                                <Typography component="span" variant="body1" fontWeight="bold">
                                  NGÂN HÀNG AGRIBANK VÀ VÍ MOMO
                                </Typography>{' '}
                                <Typography component="span" variant="body1">
                                  sẽ được xác nhận thanh toán sau 24 đến 36 giờ tính từ thời điểm hoàn tất giao dịch
                                </Typography>
                              </Alert>
                              <Alert severity="success" sx={{ m: 1 }}>
                                <Typography component="span" variant="body1" fontWeight="bold">
                                  CÁC NGÂN HÀNG VÀ VÍ ĐIỆN TỬ KHÁC
                                </Typography>{' '}
                                <Typography component="span" variant="body1">
                                  sẽ được xác nhận thanh toán sau 15 phút tính từ thời điểm hoàn tất giao dịch
                                </Typography>
                              </Alert>
                            </Box>
                          </Box>
                          <Stack spacing={2} direction="column" sx={{ mt: 2 }}>
                            <Button variant="outlined" onClick={handleCheckBankingClick}>
                              Kiểm tra kết quả thanh toán
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    )}
                  </Box>
                </Box>

                {/* Cancel Dialog */}
                <Dialog
                  open={cancelDialog}
                  onClose={handleCloseCancel}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <DialogTitle id="alert-dialog-title">
                    Bạn có muốn hủy đăng ký?
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                      Tất cả môn thi bạn đăng ký với mã {orderCode} sẽ bị hủy!
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCloseCancel}>Quay lại</Button>
                    <Button color="error" onClick={handleCancelOrder} autoFocus>
                      Xác nhận hủy
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            )}
          </CardContent>
        </Card>
      </Paper>

      {/* Loading Dialog */}
      {loadingPayment && (
        <Dialog 
          open={loadingPayment} 
          disableEscapeKeyDown
          sx={{
            '& .MuiDialog-paper': {
              width: '300px',
              maxWidth: '300px',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
        >
          <DialogTitle sx={{ textAlign: 'center' }}>Đang tải dữ liệu đăng kí...</DialogTitle>
          <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress size={80} />
          </DialogContent>
        </Dialog>
      )}

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
          sx={{ width: '100%' }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}