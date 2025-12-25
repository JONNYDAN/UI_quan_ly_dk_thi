import React from 'react';

import Grid from '@mui/material/Grid';
import { Box, Card, CardContent, Typography, Button, Stack, Chip } from '@mui/material';

import { fNumber } from 'src/utils/format-number';

type Props = {
  order: any;
  onPayMoMo: () => void;
  onCancel: () => void;
  onShowReceipt: () => void;
  onOpenPayUrl?: () => void;
};

export default function PaymentSummaryCard({ order, onPayMoMo, onCancel, onShowReceipt, onOpenPayUrl }: Props) {
  const statusColor = (s: string | undefined) => {
    switch (s) {
      case 'PAID':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Box sx={{ flex: '1 1 66%' }}>
            <Typography variant="h6">Mã đơn: {order?.orderCode || '-'}</Typography>
            <Typography color="text.secondary">Người nộp: {order?.fullname || '-'}</Typography>
            <Typography color="text.secondary">Ngày: {order?.createdAt || '-'}</Typography>
          </Box>

          <Box sx={{ flex: '1 1 34%', textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{fNumber(order?.totalPrice || 0)} VND</Typography>
            <Chip label={order?.status || 'UNKNOWN'} color={statusColor(order?.status)} sx={{ mt: 1 }} />
          </Box>

          <Box sx={{ width: '100%' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="contained" color="primary" onClick={onPayMoMo}>Thanh toán MoMo</Button>
              {onOpenPayUrl && <Button variant="outlined" onClick={onOpenPayUrl}>Mở liên kết thanh toán</Button>}
              <Button variant="contained" color="info" onClick={onShowReceipt}>Xem biên lai</Button>
              <Button variant="outlined" color="error" onClick={onCancel}>Hủy đơn</Button>
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
