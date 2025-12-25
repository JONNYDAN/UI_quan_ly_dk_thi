import React from 'react';

import { Box } from '@mui/material';

import KeyValue from './KeyValue';
import CardPaper from './CardPaper';
import IconAvatar from './IconAvatar';

const InfoCard: React.FC<{ icon: React.ReactNode; label: string; value: string; fullWidth?: boolean }> = ({ icon, label, value, fullWidth = false }) => (
  <CardPaper sx={{
    '&:hover': { boxShadow: 1 },
    transition: 'box-shadow 0.2s',
    width: fullWidth ? '100%' : 'auto',
    flex: fullWidth ? '1 1 100%' : '1 1 calc(50% - 16px)'
  }}>
    <Box display="flex" alignItems="flex-start" gap={2}>
      <IconAvatar icon={icon} />
      <KeyValue label={label} value={value} />
    </Box>
  </CardPaper>
);

export default InfoCard;
