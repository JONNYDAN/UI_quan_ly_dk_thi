import React, { useEffect, useState } from 'react';

import { Box, Card, Typography, List, ListItem } from '@mui/material';

import orderService from 'src/services/orderService';

export default function ExamPayManagementView() {
  const [payDetails, setPayDetails] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    // fetch first page as example
    orderService.getOrderPayDetail(1, 10)
      .then((res: any) => { if (mounted) setPayDetails(res?.data || res || []); })
      .catch(() => { if (mounted) setPayDetails([]); });
    return () => { mounted = false; };
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Payments</Typography>
        <List>
          {payDetails.map((p, idx) => (
            <ListItem key={idx}>{p.code || p.id || JSON.stringify(p)}</ListItem>
          ))}
        </List>
      </Card>
    </Box>
  );
}