import { useTheme } from '@mui/material/styles';
import { Container, Typography, Box } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

export default function StudentInfoView() {
  const theme = useTheme();

  return (
    <DashboardContent>
      <Box>
        <Box
          sx={{
            mb: 5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Thông tin thí sinh
          </Typography>
          {/* <Typography variant="body1" color="text.secondary">
            Xem thông tin chi tiết thí sinh
          </Typography> */}
        </Box>
      </Box>
    </DashboardContent>
  );
}
