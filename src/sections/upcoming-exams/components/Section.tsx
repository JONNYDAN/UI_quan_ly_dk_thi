import React from 'react';

import { Box, Typography } from '@mui/material';

const Section: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
  <Box>
    <Typography variant="h6" fontWeight="semibold" gutterBottom>{title}</Typography>
    {children}
  </Box>
);

export default Section;
