import React from 'react';

import Alert from '@mui/material/Alert';

const colorToSeverity: Record<string, 'info'|'error'|'warning'|'success'> = {
  blue: 'info',
  red: 'error',
  orange: 'warning',
  green: 'success',
  yellow: 'warning'
};

const InfoBox: React.FC<{ color?: 'blue'|'red'|'orange'|'green'|'yellow'; children?: React.ReactNode }> = ({ color='blue', children }) => {
  const severity = colorToSeverity[color] ?? 'info';
  return (
    <Alert severity={severity} sx={{ borderRadius: 1 }}>
      {children}
    </Alert>
  );
};

export default InfoBox;
