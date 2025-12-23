import React, { useRef } from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography } from '@mui/material';

type Props = {
  open: boolean;
  order: any;
  onClose: () => void;
};

export default function Receipt({ open, order, onClose }: Props) {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = () => {
    if (!contentRef.current) return;
    const html = `<!doctype html><html><head><title>Biên lai</title><meta charset="utf-8" /></head><body>${contentRef.current.innerHTML}</body></html>`;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Biên lai - {order?.orderCode || ''}</DialogTitle>
      <DialogContent>
        <div ref={contentRef}>
          <Stack spacing={1}>
            <Typography><strong>Người nộp:</strong> {order?.fullname || '-'}</Typography>
            <Typography><strong>Mã đơn:</strong> {order?.orderCode || '-'}</Typography>
            <Typography><strong>Ngày:</strong> {order?.createdAt || '-'}</Typography>
            <Typography><strong>Tổng tiền:</strong> {order?.totalPrice || 0} VND</Typography>
            <Typography><strong>Trạng thái:</strong> {order?.status || '-'}</Typography>
          </Stack>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePrint}>In</Button>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}
