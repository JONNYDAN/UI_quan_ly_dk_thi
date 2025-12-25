import React from 'react';
import { Icon } from '@iconify/react';

import { Box, Typography } from '@mui/material';


const DetailItem: React.FC<{ icon: string; label?: string; value: string | React.ReactNode }> = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
    <Box component={Icon} icon={icon} sx={{ fontSize: '0.875rem', color: 'grey.500', flexShrink: 0, mt: 0.25 }} />
    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.4 }}>
      {label && <Box component="span" sx={{ color: 'grey.600' }}>{label}: </Box>}
      <Box component="span" sx={{ fontWeight: 500 }}>{value}</Box>
    </Typography>
  </Box>
);

export default DetailItem;
