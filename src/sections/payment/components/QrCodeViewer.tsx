import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

import { Box, Typography } from '@mui/material';

interface QrCodeViewerProps {
  qrData: string;
  qrImageUrl?: string;
  size?: number;
}

export default function QrCodeViewer({ qrData, qrImageUrl, size = 250 }: QrCodeViewerProps) {
  if (!qrData) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography>Không có mã QR</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'center' }}>
      <QRCodeCanvas
        value={qrData}
        size={size}
        level="H"
        includeMargin
        imageSettings={
          qrImageUrl
            ? {
                src: qrImageUrl,
                height: 40,
                width: 60,
                excavate: true,
              }
            : undefined
        }
      />
    </Box>
  );
}