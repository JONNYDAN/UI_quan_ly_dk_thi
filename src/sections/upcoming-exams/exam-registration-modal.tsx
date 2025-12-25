import React, { useMemo, useState } from 'react';

import { Box, Button, Typography, Checkbox, FormControlLabel, Stack } from '@mui/material';

import ModalLayout from './modal-layout';
import SelectField from './components/SelectField';
import ExamInfoBox from './components/ExamInfoBox';

interface Exam {
  batch?: string;
  school?: string;
  dateRange?: { start?: string; end?: string };
}

interface ExamRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam?: Exam | null;
  onSubmit?: () => void;
}

const ExamRegistrationModal: React.FC<ExamRegistrationModalProps> = ({
  isOpen,
  onClose,
  exam,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    examLevel: '',
    studyDuration: '',
    studyPurpose: '',
    studyMethod: '',
  });
  const [isAgreed, setIsAgreed] = useState(false);

  const isFormComplete = useMemo(() => Object.values(formData).every((v) => v !== ''), [formData]);

  const examLevels = [{ value: 'hsk5', label: 'HSK 5 + HSKK: 1.900.000đ' }];
  const studyDurations = [
    { value: 'under_half_year', label: 'Chưa tới nửa năm' },
    { value: 'half_to_1', label: 'Từ nửa năm tới 1 năm' },
    { value: '1_and_a_half_years', label: 'Một năm rưỡi' },
    { value: '2_and_a_half_years', label: 'Hai năm rưỡi' },
    { value: '3_years', label: 'Ba năm' },
    { value: '4_years', label: 'Bốn năm' },
  ];
  const studyPurposes = [
    { value: 'work', label: 'Do yêu cầu công việc' },
    { value: 'hobby', label: 'Do sở thích của cá nhân' },
    { value: 'research', label: 'Để nghiên cứu' },
    { value: 'study', label: 'Để du học' },
  ];
  const studyMethods = [
    { value: 'friends', label: 'Học với bạn bè' },
    { value: 'teachers', label: 'Học với thầy cô giáo' },
    { value: 'online', label: 'Học qua mạng' },
  ];

  if (!isOpen || !exam) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!isFormComplete || !isAgreed) return;
    if (onSubmit) onSubmit();
    onClose();
  };

  const footer = (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      width="100%"
      justifyContent="flex-end"
    >
      <Button variant="outlined" onClick={onClose} fullWidth sx={{ maxWidth: { md: 120 } }}>
        Đóng
      </Button>
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={!isFormComplete || !isAgreed}
        fullWidth
        sx={{ maxWidth: { md: 200 } }}
      >
        Xác nhận đăng ký
      </Button>
    </Stack>
  );

  const agreementSection = (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={isAgreed}
            disabled={!isFormComplete}
            onChange={(e) => setIsAgreed(e.target.checked)}
          />
        }
        label="Tôi đồng ý với các điều kiện trên"
      />
    </Box>
  );

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      title="Đăng ký dự thi"
      footer={footer}
      notice={agreementSection}
      maxWidth="md"
    >
      <Box sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <ExamInfoBox exam={exam} />
          </Box>

          <Box>
            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
              <SelectField
                label="Cấp độ thi - Lệ phí thi *"
                value={formData.examLevel}
                onChange={(value) => handleChange('examLevel', value)}
                options={examLevels}
                placeholder="-- Chọn cấp độ --"
              />

              <SelectField
                label="Bạn đã học bao lâu? *"
                value={formData.studyDuration}
                onChange={(value) => handleChange('studyDuration', value)}
                options={studyDurations}
                placeholder="-- Chọn thời gian --"
              />
            </Stack>

            <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ mt: 2 }}>
              <SelectField
                label="Mục đích học *"
                value={formData.studyPurpose}
                onChange={(value) => handleChange('studyPurpose', value)}
                options={studyPurposes}
                placeholder="-- Chọn mục đích --"
              />

              <SelectField
                label="Cách thức học *"
                value={formData.studyMethod}
                onChange={(value) => handleChange('studyMethod', value)}
                options={studyMethods}
                placeholder="-- Chọn cách thức --"
              />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </ModalLayout>
  );
};

export default ExamRegistrationModal;
