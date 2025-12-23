import React from 'react';
import { useLocation } from 'react-router-dom';

import { Box, Card, CardContent, Typography } from '@mui/material';

import ExamList from 'src/components/exam/ExamList';
import EnrollmentForm from 'src/components/exam/EnrollmentForm';


export default function EnrollmentView(){
  const location = useLocation();
  const exam = (location.state as any)?.exam;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Đăng ký tham gia</Typography>
      {exam ? <EnrollmentForm exam={exam} /> : <ExamList />}
    </Box>
  );
}