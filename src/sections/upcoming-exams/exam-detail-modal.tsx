import React, { useState } from 'react';

import { Box, Button, Typography, Chip, Tabs, Tab, Alert, Stack } from '@mui/material';
import {
  DescriptionOutlined,
  SchoolOutlined,
  CalendarTodayOutlined,
  AccessTimeOutlined,
  LocationOnOutlined,
  LocalOfferOutlined,
  PeopleOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material';

import ModalLayout from './modal-layout';
import Section from './components/Section';
import KeyValue from './components/KeyValue';
import InfoCard from './components/InfoCard';
import CardPaper from './components/CardPaper';
import IconAvatar from './components/IconAvatar';
import ProgressBar from './components/ProgressBar';

export interface Exam {
  id: string;
  title: string;
  code: string;
  school: string;
  date: string;
  time: string;
  place: string;
  description: string;
  deadline: string;
  fee: string;
  registered: number;
  capacity: number;
  isOpen: boolean;
  requirement?: string;
  notice?: string;
}

interface ExamDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Exam | null;
  onRegister: () => void;
}

// --------------------- main component ---------------------
const ExamDetailModal: React.FC<ExamDetailModalProps> = ({ isOpen, onClose, exam, onRegister }) => {
  const [activeTab, setActiveTab] = useState<string>('info');

  if (!isOpen || !exam) return null;

  // Hàm kiểm tra điều kiện đăng ký
  const checkRegistrationConditions = () => {
    if (!exam.isOpen) {
      return { canRegister: false, reason: 'Đăng ký chưa mở cho kỳ thi này' };
    }

    if (exam.registered >= exam.capacity) {
      return { canRegister: false, reason: 'Số lượng đăng ký đã đầy. Không thể đăng ký thêm' };
    }

    // Kiểm tra deadline
    const parseDate = (dateStr: string): Date => {
      const parts = dateStr.split('/');
      if (parts.length !== 3) return new Date();
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    };

    const deadlineDate = parseDate(exam.deadline);
    const currentDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate()
    );

    if (deadlineDate < currentDate) {
      return { canRegister: false, reason: 'Đã quá hạn đăng ký' };
    }

    return { canRegister: true, reason: '' };
  };

  const registrationStatus = checkRegistrationConditions();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const seatsText = () => {
    const reg = exam.registered || 0;
    const cap = exam.capacity || 0;
    return `${reg}/${cap} (Còn lại: ${Math.max(0, cap - reg)})`;
  };

  const progressValue = Math.min(100, ((exam.registered || 0) / (exam.capacity || 1)) * 100);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'requirements':
        return exam.requirement ? (
          <Box>
            <CardPaper>
              <Typography variant="body2" color="text.secondary">
                {exam.requirement}
              </Typography>
            </CardPaper>
          </Box>
        ) : null;

      case 'info':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Section title="Thông tin kỳ thi">
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  '& > *': { flex: '1 1 calc(50% - 16px)', minWidth: '200px' },
                }}
              >
                <InfoCard icon={<DescriptionOutlined />} label="Mã kỳ thi" value={exam.code} />
                <InfoCard
                  icon={<SchoolOutlined />}
                  label="Trường"
                  value={exam.school || 'Chưa cập nhật'}
                />
                <InfoCard
                  icon={<CalendarTodayOutlined />}
                  label="Ngày thi"
                  value={exam.date || 'Chưa cập nhật'}
                />
                <InfoCard
                  icon={<AccessTimeOutlined />}
                  label="Thời gian thi"
                  value={exam.time || 'Chưa cập nhật'}
                />
              </Box>
            </Section>

            {exam.place && (
              <Section title="Địa điểm thi">
                <CardPaper>
                  <Box display="flex" alignItems="center" gap={2}>
                    <IconAvatar icon={<LocationOnOutlined />} />
                    <Typography variant="body2">{exam.place}</Typography>
                  </Box>
                </CardPaper>
              </Section>
            )}

            {exam.description && (
              <Section title="Mô tả">
                <CardPaper>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                    {exam.description}
                  </Typography>
                </CardPaper>
              </Section>
            )}
          </Box>
        );

      case 'registration':
        return (
          <Box>
            <Section title="Thông tin đăng ký">
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 2,
                  '& > *': { flex: '1 1 calc(50% - 16px)', minWidth: '200px' },
                }}
              >
                <InfoCard
                  icon={<AccessTimeOutlined />}
                  label="Hạn đăng ký"
                  value={exam.deadline || 'Chưa cập nhật'}
                />
                <InfoCard
                  icon={<LocalOfferOutlined />}
                  label="Lệ phí"
                  value={exam.fee ? `${exam.fee} VND` : 'Chưa cập nhật'}
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <InfoCard
                  icon={<PeopleOutlined />}
                  label="Số lượng thí sinh"
                  value={seatsText()}
                  fullWidth
                  progressValue={progressValue}
                />
              </Box>
            </Section>
          </Box>
        );

      default:
        return null;
    }
  };

  const handleRegisterClick = () => {
    // KIỂM TRA CHÍNH - không thể bypass được
    if (!registrationStatus.canRegister) {
      window.alert(registrationStatus.reason);
      return;
    }

    onClose();
    onRegister();
  };

  const noticeElement = (
    <Box>
      {exam.notice && (
        <Alert
          severity="warning"
          icon={<WarningAmberOutlined />}
          sx={{
            borderRadius: 1,
            borderLeft: 4,
            borderLeftColor: 'warning.main',
            bgcolor: 'warning.lighter',
            display: 'flex',
            alignItems: 'center',
            '& .MuiAlert-icon': {
              alignItems: 'center',
              my: 'auto',
            },
            '& .MuiAlert-message': {
              display: 'flex',
              alignItems: 'center',
              py: 0,
              my: 'auto',
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              lineHeight: 'normal',
            }}
          >
            Lưu ý: {exam.notice}
          </Typography>
        </Alert>
      )}

      {!registrationStatus.canRegister && (
        <Alert severity="error" sx={{ mt: exam.notice ? 2 : 0 }}>
          {registrationStatus.reason}
        </Alert>
      )}
    </Box>
  );

  const tabNavigation = (
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      variant="scrollable"
      scrollButtons="auto"
      sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 48 }}
    >
      {exam.requirement && <Tab value="requirements" label="Yêu cầu" sx={{ minHeight: 48 }} />}
      <Tab value="info" label="Thông tin kỳ thi" sx={{ minHeight: 48 }} />
      <Tab value="registration" label="Thông tin đăng ký" sx={{ minHeight: 48 }} />
    </Tabs>
  );

  const modalFooter = (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      width="100%"
      justifyContent="flex-end"
    >
      <Button
        onClick={onClose}
        variant="outlined"
        fullWidth
        sx={{
          borderColor: 'grey.300',
          color: 'grey.700',
          '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.50' },
          maxWidth: { md: 120 },
        }}
      >
        Đóng
      </Button>
      <Button
        onClick={handleRegisterClick}
        disabled={!registrationStatus.canRegister}
        variant="contained"
        fullWidth
        sx={{
          bgcolor: registrationStatus.canRegister ? 'primary.main' : 'grey.300',
          '&:hover': {
            bgcolor: registrationStatus.canRegister ? 'primary.dark' : 'grey.300',
            cursor: registrationStatus.canRegister ? 'pointer' : 'not-allowed',
          },
          maxWidth: { md: 200 },
        }}
      >
        Đăng ký ngay
      </Button>
    </Stack>
  );

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title={exam.title}
      status={{ isOpen: exam.isOpen, label: exam.isOpen ? 'Đang mở đăng ký' : 'Chưa mở đăng ký' }}
      headerContent={tabNavigation}
      footer={modalFooter}
      notice={noticeElement}
      maxWidth="md"
    >
      <Box sx={{ p: 3 }}>{renderTabContent()}</Box>
    </ModalLayout>
  );
};

export default ExamDetailModal;
