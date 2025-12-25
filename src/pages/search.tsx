import React from 'react';

import { Box, Card, CardContent, Typography } from '@mui/material';

export default function SearchPage(){
  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">Tìm kiếm</Typography>
          <Typography sx={{ mt: 2 }}>Màn hình tìm kiếm (copy chức năng từ xettuyen frontend).</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}