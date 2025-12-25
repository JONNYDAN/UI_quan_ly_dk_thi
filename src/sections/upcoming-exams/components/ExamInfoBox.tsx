import React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const ExamInfoBox: React.FC<{ exam?: any }> = ({ exam }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Thông tin kỳ thi</Typography>
    <Paper variant="outlined" sx={{ bgcolor: 'blueGrey.50', p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography variant="body2"><strong>Đợt thi:</strong> {exam?.batch ?? '-'}</Typography>
        <Typography variant="body2"><strong>Địa điểm:</strong> {exam?.school ?? '-'}</Typography>
        <Typography variant="body2"><strong>Thời gian:</strong> {exam?.dateRange?.start ?? '-'} - {exam?.dateRange?.end ?? '-'}</Typography>
      </Box>
    </Paper>
  </Box>
);

export default ExamInfoBox;
