import { useTheme } from '@mui/material/styles';
import { Container, Typography, Box } from '@mui/material';

import { _exams } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import ExamCard from '../exam-card';

export interface Exam {
  id: string;
  title: string;
  code: string;
  fee: string;
  date: string;
  time: string;
  place: string;
  registered: number;
  capacity: number;
  deadline: string;
  description: string;
  requirement: string;
  isOpen: boolean;
  batch: string;
  school: string;
  dateRange: {
    start: string;
    end: string;
  };
  examSession: string;
  examDate: string;
  examTime: string;
  subject: string;
  notice: string;
}

interface UpcomingExamsViewProps {
  onOpenDetail?: (exam: Exam) => void;
}

export default function UpcomingExamsView({ onOpenDetail }: UpcomingExamsViewProps) {
  const theme = useTheme();

  // Hàm chuyển đổi chuỗi dd/MM/yyyy thành Date object
  const parseDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  };

  // Lấy ngày hiện tại (không tính giờ phút)
  const getCurrentDate = (): Date => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  // Lọc kỳ thi: chỉ hiển thị những kỳ thi đang mở VÀ còn thời hạn đăng ký
  const currentDate = getCurrentDate();

  const filteredExams = _exams.filter((exam) => {
    // Điều kiện 1: Phải đang mở đăng ký
    if (!exam.isOpen) return false;

    // Điều kiện 2: Deadline phải >= hôm nay
    try {
      const deadlineDate = parseDate(exam.deadline);
      return deadlineDate >= currentDate;
    } catch (error) {
      console.error('Error parsing date:', exam.deadline, error);
      return false;
    }
  });

  return (
    <DashboardContent>
      <Box>
        <Box
          sx={{
            mb: 5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Các kỳ thi sắp diễn ra
          </Typography>
          {/* <Typography variant="body1" color="text.secondary">
            Xem thông tin chi tiết và đăng ký tham gia các kỳ thi sắp tới
          </Typography> */}
        </Box>
        {/* <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h2"
            sx={{ mb: 1, color: theme.palette.primary.main, fontWeight: 'bold' }}
          >
            CÁC KỲ THI SẮP DIỄN RA
          </Typography>
          
        </Box> */}

        {filteredExams.length > 0 ? (
          <Box>
            {/* <Typography variant="h4" sx={{ mb: 3, color: theme.palette.primary.main }}>
              Đang mở đăng ký
            </Typography> */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {filteredExams.map((exam) => (
                <ExamCard key={exam.id} exam={exam} onOpenDetail={onOpenDetail} />
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
              Hiện không có kỳ thi nào đang mở đăng ký
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vui lòng quay lại sau để xem các kỳ thi mới
            </Typography>
          </Box>
        )}
      </Box>
    </DashboardContent>
  );
}
