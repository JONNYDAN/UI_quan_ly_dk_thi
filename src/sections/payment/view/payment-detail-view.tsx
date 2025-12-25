import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Grid from '@mui/material/Grid';
import { Box, Card, CardContent, Typography, Button, Alert } from '@mui/material';

import { useAuth } from 'src/contexts/AuthContext';
import orderService from 'src/services/orderService';
import paymentService from 'src/services/paymentService';

import Receipt from 'src/components/payment/Receipt';
import QrCodeViewer from 'src/components/payment/QrCodeViewer';
import PaymentSummaryCard from 'src/components/payment/PaymentSummaryCard';

export default function PaymentDetailView() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { orderCode, type } = useParams<Record<string, string | undefined>>();
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!isAuthenticated) navigate('/sign-in');
    if (orderCode) {
      orderService.getOrderDetails(orderCode)
        .then((res: any) => { if (mounted) setOrder(res || null); })
        .catch((err) => setError(err?.message || String(err)));
    }
    return () => { mounted = false; };
  }, [isAuthenticated, orderCode, navigate]);



  const handleMoMoPayment = async () => {
    if (!orderCode || !order) return;
    try {
      const res = await paymentService.postMomoRequest({ orderCode, totalPrice: order.totalPrice, type });
      window.location.href = res?.payUrl || res?.data?.payUrl || '/';
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  const handleCancelOrder = async () => {
    if (!orderCode) return;
    try {
      await orderService.putCancelOrder({ orderCode });
      navigate('/exam');
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  if (!order) return <Box sx={{ p: 3 }}><Typography>Đang tải...</Typography>{error && <Alert severity="error">{error}</Alert>}</Box>;

  const payUrl = order?.payUrl || order?.pay?.payUrl || order?.paymentUrl;
  const qrData = order?.qr || order?.qrData || order?.pay?.qr || payUrl;

  const handleShowReceipt = () => setShowReceipt(true);
  const handleCloseReceipt = () => setShowReceipt(false);
  const handleOpenPayUrl = () => { if (payUrl) window.open(payUrl, '_blank'); };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Box>
          <PaymentSummaryCard
            order={order}
            onPayMoMo={handleMoMoPayment}
            onCancel={handleCancelOrder}
            onShowReceipt={handleShowReceipt}
            onOpenPayUrl={payUrl ? handleOpenPayUrl : undefined}
          />
        </Box>

        <Box>
          {qrData ? (
            <Card>
              <CardContent>
                <Typography variant="h6">Mã QR thanh toán</Typography>
                <Box sx={{ mt: 2 }}>
                  <QrCodeViewer qrData={String(qrData)} qrImageUrl={order?.qrImageUrl} />
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Typography>Không có mã QR. Bạn có thể nhấn Thanh toán MoMo để chuyển sang cổng thanh toán.</Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      <Receipt open={showReceipt} order={order} onClose={handleCloseReceipt} />

      {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}
    </Box>
  );
}