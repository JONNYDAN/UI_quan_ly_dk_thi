import { useTheme } from '@mui/material/styles';
import { Container, Typography, Box } from '@mui/material';

import ExamCard from '../exam-card';

export interface Exam {
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
  ongoingExams: Exam;
  upcomingExams: Exam;
  onOpenDetail?: (exam: Exam) => void;
}

export default function UpcomingExamsView({ ongoingExams, upcomingExams, onOpenDetail }: UpcomingExamsViewProps) {
  const theme = useTheme();

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 5 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h3" sx={{ mb: 1, color: theme.palette.primary.main, fontWeight: 'bold' }}>
            CÁC KỲ THI SẮP DIỄN RA
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Xem thông tin chi tiết và đăng ký tham gia các kỳ thi sắp tới
          </Typography>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" sx={{ mb: 3, color: theme.palette.primary.main }}>
            Đang mở đăng ký
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 3
            }}
          >
            {[...Array(4)].map((_, index) => (
              <ExamCard key={`ongoing-${index}`} exam={ongoingExams} onOpenDetail={onOpenDetail} />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="h4" sx={{ mb: 3, color: theme.palette.primary.main }}>
            Sắp mở đăng ký
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: 3
            }}
          >
            {[...Array(4)].map((_, index) => (
              <ExamCard key={`upcoming-${index}`} exam={upcomingExams} onOpenDetail={onOpenDetail} />
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
