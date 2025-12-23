import React from 'react';

import { Box, Card, CardContent, Typography } from '@mui/material';

export default function ExamPaperView(){
  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">Exam paper</Typography>
          <Typography sx={{ mt: 2 }}>Giao diện xem đề thi / bài làm sẽ được triển khai.</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}