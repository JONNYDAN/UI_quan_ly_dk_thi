import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import SendIcon from '@mui/icons-material/Send';
import CheckIcon from '@mui/icons-material/Check';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
  Box,
  Paper,
  Alert,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  alpha,
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

// Dynamic import for jsPDF
let jsPDF: any;
if (typeof window !== 'undefined') {
  import('jspdf').then((module) => {
    jsPDF = module.default;
  });
}

import userService from 'src/services/userService';
import examService from 'src/services/examService';

// ----------------------------------------------------------------------

// Types based on your API response
interface AuthState {
  user: {
    cccd?: string;
    fullname?: string;
    roles?: string[];
  } | null;
  isLoggedIn: boolean;
}

interface RootState {
  auth: AuthState;
}

interface Exam {
  id: number;
  code: string;
  location: string;
  location_code: string;
  short_code: string;
  turn: number;
  openAt: string;
  closeAt: string;
  openEnrollAt: string;
  closeEnrollAt: string;
}

interface User {
  id: number;
  fullname: string;
  cccd: string;
  birthday: string;
  gender: number;
  email: string;
  phone: string;
}

export interface ExamTicket {
  id: number;
  code: string;
  firstname: string;
  lastname: string;
  cccd: string;
  birthday: string;
  subject: string;
  turn: number;
  time: string;
  date: string;
  room: string;
  seat: string;
  createdAt?: string;
  updatedAt?: string;
  examId: number;
  exam: Exam;
  user: User;
  examName: string;
}

interface ApiResponse {
  message: string;
  data: ExamTicket[];
  [key: string]: any;
}

interface GroupedTickets {
  [examId: string]: ExamTicket[];
}

// ----------------------------------------------------------------------

const API_URL = import.meta.env.VITE_API_URL;

const StyledTableCell = styled(TableCell, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile?: boolean }>(({ theme, isMobile }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#104675',
    color: theme.palette.common.white,
    fontSize: isMobile ? 12 : 14,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: isMobile ? 12 : 14,
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

// ----------------------------------------------------------------------

const MobileTicketCard = ({ ticket }: { ticket: ExamTicket }) => {
  const theme = useTheme();
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <CardHeader
        title={
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: 'primary.dark',
              fontSize: isSmallMobile ? 13 : 14,
            }}
          >
            {ticket.subject}
          </Typography>
        }
        sx={{
          bgcolor: alpha('#104675', 0.05),
          borderBottom: 1,
          borderColor: 'divider',
          py: 1,
          px: 2,
        }}
      />
      <CardContent sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 1.5,
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', fontSize: isSmallMobile ? 10 : 12 }}
            >
              Mã phiếu:
            </Typography>
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{ fontSize: isSmallMobile ? 12 : 14 }}
            >
              {ticket.code}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', fontSize: isSmallMobile ? 10 : 12 }}
            >
              Ngày thi:
            </Typography>
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{ fontSize: isSmallMobile ? 12 : 14 }}
            >
              {ticket.date}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', fontSize: isSmallMobile ? 10 : 12 }}
            >
              Giờ có mặt:
            </Typography>
            <Typography
              variant="body2"
              fontWeight="medium"
              sx={{ fontSize: isSmallMobile ? 12 : 14 }}
            >
              {ticket.time}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', fontSize: isSmallMobile ? 10 : 12 }}
            >
              Ca thi:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: isSmallMobile ? 12 : 14 }}
            >
              Ca {ticket.turn}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', fontSize: isSmallMobile ? 10 : 12 }}
            >
              Phòng thi:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: isSmallMobile ? 12 : 14 }}
            >
              {ticket.room}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', fontSize: isSmallMobile ? 10 : 12 }}
            >
              Số ghế:
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: isSmallMobile ? 12 : 14 }}
            >
              {ticket.seat}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// ----------------------------------------------------------------------

export function ExamPaperView() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user: currentUser, isLoggedIn } = useSelector((state: RootState) => state.auth);
  
  const [tickets, setTickets] = useState<ExamTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);

  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.up('lg'));
  
  const isMobile = isXs || isSm;
  const isSmallMobile = isXs;
  const isTablet = isMd;
  const isDesktop = isLg;

  // Load jsPDF dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('jspdf').then(() => {
        setIsPdfLoaded(true);
      });
    }
  }, []);

  const goToLogin = () => navigate('/sign-in');

  const fetchExamTickets = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      if (!currentUser?.cccd) {
        throw new Error('Không tìm thấy thông tin người dùng');
      }

      // Fetch exam tickets using the API response structure
      const response = await examService.getExamTicketsByUserAndExam(currentUser.cccd);
      
      if (response.data) {
        setTickets(response.data as ExamTicket[]);
      } else {
        setTickets([]);
      }
    } catch (error: any) {
      console.error('Error fetching exam tickets:', error);
      setErrorMessage(error.message || 'Có lỗi xảy ra khi tải thông tin phiếu dự thi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      goToLogin();
    } else {
      fetchExamTickets();
    }
  }, [isLoggedIn, currentUser]);

  const isClosed = (date?: string) => {
    if (!date) return false;
    const _close = date.split('/');
    if (_close.length !== 3) return false;
    const closeAt = new Date(
      parseInt(_close[2], 10),
      parseInt(_close[1], 10) - 1,
      parseInt(_close[0], 10),
      23,
      59,
      59
    );
    return Date.now() > closeAt.getTime();
  };

  const generatePDF = async (examTickets: ExamTicket[]) => {
    if (!isPdfLoaded) {
      alert('Đang tải module PDF, vui lòng thử lại sau');
      return;
    }

    try {
      const { default: JsPDF } = await import('jspdf');
      const doc = new JsPDF();

      // Add Title
      doc.setFontSize(18);
      doc.text('GIẤY BÁO DỰ THI', 105, 20, { align: 'center' as any });

      // Add the Education System Header
      doc.setFontSize(12);
      doc.text('BỘ GIÁO DỤC VÀ ĐÀO TẠO', 105, 30, { align: 'center' as any });
      doc.text('TRƯỜNG ĐẠI HỌC SƯ PHẠM THÀNH PHỐ HỒ CHÍ MINH', 105, 35, { align: 'center' as any });
      doc.text('Độc lập - Tự do - Hạnh phúc', 105, 40, { align: 'center' as any });

      // Add Exam Information
      doc.setFontSize(14);
      const exam = examTickets[0]?.exam;
      const examYear = exam?.openAt ? new Date(exam.openAt).getFullYear() : '';
      doc.text(`ĐÁNH GIÁ NĂNG LỰC CHUYÊN BIỆT NĂM ${examYear}, ĐỢT ${exam?.turn || ''}`, 105, 50, { align: 'center' as any });

      // Personal Information
      doc.setFontSize(12);
      const user = examTickets[0]?.user;
      doc.text(`Họ và tên thí sinh: ${user?.fullname || ''}`, 20, 60);
      doc.text(`Căn cước/CCCD: ${user?.cccd || ''}`, 20, 70);
      doc.text(`Ngày sinh: ${user?.birthday || ''}`, 20, 80);

      // Exam Information
      doc.setFontSize(14);
      doc.text('B. THÔNG TIN DỰ THI', 105, 100, { align: 'center' as any });

      // Create table
      const tableColumn = ['STT', 'Môn thi', 'Ngày thi', 'Giờ thi', 'Ca', 'Phòng thi', 'Số ghế'];
      const rowHeight = 10;
      const startX = 10;
      let startY = 110;

      // Draw table headers
      doc.setFontSize(10);
      const colWidths = [10, 30, 25, 20, 15, 25, 20];
      
      tableColumn.forEach((col, index) => {
        doc.rect(startX + colWidths.slice(0, index).reduce((a, b) => a + b, 0), startY, colWidths[index], rowHeight);
        doc.text(col, startX + colWidths.slice(0, index).reduce((a, b) => a + b, 0) + 2, startY + 7);
      });

      // Draw table rows
      examTickets.forEach((ticket, index) => {
        startY += rowHeight;
        const rowData = [
          index + 1,
          ticket.subject,
          ticket.date,
          ticket.time,
          ticket.turn.toString(),
          ticket.room,
          ticket.seat,
        ];

        rowData.forEach((data, dataIndex) => {
          doc.rect(startX + colWidths.slice(0, dataIndex).reduce((a, b) => a + b, 0), startY, colWidths[dataIndex], rowHeight);
          doc.text(data.toString(), startX + colWidths.slice(0, dataIndex).reduce((a, b) => a + b, 0) + 2, startY + 7);
        });
      });

      // Add Notes Section
      doc.setFontSize(10);
      doc.text('LƯU Ý:', 20, startY + rowHeight + 10);
      doc.text('1. Thí sinh phải có mặt tại điểm thi/phòng chờ trước giờ thi ít nhất 30 phút.', 20, startY + rowHeight + 20);
      doc.text('2. Thí sinh phải mang theo Căn cước/Căn cước công dân/Hộ chiếu.', 20, startY + rowHeight + 30);
      doc.text('3. Mọi thông tin liên quan đến kì thi Đánh giá Năng lực chuyên biệt, thí sinh vui lòng xem chi tiết tại trang https://dgnl.hcmue.edu.vn', 20, startY + rowHeight + 40);

      // Add signature section
      doc.text('Thành phố Hồ Chí Minh, ngày ... tháng ... năm 2025', 130, startY + rowHeight + 70);
      doc.text('TRƯỞNG BAN TỔ CHỨC', 135, startY + rowHeight + 80);

      // Save the PDF
      doc.save(`phieu-du-thi-${user?.cccd || 'unknown'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Có lỗi khi tạo file PDF');
    }
  };

  // Group tickets by examId
  const ticketsByExam: GroupedTickets = tickets.reduce((acc: GroupedTickets, ticket) => {
    const examId = ticket.examId.toString();
    if (!acc[examId]) {
      acc[examId] = [];
    }
    acc[examId].push(ticket);
    return acc;
  }, {});

  const getLayoutConfig = () => {
    if (isSmallMobile) {
      return {
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
        spacing: 2,
        fontSizeSmall: 12,
        fontSizeMedium: 14,
        fontSizeLarge: 16,
        paddingSmall: 2,
        paddingMedium: 2.5,
        paddingLarge: 3,
      };
    }
    return {
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

  if (loading) {
    return (
      <DashboardContent>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Box sx={{ mb: layout.spacing * 1.5, px: isMobile ? layout.paddingSmall : 0 }}>
        <Typography
          variant={isMobile ? 'h5' : 'h4'}
          sx={{
            mb: layout.spacing,
            color: 'primary.main',
            fontWeight: 700,
            fontSize: layout.fontSizeLarge,
            lineHeight: 1.2,
          }}
        >
          Giấy báo dự thi
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: layout.spacing * 1.5,
            fontSize: layout.fontSizeMedium,
            lineHeight: 1.5,
          }}
        >
          Quản lý và theo dõi thông tin dự thi của bạn
        </Typography>
      </Box>

      {errorMessage && (
        <Alert
          severity="error"
          sx={{
            mb: layout.spacing * 1.5,
            borderRadius: 1,
            fontSize: layout.fontSizeMedium,
            '& .MuiAlert-icon': { alignItems: 'center' },
          }}
          onClose={() => setErrorMessage(null)}
        >
          {errorMessage}
        </Alert>
      )}

      {tickets.length === 0 ? (
        <Card
          sx={{
            p: layout.paddingLarge,
            textAlign: 'center',
            border: 1,
            borderColor: 'divider',
            borderRadius: 2,
            boxShadow: 'none',
            mx: isMobile ? layout.paddingSmall : 0,
          }}
        >
          <Alert
            severity="info"
            sx={{
              maxWidth: 400,
              mx: 'auto',
              fontSize: layout.fontSizeMedium,
            }}
          >
            <Typography variant="body1" fontWeight="medium" sx={{ fontSize: layout.fontSizeMedium, mb: 1 }}>
              Chưa có thông tin giấy báo dự thi
            </Typography>
            <Typography variant="body2" sx={{ fontSize: layout.fontSizeSmall, lineHeight: 1.4 }}>
              Bạn chưa có thông tin giấy báo dự thi. Vui lòng kiểm tra lại sau.
            </Typography>
          </Alert>
        </Card>
      ) : (
        Object.keys(ticketsByExam).map((examId) => {
          const examTickets = ticketsByExam[examId];
          const firstTicket = examTickets[0];
          const exam = firstTicket?.exam;
          const user = firstTicket?.user;

          return (
            <Card
              key={examId}
              sx={{
                mb: layout.spacing * 1.5,
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
                mx: isMobile ? layout.paddingSmall : 0,
              }}
            >
              <CardHeader
                title={
                  <Box>
                    <Typography
                      variant={isMobile ? 'subtitle1' : 'h6'}
                      sx={{
                        fontWeight: 700,
                        color: 'primary.dark',
                        fontSize: layout.fontSizeMedium,
                        lineHeight: 1.3,
                        mb: 1,
                      }}
                    >
                      {firstTicket?.examName || `Kỳ thi ĐGNL Đợt ${exam?.turn || ''}`}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: layout.fontSizeSmall }}
                    >
                      Địa điểm: {exam?.location || 'Không xác định'}
                    </Typography>
                  </Box>
                }
                sx={{
                  bgcolor: alpha('#104675', 0.05),
                  borderBottom: 1,
                  borderColor: 'divider',
                  py: layout.paddingSmall,
                  px: layout.paddingMedium,
                }}
              />

              <CardContent sx={{ p: isMobile ? layout.paddingSmall : 0 }}>
                {isMobile ? (
                  <Box sx={{ p: layout.paddingSmall }}>
                    <Box sx={{ mb: 3, p: 2, bgcolor: alpha('#104675', 0.02), borderRadius: 1 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Thông tin thí sinh
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: layout.fontSizeSmall }}>
                        Họ tên: {user?.fullname || 'Không xác định'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: layout.fontSizeSmall }}>
                        CCCD: {user?.cccd || 'Không xác định'}
                      </Typography>
                      <Typography variant="body2" sx={{ fontSize: layout.fontSizeSmall }}>
                        Ngày sinh: {user?.birthday || 'Không xác định'}
                      </Typography>
                    </Box>

                    {examTickets.map((ticket) => (
                      <MobileTicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </Box>
                ) : (
                  <>
                    {/* Exam Schedule Table */}
                    <TableContainer
                      component={Paper}
                      variant="outlined"
                      sx={{
                        borderRadius: 1,
                        overflow: 'auto',
                        borderColor: 'divider',
                        mb: layout.spacing,
                      }}
                    >
                      <Table size={isTablet ? 'small' : 'medium'}>
                        <TableHead>
                          <TableRow>
                            <StyledTableCell isMobile={isTablet} align="center">
                              Môn thi
                            </StyledTableCell>
                            <StyledTableCell isMobile={isTablet} align="center">
                              Ngày thi
                            </StyledTableCell>
                            <StyledTableCell isMobile={isTablet} align="center">
                              Giờ có mặt
                            </StyledTableCell>
                            <StyledTableCell isMobile={isTablet} align="center">
                              Ca thi
                            </StyledTableCell>
                            <StyledTableCell isMobile={isTablet} align="center">
                              Phòng thi
                            </StyledTableCell>
                            <StyledTableCell isMobile={isTablet} align="center">
                              Số ghế
                            </StyledTableCell>
                            <StyledTableCell isMobile={isTablet} align="center">
                              Mã phiếu
                            </StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {examTickets.map((ticket) => (
                            <StyledTableRow key={ticket.id}>
                              <StyledTableCell isMobile={isTablet} align="center">
                                <Typography variant="body2" fontWeight="medium" sx={{ fontSize: layout.fontSizeSmall }}>
                                  {ticket.subject}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell isMobile={isTablet} align="center">
                                <Typography variant="body2" sx={{ fontSize: layout.fontSizeSmall }}>
                                  {ticket.date}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell isMobile={isTablet} align="center">
                                <Typography variant="body2" sx={{ fontSize: layout.fontSizeSmall }}>
                                  {ticket.time}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell isMobile={isTablet} align="center">
                                <Typography variant="body2" sx={{ fontSize: layout.fontSizeSmall }}>
                                  Ca {ticket.turn}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell isMobile={isTablet} align="center">
                                <Typography variant="body2" sx={{ fontSize: layout.fontSizeSmall }}>
                                  {ticket.room}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell isMobile={isTablet} align="center">
                                <Typography variant="body2" sx={{ fontSize: layout.fontSizeSmall }}>
                                  {ticket.seat}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell isMobile={isTablet} align="center">
                                <Typography variant="body2" fontWeight="medium" sx={{ fontSize: layout.fontSizeSmall, color: 'error.main' }}>
                                  {ticket.code}
                                </Typography>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                )}

                <CardActions
                  sx={{
                    justifyContent: 'flex-end',
                    px: isMobile ? layout.paddingSmall : 2,
                    pt: isMobile ? layout.paddingSmall : layout.spacing,
                  }}
                >
                  {currentUser?.cccd && (
                    <>
                      <Button
                        size={isMobile ? 'small' : 'medium'}
                        variant="contained"
                        startIcon={<SendIcon />}
                        href={`${API_URL}/export/exam-ticket/${currentUser.cccd}/${examId}`}
                        sx={{
                          borderRadius: 1,
                          fontWeight: 600,
                          fontSize: layout.fontSizeSmall,
                          minHeight: isMobile ? 32 : 48,
                        }}
                      >
                        Tải phiếu dự thi (PDF)
                      </Button>
                    </>
                  )}
                </CardActions>
              </CardContent>
            </Card>
          );
        })
      )}
    </DashboardContent>
  );
}