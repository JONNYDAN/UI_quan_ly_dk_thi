import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardActions, Typography, Button, Stack } from '@mui/material';

type Props = {
  exam: any;
};

export default function ExamCard({ exam }: Props) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate('/exam/info', { state: { exam } });
  };

  const handleRegister = () => {
    navigate('/exam/enrollment', { state: { exam } });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{exam?.name || exam?.title || 'Unknown Exam'}</Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>{exam?.description || exam?.shortDescription || '-'}</Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Typography variant="body2">Ngày thi: {exam?.date || exam?.examDate || '-'}</Typography>
        </Stack>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleView}>Xem</Button>
        <Button size="small" variant="contained" onClick={handleRegister}>Đăng ký</Button>
      </CardActions>
    </Card>
  );
}
