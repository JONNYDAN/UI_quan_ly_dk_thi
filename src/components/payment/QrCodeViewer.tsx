import React from 'react';

import { Box, Typography, Button } from '@mui/material';

type Props = {
  qrData?: string;
  qrImageUrl?: string;
  alt?: string;
};

export default function QrCodeViewer({ qrData, qrImageUrl, alt }: Props) {
  const imgSrc = qrImageUrl || (qrData ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}` : null);

  if (!imgSrc) return <Typography>Không có QR để hiển thị.</Typography>;

  return (
    <Box sx={{ textAlign: 'center' }}>
      <img src={imgSrc} alt={alt || 'QR code'} style={{ maxWidth: '100%', height: 'auto' }} />
      <Box sx={{ mt: 1 }}>
        <Button variant="outlined" size="small" component="a" href={imgSrc} download> Tải QR </Button>
      </Box>
    </Box>
  );
}
