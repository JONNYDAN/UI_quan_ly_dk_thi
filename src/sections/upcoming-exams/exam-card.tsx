import { Icon } from '@iconify/react';
import { useState, useCallback, ReactNode } from 'react';

import {
  Box,
  Button,
  Modal,
  Typography,
  Chip,
  LinearProgress,
  Card,
  CardContent
} from '@mui/material';

import { Exam } from './view';
import PaymentModal from './payment-modal';
import DetailItem from './components/DetailItem';
import ProgressBar from './components/ProgressBar';
import ExamRegistrationModal from './exam-registration-modal';
import ExamDetailModal, { Exam as ExamDetail } from './exam-detail-modal';


interface ExamCardProps {
  exam: Exam;
  onOpenDetail?: (exam: Exam) => void;
}

// Style constants
const styles = {
  // Text styles
  title: {
    fontWeight: 800,
    color: 'text.primary',
    lineHeight: 1.4,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden' as const,
    fontSize: {
      xs: '1.15rem',
      sm: '1.1rem',
      md: '1rem',
      lg: '1rem',
      xl: '1.125rem'
    }
  },
  chip: {
    px: 1,
    py: 0.25,
    height: 'auto',
    fontWeight: 500,
    fontSize: {
      xs: '0.75rem',
      sm: '0.7rem',
      md: '0.65rem',
      lg: '0.7rem',
      xl: '0.75rem'
    }
  },
  fee: {
    lineHeight: 'normal',
    color: 'text.primary',
    fontWeight: 600,
    whiteSpace: 'nowrap' as const,
    fontSize: {
      xs: '0.9rem',
      sm: '0.85rem',
      md: '0.8rem',
      lg: '0.85rem',
      xl: '0.9rem'
    }
  },
  // Button styles
  iconButton: {
    minWidth: 'auto',
    p: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: {
      xs: '40px',
      sm: '40px',
      md: '40px',
      lg: '40px',
      xl: '44px'
    },
    height: {
      xs: '30px',
      sm: '35px',
      md: '32px',
      lg: '32px',
      xl: '36px'
    },
    '& .iconify': {
      fontSize: {
        xs: '1rem',
        sm: '1.1rem',
        md: '1rem',
        lg: '1rem',
        xl: '1.1rem'
      }
    }
  },
  actionButton: {
    minWidth: {
      xs: '80px',
      sm: '85px',
      md: '90px',
      lg: '95px',
      xl: '100px'
    },
    height: {
      xs: '30px',
      sm: '35px',
      md: '32px',
      lg: '32px',
      xl: '36px'
    },
    px: {
      xs: 1,
      sm: 1.5,
      md: 1.5,
      lg: 1.5,
      xl: 2
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.75rem',
      md: '0.75rem',
      lg: '0.75rem',
      xl: '0.8rem'
    },
    whiteSpace: 'nowrap' as const,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  // Container styles
  card: {
    height: '100%',
    borderRadius: 3,
    boxShadow: 1,
    border: '1px solid',
    borderColor: 'grey.200',
    bgcolor: 'common.white',
    transition: 'all 0.3s',
    '&:hover': { boxShadow: 3, borderColor: 'grey.300' },
    overflow: 'hidden'
  },
  cardContent: {
    p: {
      xs: 2,
      sm: 2.5,
      md: 2.5,
      lg: 3,
      xl: 3.5
    },
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  }
};

// Main Component
export default function ExamCard({ exam, onOpenDetail }: ExamCardProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  const progressValue = Math.min(100, (exam.registered / exam.capacity) * 100);
  const isExamOpen = exam.isOpen;
  const isFull = exam.registered >= exam.capacity;

  // Đảm bảo ràng buộc nút đăng ký
  const canRegister = isExamOpen && !isFull;

  // Sử dụng useCallback để đảm bảo hàm không bị tạo lại
  const handleRegisterClick = useCallback(() => {
    // Kiểm tra lại điều kiện trong hàm xử lý click
    if (!canRegister) {
      if (!isExamOpen) {
        window.alert('Đăng ký chưa mở cho kỳ thi này.');
      } else if (isFull) {
        window.alert('Số lượng đăng ký đã đầy. Không thể đăng ký thêm.');
      }
      return;
    }
    setIsRegisterModalOpen(true);
  }, [canRegister, isExamOpen, isFull]);

  const detailExam: ExamDetail = {
    id: exam.code,
    title: exam.title,
    code: exam.code,
    school: exam.school,
    date: exam.date,
    time: exam.time,
    place: exam.place,
    description: exam.description,
    deadline: exam.deadline,
    fee: exam.fee,
    registered: exam.registered,
    capacity: exam.capacity,
    isOpen: exam.isOpen,
    requirement: exam.requirement,
    notice: exam.notice
  };

  // Button variant styles
  const getButtonStyles = () => ({
    bgcolor: isExamOpen && !isFull ? 'primary.main' : 'grey.300',
    color: isExamOpen && !isFull ? 'common.white' : 'grey.600',
    '&:hover': { 
      bgcolor: isExamOpen && !isFull ? 'primary.dark' : 'grey.400' 
    },
    '&.Mui-disabled': { 
      bgcolor: 'grey.300', 
      color: 'grey.500',
      opacity: 0.7
    }
  });

  return (
    <>
      <Card sx={styles.card}>
        <CardContent sx={styles.cardContent}>
          {/* Header */}
          <Box sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: { xs: 1.5, sm: 2, md: 1.5, lg: 1.5, xl: 2 }
          }}>
            <Typography variant="h6" component="h3" sx={styles.title}>
              {exam.title}
            </Typography>

            <Chip
              label={isExamOpen ? "Đang mở" : "Sắp mở"}
              size="small"
              sx={{
                ...styles.chip,
                bgcolor: isExamOpen ? 'success.lighter' : 'warning.lighter',
                color: isExamOpen ? 'success.dark' : 'warning.dark',
              }}
            />
          </Box>

          {/* Exam Details */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 1, sm: 1.25, md: 1, lg: 1.25, xl: 1.5 },
            mb: { xs: 1.5, sm: 2, md: 2, lg: 2.5, xl: 3 },
            flexGrow: 1,
          }}>
            <DetailItem icon="solar:document-text-line-duotone" value={`Mã: ${exam.code}`} />
            <DetailItem icon="solar:calendar-line-duotone" value={`${exam.date} • ${exam.time}`} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <DetailItem 
                icon="solar:users-group-two-rounded-line-duotone" 
                value={`${exam.registered}/${exam.capacity} thí sinh`} 
              />
              <Box sx={{ pl: '1.75rem', pr: 0.5 }}>
                <ProgressBar value={progressValue} />
              </Box>
            </Box>

            <DetailItem icon="solar:calendar-line-duotone" value={`Hạn: ${exam.deadline}`} />
          </Box>

          {/* Footer */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            // pt: { xs: 1.5, sm: 1.75, md: 1.5, lg: 1.75, xl: 2 },
            borderTop: '1px solid',
            borderColor: 'grey.100'
          }}>
            <Typography sx={styles.fee}>
              {exam.fee}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{
              display: 'flex',
              gap: { xs: 1, sm: 1.25, md: 1, lg: 1.25, xl: 1.5 },
              alignItems: 'center'
            }}>
              {/* Detail Button */}
              <Button
                variant="outlined"
                onClick={() => {
                  if (onOpenDetail) {
                    onOpenDetail(exam);
                    return;
                  }
                  setIsDetailModalOpen(true);
                }}
                sx={{
                  ...styles.iconButton,
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.50',
                    borderColor: 'primary.main'
                  }
                }}
              >
                <Icon icon="solar:eye-linear" />
              </Button>

              {/* Register Button */}
              <Button
                variant="contained"
                disabled={!canRegister}
                onClick={handleRegisterClick}
                sx={{
                  ...styles.actionButton,
                  ...getButtonStyles()
                }}
              >
                Đăng ký
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Modals */}
      {!onOpenDetail && (
        <ExamDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          exam={isDetailModalOpen ? detailExam : null}
          onRegister={() => {
            // Kiểm tra lại khi mở modal đăng ký từ detail modal
            if (!canRegister) {
              if (!isExamOpen) {
                window.alert('Đăng ký chưa mở cho kỳ thi này.');
              } else if (isFull) {
                window.alert('Số lượng đăng ký đã đầy. Không thể đăng ký thêm.');
              }
              return;
            }
            setIsRegisterModalOpen(true);
          }}
        />
      )}

      <ExamRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        exam={exam}
        onSubmit={() => {
          setIsRegisterModalOpen(false);
          setShowPaymentModal(true);
        }}
        disabled={!canRegister}
      />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        exam={exam}
        onChecked={() => {
          // optional: handle after-check action
        }}
      />
    </>
  );
}