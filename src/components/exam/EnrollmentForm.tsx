import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { Box, Card, CardContent, TextField, Button, MenuItem, Alert, Stack, Typography } from '@mui/material';

import examService from 'src/services/examService';
import { useAuth } from 'src/contexts/AuthContext';
import orderService from 'src/services/orderService';

type Props = {
  exam: any;
};

export default function EnrollmentForm({ exam }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [turns, setTurns] = useState<any[]>([]);
  const [turnId, setTurnId] = useState<string | number | ''>('');
  const [fullname, setFullname] = useState<string>(user?.fullname || '');
  const [cccd, setCccd] = useState<string>(user?.cccd || '');
  const [phone, setPhone] = useState<string>(user?.phone || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (exam?.id || exam?._id) {
      examService.getTurnsByExam(exam.id || exam._id)
        .then((res: any) => { if (mounted) setTurns(res || []); })
        .catch((err) => { if (mounted) setTurns([]); });
    }
    return () => { mounted = false; };
  }, [exam]);

  const handleSubmit = async () => {
    setError(null);
    if (!exam || (!turnId && turns.length)) { setError('Vui lòng chọn ca thi'); return; }
    if (!fullname || !cccd) { setError('Vui lòng nhập họ tên và số CCCD'); return; }

    setLoading(true);
    try {
      // get order code first
      const newCodeRes: any = await orderService.getNewOrderCode(exam.id || exam._id);
      const orderCode = newCodeRes?.data || newCodeRes || (`ORD-${Date.now()}`);

      const payload = {
        orderCode,
        examId: exam.id || exam._id,
        turnId: turnId || null,
        fullname,
        cccd,
        phone,
        email,
      };

      const postRes: any = await orderService.postOrderDetails(payload);
      // Resolve orderCode from response if present
      const createdOrderCode = postRes?.orderCode || postRes?.data?.orderCode || orderCode;

      // Navigate to payment page
      navigate(`/payment/${createdOrderCode}`);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6">Đăng ký - {exam?.name || exam?.title}</Typography>

          {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

          {turns.length > 0 && (
            <TextField
              select
              label="Chọn ca thi"
              fullWidth
              value={turnId}
              onChange={(e) => setTurnId(e.target.value)}
              sx={{ mt: 2 }}
            >
              {turns.map((t: any) => (
                <MenuItem key={t.id || t._id} value={t.id || t._id}>{t?.turnName || t?.name || `${t?.date || t?.turnDate}`}</MenuItem>
              ))}
            </TextField>
          )}

          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField label="Họ tên" fullWidth value={fullname} onChange={(e) => setFullname(e.target.value)} />
            <TextField label="CCCD" fullWidth value={cccd} onChange={(e) => setCccd(e.target.value)} />
            <TextField label="Số điện thoại" fullWidth value={phone} onChange={(e) => setPhone(e.target.value)} />
            <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />

            <Button variant="contained" disabled={loading} onClick={handleSubmit}>Thanh toán & Đăng ký</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
