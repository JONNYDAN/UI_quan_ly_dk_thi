import React from 'react';

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Alert,
  Box
} from '@mui/material';

interface PaymentSummaryCardProps {
  order: any;
  onPayMoMo?: () => void;
  onCancel?: () => void;
  onShowReceipt?: () => void;
  onOpenPayUrl?: () => void;
}

export default function PaymentSummaryCard({
  order,
  onPayMoMo,
  onCancel,
  onShowReceipt,
  onOpenPayUrl
}: PaymentSummaryCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Tóm tắt thanh toán
        </Typography>
        
        {order.status === 'PENDING' && order.totalPrice > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Bạn cần hoàn tất thanh toán trong vòng 24 giờ.
            </Typography>
          </Alert>
        )}
        
        {order.status === 'SUCCESS' && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Đã thanh toán thành công vào {order.paymentAt}
            </Typography>
          </Alert>
        )}
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">Mã đơn hàng: {order.code}</Typography>
          <Typography variant="body2">Tổng tiền: {new Intl.NumberFormat().format(order.totalPrice)}đ</Typography>
        </Box>
      </CardContent>
      
      <CardActions>
        {order.status === 'PENDING' && onPayMoMo && (
          <Button variant="contained" onClick={onPayMoMo}>
            Thanh toán MoMo
          </Button>
        )}
        
        {order.status === 'PENDING' && onCancel && (
          <Button color="error" onClick={onCancel}>
            Hủy đơn hàng
          </Button>
        )}
        
        {order.status === 'SUCCESS' && onShowReceipt && (
          <Button variant="outlined" onClick={onShowReceipt}>
            Xem biên lai
          </Button>
        )}
        
        {onOpenPayUrl && (
          <Button variant="outlined" onClick={onOpenPayUrl}>
            Mở cổng thanh toán
          </Button>
        )}
      </CardActions>
    </Card>
  );
}