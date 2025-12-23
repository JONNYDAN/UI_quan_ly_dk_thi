import React from 'react';

import { Box, Card, CardContent, Typography } from '@mui/material';

export default function ReExamInfoView(){
  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">Re-exam info</Typography>
          <Typography sx={{ mt: 2 }}>Thông tin phúc khảo sẽ được hiển thị ở đây.</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}