import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import InfoIcon from "@mui/icons-material/Info";
import PaidIcon from "@mui/icons-material/Paid";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Container,
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";
// Services
import { getNewOrderCode, postOrderDetails } from "src/services/orderService";
import { getExams, getTurnsByExam, getBookedTurnsByExam } from "src/services/examService";

// Types
interface Exam {
  id: number;
  name: string;
  msg?: string;
  status: string;
  turn?: string;
  location?: string;
  openAt?: string;
  closeAt?: string;
}

interface Subject {
  id: number;
  name: string;
  price: string;
  availableSlots: number;
  maxSlots: number;
}

interface Turn {
  turn: number;
  date: string;
  time: string;
  visible: number;
  subjects: Subject[];
}

interface SelectedSubject {
  turn: number;
  date: string;
  time: string;
  subject: string;
  price: number;
}

// Subject name mapping
const subjectName = ["", "Toán học", "Vật lí", "Hóa học", "Sinh học", "Ngữ văn", "Tiếng Anh"];

export function ExamView() {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state: any) => state.auth);
  
  // Refs
  const descriptionElementRef = useRef<HTMLDivElement>(null);
  
  // State
  const [orderCode, setOrderCode] = useState<string>("");
  const [exams, setExams] = useState<Exam[]>([]);
  const [exam, setExam] = useState<Exam | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [selectedTurns, setSelectedTurns] = useState<number[]>([]);
  const [bookedTurns, setBookedTurns] = useState<number[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<SelectedSubject[]>([]);
  const [codeArr, setCodeArr] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  
  // Dialog state
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Loading states
  const [loading, setLoading] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loadingExams, setLoadingExams] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(5);

  // Timer effect for payment processing
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    
    if (loading && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft <= 0 && loading) {
      if (timer) clearInterval(timer);
      handlePaymentClick();
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading, timeLeft]);

  // Auto-select exam if only one OPEN exam exists
  useEffect(() => {
    const openExams = exams.filter((item) => item.status === "OPEN");
    
    if (openExams.length === 1) {
      handleChangeExam({ target: { value: openExams[0] } } as SelectChangeEvent<Exam>);
    }
  }, [exams]);

  // Fetch exams on component mount
  useEffect(() => {
    const fetchExams = async () => {
      if (isLoggedIn) {
        setLoadingExams(true);
        try {
          const response = await getExams();
          setExams(response.data || []);
          
          // Restore selected turns from localStorage
          const savedTurns = localStorage.getItem("selectedTurns");
          if (savedTurns && savedTurns.length > 0) {
            try {
              setSelectedTurns(JSON.parse(savedTurns));
            } catch (error) {
              console.error("Error parsing saved turns:", error);
            }
          }
        } catch (error: any) {
          console.error("Error fetching exams:", error);
        } finally {
          setLoadingExams(false);
        }
      }
    };
    
    fetchExams();
  }, [isLoggedIn]);

  // Save selected turns to localStorage
  useEffect(() => {
    if (selectedTurns.length > 0) {
      localStorage.setItem("selectedTurns", JSON.stringify(selectedTurns));
    }
  }, [selectedTurns]);

  // Focus dialog content when opened
  useEffect(() => {
    if (openDialog && descriptionElementRef.current) {
      descriptionElementRef.current.focus();
    }
  }, [openDialog]);

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    navigate("/sign-in");
    return null;
  }

  // Calculate selected subjects and total price
  const getSelectedSubjects = () => {
    const newSelectedSubjects: SelectedSubject[] = [];
    const newCodeArr: number[] = [];
    let priceTotal = 0;
    
    const sortedTurns = [...selectedTurns].sort((a, b) => a - b);
    
    for (const item of sortedTurns) {
      const examId = Math.floor(item / 100);
      if (exam && examId !== exam.id) continue;
      
      const turnNum = Math.floor((item % 100) / 10);
      const subjectId = item % 10;
      
      const turnObj = turns.find((ele) => ele.turn === turnNum);
      if (!turnObj) continue;
      
      const subjectObj = turnObj.subjects.find((ele) => ele.id === subjectId);
      if (!subjectObj) continue;
      
      priceTotal += parseInt(subjectObj.price, 10);
      
      newSelectedSubjects.push({
        turn: turnObj.turn,
        date: turnObj.date,
        time: turnObj.time,
        subject: subjectName[subjectObj.id] || `Môn ${subjectObj.id}`,
        price: parseInt(subjectObj.price, 10),
      });
      
      newCodeArr.push(item);
    }
    
    setSelectedSubjects(newSelectedSubjects);
    setCodeArr(newCodeArr);
    setTotalPrice(priceTotal);
  };

  // Check if a turn is selected
  const checkSelectedTurn = (index: number): boolean => selectedTurns.includes(index);

  // Check if a turn is booked
  const checkBookedTurn = (index: number): boolean => {
    const examId = Math.floor(index / 100);
    const turnNum = Math.floor((index % 100) / 10);
    const subjectId = index % 10;
    
    for (const item of bookedTurns) {
      const itemExamId = Math.floor(item / 100);
      const itemTurnNum = Math.floor((item % 100) / 10);
      const itemSubjectId = item % 10;
      
      if (
        examId === itemExamId &&
        ((item > examId * 100 + turnNum * 10 && 
          item < examId * 100 + (turnNum + 1) * 10) || 
          itemSubjectId === subjectId)
      ) {
        return true;
      }
    }
    return false;
  };

  // Handle exam selection
  const handleChangeExam = async (event: SelectChangeEvent<Exam>) => {
    const selectedExam = event.target.value as Exam;
    setExam(selectedExam);
    setLoadingExams(true);
    
    try {
      // Fetch turns for selected exam
      const turnsResponse = await getTurnsByExam(selectedExam.id);
      setTurns(turnsResponse.data || []);
      
      // Fetch booked turns for selected exam
      const bookedResponse = await getBookedTurnsByExam(selectedExam.id);
      setBookedTurns(bookedResponse.data || []);
      
      // Update selected subjects
      getSelectedSubjects();
    } catch (error: any) {
      console.error("Error fetching exam data:", error);
    } finally {
      setLoadingExams(false);
    }
  };

  // Handle subject selection
  const handleSubjectClick = (code: number) => {
    const examId = Math.floor(code / 100);
    const turnNum = Math.floor((code % 100) / 10);
    const subjectId = code % 10;
    
    if (selectedTurns.includes(code)) {
      // Remove if already selected
      setSelectedTurns((current) =>
        current.filter((item) => item !== code)
      );
    } else {
      // Add new selection, removing conflicting ones
      setSelectedTurns((current) => {
        const filtered = current.filter((item) => {
          const itemExamId = Math.floor(item / 100);
          const itemTurnNum = Math.floor((item % 100) / 10);
          const itemSubjectId = item % 10;
          
          // Remove if same exam and either same turn or same subject
          return !(
            examId === itemExamId &&
            ((item > examId * 100 + turnNum * 10 && 
              item < examId * 100 + (turnNum + 1) * 10) || 
              itemSubjectId === subjectId)
          );
        });
        
        return [...filtered, code];
      });
    }
  };

  // Open payment dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
    getSelectedSubjects();
  };

  // Close payment dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle payment click with loading
  const handlePaymentLoading = () => {
    setIsButtonDisabled(true);
    setLoading(true);
    setTimeLeft(5);
  };

  // Process payment
  const handlePaymentClick = async () => {
    if (isSubmitting || !exam) return;
    
    setIsSubmitting(true);
    
    try {
      // Generate order code
      const orderResponse = await getNewOrderCode({ examId: exam.id });
      const newOrderCode = orderResponse.data;
      setOrderCode(newOrderCode);
      
      // Submit order details
      const orderData = {
        orderCode: newOrderCode,
        examId: exam.id,
        codeArr: codeArr,
      };
      
      const postResponse = await postOrderDetails(orderData);
      
      // Clear localStorage
      localStorage.removeItem("selectedTurns");
      localStorage.removeItem("orderCode");
      
      // Navigate to payment page
      navigate(`/payment/${import.meta.env.VITE_APP_SERVICE || "DGNL"}/${postResponse.orderCode}`);
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Đã xảy ra lỗi khi xử lý thanh toán";
      
      setErrorMessage(errorMsg);
      setShowError(true);
      setIsButtonDisabled(false);
      setLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close error dialog
  const handleCloseError = () => {
    setShowError(false);
  };

  return (
    <DashboardContent maxWidth={false} sx={{ width: "100%" }}>
      <Container maxWidth="xl" sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          Cổng dịch vụ tuyển sinh HCMUE
        </Typography>

        {/* Exam Selection Card */}
        <Card sx={{ mb: 3, p: 2, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            <SchoolIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Chọn kỳ thi
          </Typography>
          
          {exams.length > 0 ? (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="exam-select-label">Chọn kỳ thi</InputLabel>
              <Select
                labelId="exam-select-label"
                id="exam-select"
                label="Chọn kỳ thi"
                value={exam || ""}
                onChange={handleChangeExam}
                disabled={loadingExams}
              >
                {exams
                  .filter((item) => item.status === "OPEN")
                  .map((item, index) => (
                    <MenuItem key={index} value={item as any}>
                      {item.name} {item.msg || ""}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          ) : (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">Chưa có thông tin kỳ thi</Typography>
            </Alert>
          )}
        </Card>

        {/* Information Alert */}
        {exam && turns.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#e8f4fd",
              display: "flex",
              alignItems: "center",
              mb: 3,
            }}
          >
            <InfoIcon sx={{ color: "#0288d1", mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Vui lòng nhấn chọn vào môn thi để đăng ký
            </Typography>
          </Box>
        )}

        {/* Exam Turns Grid - 4 Columns with Box */}
        {exam && turns.length > 0 && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3,
              width: '100%',
            }}
          >
            {turns.map((turn) => {
              if (turn.visible <= 0) return null;
              
              return (
                <Card
                  key={turn.turn}
                  sx={{
                    height: "100%",
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      Ca thi: {turn.turn}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <EventIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2">
                        Ngày thi: <strong>{turn.date}</strong>
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2">
                        Giờ có mặt: <strong>{turn.time}</strong>
                      </Typography>
                    </Box>

                    {/* Subjects List */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {turn.subjects.map((subject) => {
                        if (subject.maxSlots <= 0) return null;
                        
                        const code = exam.id * 100 + turn.turn * 10 + subject.id;
                        const isSelected = checkSelectedTurn(code);
                        const isBooked = checkBookedTurn(code);
                        const subjectDisabled = isBooked || subject.availableSlots === 0;
                        
                        return (
                          <Button
                            key={subject.id}
                            variant={isSelected ? "contained" : "outlined"}
                            color="primary"
                            fullWidth
                            sx={{
                              borderRadius: 2,
                              py: 1,
                              justifyContent: "space-between",
                              opacity: subjectDisabled ? 0.6 : 1,
                              minHeight: "48px",
                            }}
                            onClick={() => !subjectDisabled && handleSubjectClick(code)}
                            disabled={subjectDisabled}
                          >
                            <Typography variant="body2" fontWeight={500}>
                              {subjectName[subject.id] || `Môn ${subject.id}`}
                            </Typography>
                            
                            <Chip
                              icon={<GroupIcon sx={{ fontSize: 16 }} />}
                              label={subject.availableSlots}
                              size="small"
                              sx={{
                                ml: 1,
                                backgroundColor: isSelected ? "#fff" : "#e3f2fd",
                                color: isSelected ? "#1976d2" : "#1976d2",
                                fontWeight: 500,
                              }}
                            />
                          </Button>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}

        {/* Submit Button - Bottom */}
        {exam && selectedTurns.length > 0 && (
          <Box sx={{ textAlign: "right", mt: 4 }}>
            <Button
              variant="contained"
              color="warning"
              onClick={handleOpenDialog}
              startIcon={<PaidIcon />}
              sx={{ px: 4, py: 1.2, fontWeight: 600 }}
            >
              Nộp lệ phí thi
            </Button>
          </Box>
        )}

        {/* Payment Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="subtitle1" component="div" fontWeight="bold">
              Kỳ thi: {exam?.name || ""}
            </Typography>
            <Typography variant="body2" component="div" color="text.secondary">
              Ngày đăng ký: {dayjs().format("DD/MM/YYYY HH:mm:ss")}
            </Typography>
          </DialogTitle>
          
          <DialogContent dividers>
            <TableContainer ref={descriptionElementRef}>
              <Table>
                <TableBody>
                  {selectedSubjects.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {row.subject}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.date} - Ca {row.turn}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {new Intl.NumberFormat("vi-VN").format(row.price)} đ
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  <TableRow>
                    <TableCell>
                      <Typography variant="body1" fontWeight="bold" color="primary">
                        Tổng lệ phí
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" fontWeight="bold" color="error">
                        {new Intl.NumberFormat("vi-VN").format(totalPrice)} đ
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Lưu ý: bạn cần hoàn tất việc thanh toán lệ phí trong vòng 24 giờ tính từ ngày đăng ký!
              </Typography>
            </Alert>
          </DialogContent>
          
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button variant="outlined" onClick={handleCloseDialog}>
              Quay lại
            </Button>
            <Button
              variant="contained"
              color="warning"
              onClick={handlePaymentLoading}
              disabled={isButtonDisabled || loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? (
                `Đang xử lý... (${timeLeft}s)`
              ) : (
                "Nộp lệ phí thi"
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Error Dialog */}
        <Dialog open={showError} onClose={handleCloseError}>
          <DialogTitle>Đăng ký thất bại</DialogTitle>
          <DialogContent>
            <Alert severity="error" onClose={handleCloseError}>
              {errorMessage}
            </Alert>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseError} color="primary">
              Quay lại
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </DashboardContent>
  );
}