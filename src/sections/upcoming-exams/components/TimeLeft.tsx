import React from 'react';

import Typography from '@mui/material/Typography';

const TimeLeft: React.FC<{ days:number; hours:number; minutes:number; seconds:number; className?:string }> = ({ days, hours, minutes, seconds, className='' }) => {
  const text = `${days > 0 ? `${days} ngày ` : ''}${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
  return (
    <Typography component="span" className={className} variant="body2">
      {text}
    </Typography>
  );
};

export default TimeLeft;
