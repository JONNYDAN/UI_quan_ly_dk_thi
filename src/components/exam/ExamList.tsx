import React, { useEffect, useState } from 'react';

import Grid from '@mui/material/Grid';
import { Box, TextField } from '@mui/material';

import examService from 'src/services/examService';

import ExamCard from './ExamCard';

export default function ExamList() {
  const [exams, setExams] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let mounted = true;
    examService.getExams()
      .then((res: any) => { if (mounted) setExams(res || []); })
      .catch(() => { if (mounted) setExams([]); });
    return () => { mounted = false; };
  }, []);

  const filtered = exams.filter((e) => (e?.name || e?.title || '').toLowerCase().includes(query.toLowerCase()));

  return (
    <Box>
      <TextField fullWidth placeholder="Tìm kiếm kỳ thi" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ mb: 2 }} />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
        {filtered.map((exam: any) => (
          <Box key={exam.id || exam._id || exam.name}>
            <ExamCard exam={exam} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
