import React from 'react';

import { Box } from '@mui/material';

import KeyValue from './KeyValue';
import CardPaper from './CardPaper';
import IconAvatar from './IconAvatar';
import ProgressBar from './ProgressBar';

interface InfoCardProps {
  icon?: React.ReactNode;
  label?: string;
  value?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
  progressValue?: number; 
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  icon, 
  label, 
  value, 
  fullWidth = false, 
  children,
  progressValue 
}) => (
  <CardPaper
    sx={{
      transition: 'box-shadow 0.2s',
      width: fullWidth ? '100%' : 'auto',
      flex: fullWidth ? '1 1 100%' : '1 1 calc(50% - 16px)',
    }}
  >
    <Box
      display="flex"
      alignItems="center" 
      gap={2}
      sx={{ width: fullWidth ? '100%' : undefined }}
    >
      <IconAvatar icon={icon} />
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <KeyValue label={label} value={value} />
        
        {progressValue !== undefined && (
          <Box sx={{ width: '100%', mt: 0.5 }}>
            <ProgressBar value={progressValue} />
          </Box>
        )}
        
        {children}
      </Box>
    </Box>
  </CardPaper>
);

export default InfoCard;