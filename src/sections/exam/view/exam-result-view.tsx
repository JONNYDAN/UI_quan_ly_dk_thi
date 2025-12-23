import React, { useEffect, useState } from 'react';

import { Box, Card, CardContent, Typography } from '@mui/material';

import examService from 'src/services/examService';

export default function ExamResultView(){
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    // For demo, load results by dummy cccd if needed
    // examService.getExamResults('')
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5">Exam results</Typography>
          <Typography sx={{ mt: 2 }}>Kết quả thi sẽ được hiển thị tại đây.</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}