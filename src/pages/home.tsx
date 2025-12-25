import React from 'react';

import { Box, Card, CardContent, Typography } from '@mui/material';

export default function HomePage(){
  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">Trang chủ</Typography>
          <Typography sx={{ mt: 2 }}>Nội dung trang công cộng đã được di chuyển từ xettuyen2025_frontend.</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}