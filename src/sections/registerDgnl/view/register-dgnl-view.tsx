import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import InfoIcon from '@mui/icons-material/Info';
import PaidIcon from '@mui/icons-material/Paid';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import SchoolIcon from '@mui/icons-material/School';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { DashboardContent } from 'src/layouts/dashboard';

export function RegisterDgnlView() {
  const [selectedExam, setSelectedExam] = useState<{ ca: number; subject: string } | null>(null);

  const examRounds = [
    {
      id: 1,
      date: '03/04/2025',
      time: '07:00',
      subjects: [
        { name: 'Toán học', capacity: 300 },
        { name: 'Tiếng Anh', capacity: 350 },
      ],
    },
    {
      id: 2,
      date: '03/04/2025',
      time: '13:00',
      subjects: [
        { name: 'Ngữ văn', capacity: 300 },
        { name: 'Tiếng Anh', capacity: 350 },
      ],
    },
    {
      id: 3,
      date: '04/04/2025',
      time: '07:00',
      subjects: [
        { name: 'Ngữ văn', capacity: 300 },
        { name: 'Tiếng Anh', capacity: 350 },
      ],
    },
    {
      id: 4,
      date: '04/04/2025',
      time: '13:00',
      subjects: [
        { name: 'Toán học', capacity: 300 },
        { name: 'Tiếng Anh', capacity: 350 },
      ],
    },
  ];

  const handleSelect = (ca: number, subject: string) => {
    setSelectedExam({ ca, subject });
  };

  return (
    <DashboardContent maxWidth={false} sx={{ width: '100%' }}>
      <Container maxWidth="lg">
        <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
          Cổng dịch vụ tuyển sinh HCMUE
        </Typography>

        {/* Kỳ thi */}
        <Card sx={{ mb: 3, p: 2, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            <SchoolIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Chọn kỳ thi
          </Typography>
          <Typography variant="body1" sx={{ ml: 4 }}>
            Đợt 1_TpHCM tại điểm thi Trường ĐH Sư phạm TP Hồ Chí Minh - CS chính (Quận 5)
          </Typography>
        </Card>

        {/* Gợi ý đăng ký */}
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            backgroundColor: '#e8f4fd',
            display: 'flex',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <InfoIcon sx={{ color: '#0288d1', mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Vui lòng nhấn chọn vào môn thi để đăng ký
          </Typography>
        </Box>

        {/* Danh sách ca thi */}
        <Grid container spacing={3}>
          {examRounds.map((round) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={round.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: '0.3s',
                  border:
                    selectedExam?.ca === round.id
                      ? '2px solid #0288d1'
                      : '1px solid #e0e0e0',
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Ca thi: {round.id}
                  </Typography>
                  <Divider sx={{ mb: 1 }} />
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Ngày thi: <strong>{round.date}</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Giờ có mặt: <strong>{round.time}</strong>
                    </Typography>
                  </Box>

                  {/* Môn thi */}
                  <Grid container spacing={1}>
                    {round.subjects.map((subj) => (
                      <Grid size={{ xs: 12 }} key={subj.name}>
                        <Button
                          variant={
                            selectedExam?.ca === round.id &&
                            selectedExam?.subject === subj.name
                              ? 'contained'
                              : 'outlined'
                          }
                          color="primary"
                          fullWidth
                          sx={{ borderRadius: 2, py: 1 }}
                          onClick={() => handleSelect(round.id, subj.name)}
                        >
                          {subj.name}
                          <Chip
                            icon={<GroupIcon sx={{ fontSize: 16 }} />}
                            label={subj.capacity}
                            size="small"
                            sx={{
                              ml: 1,
                              backgroundColor: '#e3f2fd',
                              color: '#1976d2',
                              fontWeight: 500,
                            }}
                          />
                        </Button>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Nút nộp lệ phí */}
        <Box sx={{ textAlign: 'right', mt: 4 }}>
          <Button
            variant="contained"
            color="warning"
            disabled={!selectedExam}
            startIcon={<PaidIcon />}
            sx={{ px: 4, py: 1.2, fontWeight: 600 }}
          >
            Nộp lệ phí thi
          </Button>
        </Box>
      </Container>
    </DashboardContent>
  );
}
