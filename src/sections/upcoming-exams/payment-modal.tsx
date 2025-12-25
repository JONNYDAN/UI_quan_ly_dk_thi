import React, { useEffect, useState } from 'react';

import { Box, Button, Typography, Paper, Stack, Alert } from '@mui/material';

import ModalLayout from './modal-layout';
import InfoBox from './components/InfoBox';
import TimeLeft from './components/TimeLeft';
import QRSection from './components/QRSection';

interface ExamProp {
  isOpen?: boolean;
  fee?: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam?: ExamProp | null;
  onChecked?: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, exam, onChecked }) => {
  const [timeLeft, setTimeLeft] = useState(72 * 60 * 60);

  useEffect(() => {
    if (!isOpen) {
      return () => {}; 
    }

    setTimeLeft(72 * 60 * 60);
    const t = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(t);
  }, [isOpen]);

  if (!isOpen) return null;

  // compute days/hours/minutes/seconds from seconds
  const days = Math.floor(timeLeft / (24 * 60 * 60));
  const hours = Math.floor((timeLeft % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((timeLeft % (60 * 60)) / 60);
  const seconds = timeLeft % 60;

  const handleCheck = () => {
    // keep behavior minimal: call callback if provided, then close
    if (onChecked) onChecked();
    onClose();
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Thanh toán lệ phí thi"
      maxWidth="md"
      footer={
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={{ xs: 2, md: 3 }}
          alignItems={{ md: 'center' }}
          justifyContent="space-between"
          width="100%"
        >
          {/* Time left section */}
          <Box sx={{ flexShrink: 0 }}>
            <Typography variant="body2" color="text.secondary">
              Thời gian còn lại:{' '}
              <Typography 
                component="span" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'error.main',
                  display: 'inline-block'
                }}
              >
                <TimeLeft days={days} hours={hours} minutes={minutes} seconds={seconds} />
              </Typography>
            </Typography>
          </Box>

          {/* Button group */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{ 
              width: { xs: '100%', sm: 'auto' },
              '& .MuiButton-root': {
                flexShrink: 0,
                whiteSpace: 'nowrap'
              }
            }}
          >
            <Button 
              variant="outlined" 
              onClick={onClose}
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                px: 3
              }}
            >
              Đóng
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheck}
              disabled={!exam?.isOpen}
              sx={{ 
                width: { xs: '100%', sm: 'auto' },
                px: 4
              }}
            >
              Kiểm tra thanh toán
            </Button>
          </Stack>
        </Stack>
      }
      notice={
        <Alert severity="warning" sx={{ borderRadius: 1 }}>
          Hiện tại bạn đang được giữ slot nhưng sẽ huỷ nếu không hoàn tất thanh toán trong 72 giờ
        </Alert>
      }
    >
      <Box sx={{ p: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <QRSection />

          <Stack spacing={2} sx={{ width: { md: '60%' } }}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="body2" color="text.primary" fontWeight={600}>
                Hướng dẫn nội dung chuyển khoản
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
                Khi dùng ứng dụng chuyển khoản, nội dung chuyển khoản phải hiển thị như:
              </Typography>
              <Box
                component="code"
                sx={{ mt: 1, bgcolor: 'grey.100', p: 1, borderRadius: 1, fontFamily: 'monospace' }}
              >
                DGNL A1LVO5831JL 091234567891 NGUYEN TRAN C
              </Box>
            </Paper>

            <Alert severity="error">KHÔNG SỬ DỤNG VÍ SHOPEE để thanh toán</Alert>
            <Alert severity="info">
              NGÂN HÀNG AGRIBANK VÀ VÍ MOMO sẽ được xác nhận sau 24-36 giờ
            </Alert>
            <Alert severity="success">Các ngân hàng/ví khác sẽ được xác nhận sau ~15 phút</Alert>
          </Stack>
        </Stack>
      </Box>
    </ModalLayout>
  );
};

export default PaymentModal;