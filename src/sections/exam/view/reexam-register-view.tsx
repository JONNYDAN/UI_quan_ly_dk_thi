import React from 'react';

import { Box, Card, CardContent, Typography } from '@mui/material';

export default function ReExamRegisterView(){
  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">Re-exam registration</Typography>
          <Typography sx={{ mt: 2 }}>Giao diện đăng ký phúc khảo sẽ được triển khai.</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}