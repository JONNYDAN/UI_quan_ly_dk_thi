import React from 'react';

import { Avatar } from '@mui/material';

const iconAvatarSx = {
  bgcolor: 'primary.lighter',
  color: 'primary.main',
  width: 36,
  height: 36,
  flexShrink: 0
};

const IconAvatar: React.FC<{ icon: React.ReactNode }> = ({ icon }) => (
  <Avatar sx={iconAvatarSx}>{icon}</Avatar>
);

export default IconAvatar;
