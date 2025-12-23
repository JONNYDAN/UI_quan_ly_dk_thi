import React from 'react';

import { Box, Card, CardContent, Typography } from '@mui/material';

export default function EnrollmentNNView(){
  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">Enrollment (NN)</Typography>
          <Typography sx={{ mt: 2 }}>Phiên bản ngôn ngữ (NN) — cần hoàn thiện theo yêu cầu.</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}