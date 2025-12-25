import React from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const QRSection: React.FC = () => (
  <Box sx={{ width: { md: '40%' }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Typography variant="h6" component="h3" sx={{ mb: 2, textAlign: 'center' }}>
      Chuyển tiền bằng mã QR
    </Typography>
    <Paper elevation={0} sx={{ border: '2px dashed', borderColor: 'grey.300', borderRadius: 1, p: 2, width: 256, height: 256, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography color="text.secondary">QR Code</Typography>
    </Paper>
  </Box>
);

export default QRSection;
