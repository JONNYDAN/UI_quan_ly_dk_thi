import React from 'react';

import { Card, CardContent, Typography, Box } from '@mui/material';

export function ComingSoonView() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: 'linear-gradient(to right, #2196F3, #21CBF3)',
        padding: 2,
      }}
    >
      <Card
        sx={{
          width: 650,
          borderRadius: 4,
          boxShadow: 5,
          backgroundColor: 'white',
          padding: 3,
          textAlign: 'center',
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            component="div"
            color="primary"
            fontWeight="bold"
            sx={{ fontSize: '22px', marginBottom: 2, letterSpacing: 1.2, textTransform: 'uppercase' }}
          >
            Trang đăng ký dự thi tạm ngưng hoạt động để bảo trì dịch vụ.
          </Typography>
          <Typography
            variant="h4"
            component="div"
            color="primary"
            fontWeight="bold"
            sx={{ fontSize: '22px', marginBottom: 2, letterSpacing: 1.2, textTransform: 'uppercase' }}
          >
            Quý phụ huynh và các bạn thí sinh có thể tiếp tục truy cập sau 17 giờ ngày 20/04/2025.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ marginTop: 2, fontWeight: 'bold', fontSize: '20px', lineHeight: 1.6 }}>
            Trân trọng cảm ơn!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default ComingSoonView;
