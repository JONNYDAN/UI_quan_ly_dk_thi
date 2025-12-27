import MD5 from 'crypto-js/md5';
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
import SendIcon from '@mui/icons-material/Send';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import InfoIcon from '@mui/icons-material/Info';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import DialogTitle from '@mui/material/DialogTitle';
import DownloadIcon from '@mui/icons-material/Download';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CircularProgress from '@mui/material/CircularProgress';
import { alpha, styled, useTheme } from '@mui/material/styles';
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';

import { DashboardContent } from 'src/layouts/dashboard';
import { getExamResults, getReexamResults } from 'src/services/examService';
import { getUserReOrders, getConfirmKhaoSat } from 'src/services/userService';

// ----------------------------------------------------------------------

// Types
interface RootState {
  auth: {
    user: any;
    isLoggedIn: boolean;
  };
}

interface ExamResultItem {
  subject: string;
  result: string;
  link?: string;
  price?: number;
  id?: number;
  turn?: number;
  [key: string]: any;
}

interface ExamData {
  exam: {
    id: number;
    turn: string;
    location: string;
    code: string;
    openAt: string;
    closeAt: string;
    [key: string]: any;
  };
  results: ExamResultItem[];
  link?: string;
  status?: string;
  open?: string;
  close?: string;
  amount?: number;
  [key: string]: any;
}

interface ReexamResult {
  subject: string;
  result: string;
  [key: string]: any;
}

interface Order {
  id: number;
  [key: string]: any;
}

// ----------------------------------------------------------------------

// Styled Components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${theme.components?.MuiTableCell?.styleOverrides?.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 14,
    fontWeight: 600,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      fontSize: 12,
    },
  },
  [`&.${theme.components?.MuiTableCell?.styleOverrides?.body}`]: {
    fontSize: 14,
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
      fontSize: 13,
    },
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

const ResultCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const SubjectChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  fontSize: '0.75rem',
  [theme.breakpoints.up('sm')]: {
    fontSize: '0.8125rem',
  },
  '&.math': { backgroundColor: alpha('#3f51b5', 0.1), color: '#3f51b5' },
  '&.physics': { backgroundColor: alpha('#f44336', 0.1), color: '#f44336' },
  '&.chemistry': { backgroundColor: alpha('#4caf50', 0.1), color: '#4caf50' },
  '&.biology': { backgroundColor: alpha('#9c27b0', 0.1), color: '#9c27b0' },
  '&.literature': { backgroundColor: alpha('#ff9800', 0.1), color: '#ff9800' },
  '&.english': { backgroundColor: alpha('#2196f3', 0.1), color: '#2196f3' },
}));

// Mobile table cell component
const MobileTableCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.main, 0.02),
  },
}));

// ----------------------------------------------------------------------

export function ExamResultView() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { user: currentUser, isLoggedIn } = useSelector((state: RootState) => state.auth);
  
  // States
  const [examDataList, setExamDataList] = useState<ExamData[]>([]);
  const [reexamResults, setReexamResults] = useState<ReexamResult[]>([]);
  const [reexamLink, setReexamLink] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingExamResult, setLoadingExamResult] = useState<boolean>(false);
  const [info, setInfo] = useState<string>('');
  const [confirmStatus, setConfirmStatus] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [showReExamButton, setShowReExamButton] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  // Constants
  const subjects = [
    { name: 'Toán học', key: 'math', shortName: 'Toán' },
    { name: 'Vật lí', key: 'physics', shortName: 'Lí' },
    { name: 'Hóa học', key: 'chemistry', shortName: 'Hóa' },
    { name: 'Sinh học', key: 'biology', shortName: 'Sinh' },
    { name: 'Ngữ văn', key: 'literature', shortName: 'Văn' },
    { name: 'Tiếng Anh', key: 'english', shortName: 'Anh' },
  ];
  
  const md5CCCD = currentUser?.cccd ? MD5(currentUser.cccd + 'Q').toString() : '';

  // ----------------------------------------------------------------------

  const goToLogin = useCallback(() => {
    navigate('/login');
  }, [navigate]);

  const fetchExamData = useCallback(async () => {
    if (!currentUser?.cccd) return;
    
    try {
      setLoadingExamResult(true);
      setError('');
      
      // Fetch user re-orders (for re-exam button)
      try {
        const ordersResponse = await getUserReOrders();
        console.log('Re-orders response:', ordersResponse);
        
        if (ordersResponse?.data?.data) {
          const orderList = ordersResponse.data.data;
          setOrders(orderList);
          setShowReExamButton(orderList.length > 0);
        } else {
          setOrders([]);
          setShowReExamButton(false);
        }
      } catch (orderError: any) {
        console.warn('Failed to fetch re-orders:', orderError);
        setOrders([]);
        setShowReExamButton(false);
      }

      // Fetch confirm khaosat
      try {
        const confirmResponse = await getConfirmKhaoSat(md5CCCD, currentUser.cccd);
        console.log('Confirm response:', confirmResponse);
        
        if (confirmResponse?.status) {
          setConfirmStatus(confirmResponse?.status);
        } else {
          setConfirmStatus('');
        }
      } catch (confirmError: any) {
        console.warn('Failed to fetch confirm status:', confirmError);
        setConfirmStatus('');
      }

      // Only fetch exam results if confirmed
      if (confirmStatus === '1') {
        // Fetch exam results
        try {
          const examResultsResponse = await getExamResults(currentUser.cccd);
          console.log('Exam results response:', examResultsResponse);
          
          if (examResultsResponse?.exams) {
            const examData = examResultsResponse.exams;
            
            if (!examData || examData.length === 0) {
              setInfo('Chưa có thông tin về điểm thi.');
              setExamDataList([]);
            } else {
              setExamDataList(examData);
              setInfo('');
            }
          } else {
            setExamDataList([]);
            setInfo('Chưa có thông tin về điểm thi.');
          }
        } catch (examError: any) {
          console.error('Error fetching exam results:', examError);
          setInfo('Không thể tải kết quả thi. Vui lòng thử lại sau.');
          setExamDataList([]);
        }

        // Fetch re-exam results
        try {
          const reexamResponse = await getReexamResults(currentUser.cccd);
          console.log('Re-exam results response:', reexamResponse);
          
          // NOTE: Based on the API response, it returns 'exams' instead of 'results'
          // We need to check the correct response structure
          if (reexamResponse?.data?.exams) {
            // API returned exams data (wrong structure)
            console.warn('Re-exam API returned exams data, not results');
            setReexamResults([]);
            setReexamLink('');
          } else if (reexamResponse?.data?.results) {
            // Correct structure with results
            const reexamData = reexamResponse.data.results;
            
            if (reexamData && reexamData.length > 0) {
              setReexamLink(reexamResponse.data?.link || '');
              setReexamResults(reexamData);
            } else {
              setReexamResults([]);
              setReexamLink('');
            }
          } else {
            // No re-exam data
            setReexamResults([]);
            setReexamLink('');
          }
        } catch (reexamError: any) {
          console.warn('Failed to fetch re-exam results:', reexamError);
          setReexamResults([]);
          setReexamLink('');
        }
      }
    } catch (fetchError: any) {
      console.error('Error fetching exam data:', fetchError);
      setError(fetchError.message || 'Không thể tải dữ liệu kết quả thi.');
    } finally {
      setLoading(false);
      setLoadingExamResult(false);
    }
  }, [currentUser, md5CCCD, confirmStatus]);

  useEffect(() => {
    if (!isLoggedIn) {
      goToLogin();
      return undefined;
    }
    
    fetchExamData();
    
    // Cleanup
    return () => {
      setLoading(true);
      setLoadingExamResult(false);
    };
  }, [isLoggedIn, goToLogin, fetchExamData]);

  // ----------------------------------------------------------------------

  if (!isLoggedIn) {
    goToLogin();
    return null;
  }

  const formatScore = (score: string): string => 
  score.replace(',', '.');

  const renderSubjectChips = () => (
    <Box sx={{ 
      display: 'flex', 
      flexWrap: 'wrap', 
      justifyContent: 'center', 
      gap: 0.5, 
      mb: 3,
      px: isMobile ? 1 : 0 
    }}>
      {subjects.map((subject) => (
        <SubjectChip
          key={subject.key}
          label={isMobile ? subject.shortName : subject.name}
          className={subject.key}
          size="small"
          variant="outlined"
        />
      ))}
    </Box>
  );

  // Mobile table view
  const renderMobileTable = (results: ExamResultItem[]) => (
    <Box sx={{ mb: 3 }}>
      <Paper 
        variant="outlined"
        sx={{ 
          borderRadius: 2,
          overflow: 'hidden',
          borderColor: 'divider',
        }}
      >
        {subjects.map((subject) => {
          const result = results.find((r) => r.subject === subject.name);
          const rawScore = result?.result || '-';
          const score = formatScore(rawScore);
          const isNumeric = !isNaN(parseFloat(score)) && isFinite(Number(score));
          
          return (
            <MobileTableCell key={subject.key}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SubjectChip
                  label={subject.shortName}
                  className={subject.key}
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 50 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {subject.name}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography 
                  sx={{ 
                    fontWeight: isNumeric ? 700 : 500,
                    fontSize: isNumeric ? '1.1rem' : '1rem',
                    color: isNumeric ? 'primary.main' : 'text.secondary',
                  }}
                >
                  {rawScore}
                </Typography>
                {isNumeric && (
                  <Typography variant="caption" color="text.secondary">
                    điểm
                  </Typography>
                )}
              </Box>
            </MobileTableCell>
          );
        })}
      </Paper>
    </Box>
  );

  // Desktop table view
  const renderDesktopTable = (results: ExamResultItem[]) => (
    <TableContainer 
      component={Paper} 
      variant="outlined"
      sx={{ 
        borderRadius: 2,
        overflow: 'hidden',
        borderColor: 'divider',
        mb: 3,
        width: '100%',
        overflowX: 'auto',
      }}
    >
      <Table sx={{ minWidth: isTablet ? 600 : 800 }}>
        <TableHead>
          <TableRow>
            {subjects.map((subject) => (
              <StyledTableCell 
                key={subject.key} 
                align="center"
                sx={{ 
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.common.white,
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}
              >
                {subject.name}
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            {subjects.map((subject) => {
              const result = results.find((r) => r.subject === subject.name);
              const rawScore = result?.result || '-';
              const score = formatScore(rawScore);
              const isNumeric = !isNaN(parseFloat(score)) && isFinite(Number(score));
              
              return (
                <StyledTableCell 
                  key={subject.key} 
                  align="center"
                  sx={{ 
                    fontWeight: isNumeric ? 700 : 500,
                    fontSize: isNumeric ? '1.1rem' : '1rem',
                    color: isNumeric ? 'primary.main' : 'text.secondary',
                    position: 'relative',
                    minWidth: isTablet ? 80 : 100
                  }}
                >
                  {rawScore}
                  {isNumeric && (
                    <Typography 
                      variant="caption" 
                      color="text.secondary" 
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      điểm
                    </Typography>
                  )}
                </StyledTableCell>
              );
            })}
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderExamResultTable = (results: ExamResultItem[]) => {
    if (isMobile) {
      return renderMobileTable(results);
    }
    return renderDesktopTable(results);
  };

  const renderActionButtons = (item: ExamData) => (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      flexWrap: 'wrap',
      justifyContent: { xs: 'center', md: 'flex-end' }
    }}>
      {item.link && (
        <Button
          size={isMobile ? "small" : "medium"}
          variant="contained"
          color="success"
          startIcon={<DownloadIcon />}
          href={item.link}
          target="_blank"
          sx={{ 
            borderRadius: 2,
            fontWeight: 600,
            px: isMobile ? 2 : 3,
            py: isMobile ? 0.75 : 1,
            fontSize: isMobile ? '0.875rem' : '0.9375rem'
          }}
        >
          Tải Phiếu điểm
        </Button>
      )}
      
      {item.status === 'OPEN' && (
        <Button
          size={isMobile ? "small" : "medium"}
          variant="outlined"
          color="secondary"
          startIcon={<AssignmentIcon />}
          onClick={() => navigate(`/phuckhao/${item.exam.id}`)}
          sx={{ 
            borderRadius: 2,
            fontWeight: 600,
            px: isMobile ? 2 : 3,
            py: isMobile ? 0.75 : 1,
            borderWidth: 2,
            fontSize: isMobile ? '0.875rem' : '0.9375rem',
            '&:hover': { borderWidth: 2 }
          }}
        >
          Đăng ký phúc khảo
        </Button>
      )}
    </Box>
  );

  // ----------------------------------------------------------------------

  return (
    <DashboardContent>
      <Box sx={{ px: { xs: 1, sm: 2, md: 0 } }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 1, 
              color: 'primary.main', 
              fontWeight: 700,
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Kết quả dự thi
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '0.875rem', md: '1rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Xem và quản lý kết quả thi của bạn
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-icon': { alignItems: 'center' }
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Main Content */}
        <ResultCard>
          <CardHeader
            title={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ChecklistRtlIcon color="primary" />
                <Typography variant="h6" fontWeight={600} fontSize={isMobile ? '1rem' : '1.125rem'}>
                  Thông tin kết quả thi
                </Typography>
              </Box>
            }
            action={
              showReExamButton && !isMobile && (
                <Button
                  variant="contained"
                  color="warning"
                  size={isMobile ? "small" : "medium"}
                  startIcon={<AssignmentIcon />}
                  onClick={() => navigate('/re-examinfo')}
                  sx={{ 
                    borderRadius: 2,
                    fontWeight: 600,
                    px: isMobile ? 2 : 3,
                    display: { xs: 'none', sm: 'flex' }
                  }}
                >
                  Kết quả đăng ký phúc khảo
                </Button>
              )
            }
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              borderBottom: `1px solid ${theme.palette.divider}`,
              py: isMobile ? 1.5 : 2.5,
              px: isMobile ? 2 : 3
            }}
          />
          
          {showReExamButton && isMobile && (
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Button
                fullWidth
                variant="contained"
                color="warning"
                size="small"
                startIcon={<AssignmentIcon />}
                onClick={() => navigate('/re-examinfo')}
                sx={{ 
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                Kết quả đăng ký phúc khảo
              </Button>
            </Box>
          )}
          
          <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
            {/* Survey Section */}
            {confirmStatus === '' && (
              <Box sx={{ mb: 4 }}>
                <Alert 
                  severity="info" 
                  icon={<InfoIcon />}
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.info.light}`,
                    '& .MuiAlert-icon': { alignItems: 'center' }
                  }}
                >
                  <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                    Vui lòng hoàn thành khảo sát trước khi xem kết quả thi
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Khảo sát giúp chúng tôi cải thiện chất lượng dịch vụ
                  </Typography>
                  <Button
                    size="medium"
                    color="primary"
                    variant="contained"
                    startIcon={<SendIcon />}
                    href={`https://docs.google.com/forms/d/e/1FAIpQLSeOe9LZuo_7a25uIyXEGJLgE0nFQF9217r_psMinKfwzMn6nA/viewform?usp=pp_url&entry.868646108=${md5CCCD}`}
                    target="_blank"
                    sx={{ 
                      borderRadius: 2,
                      fontWeight: 600,
                      px: 3
                    }}
                  >
                    Thực hiện khảo sát ngay
                  </Button>
                </Alert>
                
                <Card 
                  sx={{ 
                    p: isMobile ? 2 : 3, 
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
                    bgcolor: alpha(theme.palette.info.main, 0.02)
                  }}
                >
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    <strong>Lưu ý:</strong> Sau khi hoàn thành khảo sát, vui lòng:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                    <Typography component="li" variant="body2" color="text.secondary">
                      Nhấn nút Gửi trong biểu mẫu khảo sát
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary">
                      Quay lại trang này và tải lại trang
                    </Typography>
                    <Typography component="li" variant="body2" color="text.secondary">
                      Kết quả thi sẽ được hiển thị sau khi hệ thống xác nhận
                    </Typography>
                  </Box>
                </Card>
              </Box>
            )}

            {/* Exam Results */}
            {confirmStatus === '1' && (
              <>
                {/* Regular Exam Results */}
                {examDataList.length > 0 ? (
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 3, 
                        color: 'primary.main',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: { xs: '1.125rem', sm: '1.25rem' }
                      }}
                    >
                      <ChecklistRtlIcon />
                      Kết quả thi chính thức
                    </Typography>
                    
                    {examDataList.map((item, idx) => (
                      <Box key={idx} sx={{ mb: idx < examDataList.length - 1 ? 6 : 4 }}>
                        {/* Exam Header */}
                        <Box sx={{ mb: 3 }}>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              mb: 1, 
                              color: 'primary.dark',
                              fontWeight: 600,
                              fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' }
                            }}
                          >
                            Đợt {item.exam.turn} tại {item.exam.location} ({item.exam.code})
                          </Typography>
                          <Box sx={{ 
                            display: 'flex', 
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: { xs: 0.5, sm: 2 },
                            alignItems: { xs: 'flex-start', sm: 'center' }
                          }}>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9rem' }
                              }}
                            >
                              📅 Từ {item.exam.openAt}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9rem' }
                              }}
                            >
                              📅 Đến {item.exam.closeAt}
                            </Typography>
                          </Box>
                          
                          {/* Re-exam period info if available */}
                          {item.open && item.close && (
                            <Alert 
                              severity="info" 
                              sx={{ 
                                mt: 2,
                                borderRadius: 1,
                                fontSize: '0.8125rem',
                                py: 0.5
                              }}
                            >
                              <Typography variant="body2">
                                <strong>Thời gian phúc khảo:</strong> {item.open} - {item.close}
                              </Typography>
                            </Alert>
                          )}
                        </Box>

                        {/* Subject Chips */}
                        {/* {renderSubjectChips()} */}

                        {/* Results Table */}
                        {renderExamResultTable(item.results)}

                        {/* Action Buttons */}
                        {renderActionButtons(item)}

                        {/* Divider */}
                        {idx < examDataList.length - 1 && (
                          <Divider sx={{ my: 4, borderColor: 'divider' }} />
                        )}
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Alert 
                    severity="info" 
                    icon={<InfoIcon />}
                    sx={{ 
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.info.light}`,
                      '& .MuiAlert-icon': { alignItems: 'center' }
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {info || 'Chưa có thông tin về điểm thi. Vui lòng quay lại sau.'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Kết quả thi sẽ được cập nhật sau khi kỳ thi kết thúc và được xử lý.
                    </Typography>
                  </Alert>
                )}

                {/* Re-exam Results */}
                {reexamResults.length > 0 && (
                  <Box sx={{ mt: 6, pt: 4, borderTop: `2px dashed ${theme.palette.divider}` }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 3, 
                        color: 'secondary.main',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        fontSize: { xs: '1.125rem', sm: '1.25rem' }
                      }}
                    >
                      <AssignmentIcon />
                      Kết quả phúc khảo
                    </Typography>

                    <Alert 
                      severity="success" 
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        border: `1px solid ${theme.palette.success.light}`,
                        '& .MuiAlert-icon': { alignItems: 'center' }
                      }}
                    >
                      <Typography variant="body2" fontWeight={500}>
                        Kết quả phúc khảo đã được cập nhật
                      </Typography>
                    </Alert>

                    {/* Subject Chips */}
                    {renderSubjectChips()}

                    {/* Re-exam Results Table */}
                    {renderExamResultTable(reexamResults)}

                    {/* Re-exam Download Button */}
                    {reexamLink && (
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: { xs: 'center', md: 'flex-end' }
                      }}>
                        <Button
                          size={isMobile ? "small" : "medium"}
                          variant="contained"
                          color="secondary"
                          startIcon={<DownloadIcon />}
                          href={reexamLink}
                          target="_blank"
                          sx={{ 
                            borderRadius: 2,
                            fontWeight: 600,
                            px: isMobile ? 2 : 3,
                            py: isMobile ? 0.75 : 1,
                            bgcolor: 'secondary.main',
                            fontSize: isMobile ? '0.875rem' : '0.9375rem',
                            '&:hover': { bgcolor: 'secondary.dark' }
                          }}
                        >
                          Tải Phiếu điểm Phúc khảo
                        </Button>
                      </Box>
                    )}
                  </Box>
                )}

                {/* No Results Message */}
                {examDataList.length === 0 && reexamResults.length === 0 && (
                  <Card 
                    sx={{ 
                      p: isMobile ? 3 : 4, 
                      textAlign: 'center',
                      border: `1px dashed ${theme.palette.divider}`,
                      borderRadius: 2,
                      bgcolor: alpha(theme.palette.primary.main, 0.02)
                    }}
                  >
                    <Box sx={{ 
                      width: isMobile ? 50 : 60, 
                      height: isMobile ? 50 : 60, 
                      borderRadius: '50%', 
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2
                    }}>
                      <ChecklistRtlIcon color="primary" />
                    </Box>
                    <Typography 
                      variant="h6" 
                      color="text.secondary" 
                      sx={{ mb: 2, fontWeight: 500, fontSize: { xs: '1rem', sm: '1.125rem' } }}
                    >
                      Chưa có dữ liệu kết quả
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Kết quả thi sẽ được cập nhật sau khi kỳ thi kết thúc và được xử lý.
                      Vui lòng quay lại sau.
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={fetchExamData}
                      size={isMobile ? "small" : "medium"}
                      sx={{ borderRadius: 2 }}
                    >
                      Tải lại dữ liệu
                    </Button>
                  </Card>
                )}
              </>
            )}

            {/* Already Completed Survey but no data */}
            {confirmStatus === '1' && examDataList.length === 0 && !loadingExamResult && (
              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.info.light}`,
                  '& .MuiAlert-icon': { alignItems: 'center' }
                }}
              >
                <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                  Bạn đã hoàn thành khảo sát. Tuy nhiên, hiện chưa có kết quả thi.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kết quả sẽ được cập nhật sau khi kỳ thi kết thúc và được xử lý.
                </Typography>
              </Alert>
            )}
          </CardContent>
          
          <CardActions sx={{ 
            justifyContent: 'space-between',
            p: isMobile ? 2 : 2.5,
            bgcolor: alpha(theme.palette.primary.main, 0.02),
            borderTop: `1px solid ${theme.palette.divider}`,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 }
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
              * Mọi thắc mắc vui lòng liên hệ bộ phận hỗ trợ
            </Typography>
            <Button
              size="small"
              variant="text"
              onClick={fetchExamData}
              disabled={loadingExamResult}
              sx={{ minWidth: 'auto' }}
            >
              {loadingExamResult ? 'Đang tải...' : 'Làm mới dữ liệu'}
            </Button>
          </CardActions>
        </ResultCard>
      </Box>

      {/* Loading Dialog */}
      <Dialog
        open={loadingExamResult}
        disableEscapeKeyDown
        PaperProps={{
          sx: {
            width: { xs: 280, md: 320 },
            maxWidth: { xs: 280, md: 320 },
            borderRadius: 3,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            textAlign: 'center', 
            pb: 2,
            fontWeight: 600,
            fontSize: '1.1rem',
            color: 'primary.main'
          }}
        >
          Đang tải dữ liệu kết quả thi...
        </DialogTitle>
        <DialogContent sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          py: 2 
        }}>
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ color: 'primary.main' }}
          />
        </DialogContent>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ textAlign: 'center', mt: 1 }}
        >
          Vui lòng đợi trong giây lát
        </Typography>
      </Dialog>
    </DashboardContent>
  );
}