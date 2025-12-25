import React, { useState } from 'react';

import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Chip,
  Tabs,
  Tab,
  Alert,
  Stack, 
} from '@mui/material';
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
                  value={exam.fee ? `${exam.fee} VND` : 'Miễn phí'}
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <InfoCard
                  icon={<PeopleOutlined />}
                  label="Số lượng thí sinh"
                  value={seatsText()}
                  fullWidth
                />
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={progressValue}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'grey.100',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        bgcolor: 'primary.main',
                      },
                    }}
                  />
                </Box>
              </Box>
            </Section>
          </Box>
        );

      default:
        return null;
    }
  };

  const noticeElement = exam.notice ? (
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
  ) : null;

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
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} width="100%" justifyContent='flex-end'>
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
        onClick={() => {
          onClose();
          onRegister();
        }}
        disabled={!exam.isOpen}
        variant="contained"
        fullWidth
        sx={{
          bgcolor: exam.isOpen ? 'primary.main' : 'grey.300',
          '&:hover': { bgcolor: exam.isOpen ? 'primary.dark' : 'grey.300' },
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
      status={{ isOpen: exam.isOpen, label: exam.isOpen ? 'Đang mở đăng ký' : 'Sắp mở đăng ký' }}
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
