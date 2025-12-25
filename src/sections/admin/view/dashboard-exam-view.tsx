import React, { useEffect, useState } from 'react';

import { Box, Card, Typography, List, ListItem } from '@mui/material';

import examService from 'src/services/examService';

export default function DashboardExamView() {
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    examService.getExams()
      .then((res: any) => { if (mounted) setExams(res || []); })
      .catch(() => { if (mounted) setExams([]); });
    return () => { mounted = false; };
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Exams</Typography>
        <List>
          {exams.map((e) => (
            <ListItem key={e.id}>{e.name || e.title || JSON.stringify(e)}</ListItem>
          ))}
        </List>
      </Card>
    </Box>
  );
}