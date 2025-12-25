import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Card, CardContent, Typography, Stack, Button } from '@mui/material';

import examService from 'src/services/examService';

import QrCodeViewer from 'src/components/payment/QrCodeViewer';

export default function ExamInfoView(){
  const [info, setInfo] = useState<any>(null);
  const [turns, setTurns] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const exam = (location.state as any)?.exam;

  useEffect(() => {
    let mounted = true;
    if (exam?.id || exam?._id) {
      examService.getTurnsByExam(exam.id || exam._id)
        .then((res: any) => { if (mounted) setTurns(res || []); })
        .catch(() => { if (mounted) setTurns([]); });
      setInfo(exam);
    } else {
      examService.getAllExams()
        .then((res: any) => { if (mounted) setInfo(res?.[0] || null); })
        .catch(() => { if (mounted) setInfo(null); });
    }
    return () => { mounted = false; };
  }, [exam]);

  if(!info) return <Box sx={{ p: 3 }}>Đang tải...</Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">{info?.name || info?.title}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>{info?.description}</Typography>

          <Stack sx={{ mt: 2 }} spacing={1}>
            {turns.length ? (
              turns.map((t: any) => (
                <Box key={t.id || t._id} sx={{ border: '1px solid', borderColor: 'divider', p: 2, borderRadius: 1 }}>
                  <Typography variant="subtitle2">{t?.turnName || t?.name}</Typography>
                  <Typography variant="body2">Ngày: {t?.date || t?.turnDate}</Typography>
                  <Typography variant="body2">Số lượng: {t?.capacity}</Typography>
                </Box>
              ))
            ) : (
              <Typography>Không có ca thi được công bố.</Typography>
            )}
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button variant="contained" onClick={() => navigate('/exam/enrollment', { state: { exam } })}>Đăng ký</Button>
            {info?.paymentUrl && <Button variant="outlined" onClick={() => window.open(info.paymentUrl, '_blank')}>Mở liên kết thanh toán</Button>}
          </Stack>

          {info?.qr && (
            <Box sx={{ mt: 2 }}>
              <QrCodeViewer qrData={info.qr} qrImageUrl={info.qrImageUrl} />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}