import React from 'react';

import { Box, LinearProgress, useTheme } from '@mui/material';

const ProgressBar: React.FC<{ value: number }> = ({ value }) => {
  const theme = useTheme();
  const getColor = (v: number) => {
    if (v <= 60) return theme.palette.success.main;
    if (v <= 80) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const barColor = getColor(value);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: '9999px', height: { xs: 4, sm: 5 }, overflow: 'hidden' }}>
        <LinearProgress
          variant="determinate"
          value={value}
          sx={{
            height: '100%',
            borderRadius: '9999px',
            bgcolor: 'transparent',
            '& .MuiLinearProgress-bar': { bgcolor: barColor, borderRadius: '9999px' },
          }}
        />
      </Box>
    </Box>
  );
};

export default ProgressBar;
