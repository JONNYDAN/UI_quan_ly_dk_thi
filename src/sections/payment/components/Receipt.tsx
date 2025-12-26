import React from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider
} from '@mui/material';

interface ReceiptProps {
  open: boolean;
  order: any;
  onClose: () => void;
}

export default function Receipt({ open, order, onClose }: ReceiptProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Biên lai thanh toán</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Thông tin thanh toán
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1">
              <strong>Mã đơn hàng:</strong> {order.code}
            </Typography>
            <Typography variant="body1">
              <strong>Ngày thanh toán:</strong> {order.paymentAt}
            </Typography>
            <Typography variant="body1">
              <strong>Cổng thanh toán:</strong> {order.paymentGateway}
            </Typography>
            <Typography variant="body1">
              <strong>Tổng tiền:</strong> {new Intl.NumberFormat().format(order.totalPrice)}đ
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="body2" color="text.secondary">
            Cảm ơn bạn đã sử dụng dịch vụ!
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <Button variant="contained" onClick={() => window.print()}>
          In biên lai
        </Button>
      </DialogActions>
    </Dialog>
  );
}