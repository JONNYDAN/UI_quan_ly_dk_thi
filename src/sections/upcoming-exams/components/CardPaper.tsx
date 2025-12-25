import React from 'react';

import { Paper } from '@mui/material';

const CardPaper: React.FC<{ children?: React.ReactNode; sx?: any }> = ({ children, sx }) => (
  <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'grey.200', borderRadius: 2, ...sx }}>
    {children}
  </Paper>
);

export default CardPaper;
