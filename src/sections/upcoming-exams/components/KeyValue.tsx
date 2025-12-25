import React from 'react';

import { Box, Typography } from '@mui/material';

const KeyValue: React.FC<{ label?: string; value: React.ReactNode }> = ({ label, value }) => (
  <Box>
    {label && <Typography variant="caption" color="text.secondary">{label}</Typography>}
    <Typography variant="body2" fontWeight="medium">{value}</Typography>
  </Box>
);

export default KeyValue;
