import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Box, Card, CardContent, Typography } from '@mui/material';

export default function PaymentReturnView(){
  const [params] = useSearchParams();
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    const all: any = {};
    params.forEach((value, key) => { all[key] = value; });
    setInfo(all);
  }, [params]);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">Kết quả thanh toán</Typography>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(info, null, 2)}</pre>
        </CardContent>
      </Card>
    </Box>
  );
}