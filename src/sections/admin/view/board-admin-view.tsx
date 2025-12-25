import React, { useEffect, useState } from 'react';

import { Card, Box, Typography } from '@mui/material';

import userService from 'src/services/userService';

export default function BoardAdminView() {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    userService.getUserBoard()
      .then((res: any) => {
        if (mounted) setContent(res?.data || res || '');
      })
      .catch((err) => {
        const message = err?.response?.data?.message || err?.message || String(err);
        if (mounted) setContent(message);
      });

    return () => { mounted = false; };
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6">{content}</Typography>
      </Card>
    </Box>
  );
}