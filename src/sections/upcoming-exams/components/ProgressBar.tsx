import React from 'react';

import { Box, LinearProgress } from '@mui/material';

const ProgressBar: React.FC<{ value: number }> = ({ value }) => (
  <Box sx={{ width: '100%' }}>
    <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: '9999px', height: { xs: 4, sm: 5 }, overflow: 'hidden' }}>
      <LinearProgress variant="determinate" value={value} sx={{ height: '100%', borderRadius: '9999px', bgcolor: 'transparent', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main', borderRadius: '9999px' } }} />
    </Box>
  </Box>
);

export default ProgressBar;
