import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import List from '@mui/material/List';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';

import { DashboardContent } from 'src/layouts/dashboard';
import { _posts, _tasks, _traffic, _timeline } from 'src/_mock';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const user = {
    name: 'Nguyễn Văn A',
    studentId: 'SV2021001',
    email: 'vana@example.com',
    class: 'CNTT K47',
    avatar: '/assets/images/avatar_default.jpg',
  };

  const examHistory = [
    { id: 1, exam: 'Kỳ thi Tiếng Anh B1', date: '12/03/2025', status: 'Đã hoàn thành', score: '82/100' },
    { id: 2, exam: 'Kỳ thi Tin học cơ bản', date: '05/05/2025', status: 'Đang chờ kết quả', score: '-' },
  ];

  const registeredServices = [
    { id: 1, name: 'Thư viện số', date: '01/02/2025' },
    { id: 2, name: 'Dịch vụ WiFi sinh viên', date: '15/03/2025' },
    { id: 3, name: 'Ký túc xá khu A', date: '20/04/2025' },
  ];

  return (
    <DashboardContent maxWidth="xl">
      <Grid container spacing={3}>
        {/* Thông tin người dùng */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ textAlign: 'center', p: 3, borderRadius: 3, boxShadow: 3 }}>
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              Mã sinh viên: {user.studentId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lớp: {user.class}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {user.email}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Button variant="outlined" fullWidth>
              Chỉnh sửa thông tin
            </Button>
          </Card>
        </Grid>

        {/* Lịch sử đăng ký kỳ thi */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📘 Lịch sử đăng ký 
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên kỳ thi</TableCell>
                    <TableCell>Ngày đăng ký</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell>Kết quả</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {examHistory.map((exam) => (
                    <TableRow key={exam.id}>
                      <TableCell>{exam.exam}</TableCell>
                      <TableCell>{exam.date}</TableCell>
                      <TableCell>{exam.status}</TableCell>
                      <TableCell>{exam.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>

        {/* Các dịch vụ đã đăng ký */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🧾 Các dịch vụ đã đăng ký
              </Typography>
              <List>
                {registeredServices.map((service) => (
                  <ListItem key={service.id} divider>
                    <ListItemText
                      primary={service.name}
                      secondary={`Ngày đăng ký: ${service.date}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}

// export function OverviewAnalyticsView() {
//   return (
//     <DashboardContent maxWidth="xl">

//       <Grid container spacing={3}>
//         <Grid size={{ xs: 12, sm: 6, md: 5 }}>
//           <AnalyticsWidgetSummary
//             title="Weekly sales"
//             percent={2.6}
//             total={714000}
//             icon={<img alt="Weekly sales" src="/assets/icons/glass/ic-glass-bag.svg" />}
//             chart={{
//               categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
//               series: [22, 8, 35, 50, 82, 84, 77, 12],
//             }}
//           />
//         </Grid>

//         <Grid size={{ xs: 12, sm: 6, md: 7 }}>
//           <AnalyticsWidgetSummary
//             title="New users"
//             percent={-0.1}
//             total={1352831}
//             color="secondary"
//             icon={<img alt="New users" src="/assets/icons/glass/ic-glass-users.svg" />}
//             chart={{
//               categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
//               series: [56, 47, 40, 62, 73, 30, 23, 54],
//             }}
//           />
//         </Grid>

//         <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//           <AnalyticsWidgetSummary
//             title="Purchase orders"
//             percent={2.8}
//             total={1723315}
//             color="warning"
//             icon={<img alt="Purchase orders" src="/assets/icons/glass/ic-glass-buy.svg" />}
//             chart={{
//               categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
//               series: [40, 70, 50, 28, 70, 75, 7, 64],
//             }}
//           />
//         </Grid>

//         <Grid size={{ xs: 12, sm: 6, md: 3 }}>
//           <AnalyticsWidgetSummary
//             title="Messages"
//             percent={3.6}
//             total={234}
//             color="error"
//             icon={<img alt="Messages" src="/assets/icons/glass/ic-glass-message.svg" />}
//             chart={{
//               categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
//               series: [56, 30, 23, 54, 47, 40, 62, 73],
//             }}
//           />
//         </Grid>

//         {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
//           <AnalyticsCurrentVisits
//             title="Current visits"
//             chart={{
//               series: [
//                 { label: 'America', value: 3500 },
//                 { label: 'Asia', value: 2500 },
//                 { label: 'Europe', value: 1500 },
//                 { label: 'Africa', value: 500 },
//               ],
//             }}
//           />
//         </Grid> */}

//         {/* <Grid size={{ xs: 12, md: 6, lg: 8 }}>
//           <AnalyticsWebsiteVisits
//             title="Website visits"
//             subheader="(+43%) than last year"
//             chart={{
//               categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
//               series: [
//                 { name: 'Team A', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] },
//                 { name: 'Team B', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
//               ],
//             }}
//           />
//         </Grid> */}

//         <Grid size={{ xs: 12, md: 6, lg: 8 }}>
//           <AnalyticsConversionRates
//             title="Conversion rates"
//             subheader="(+43%) than last year"
//             chart={{
//               categories: ['Italy', 'Japan', 'China', 'Canada', 'France'],
//               series: [
//                 { name: '2022', data: [44, 55, 41, 64, 22] },
//                 { name: '2023', data: [53, 32, 33, 52, 13] },
//               ],
//             }}
//           />
//         </Grid>

//         <Grid size={{ xs: 12, md: 6, lg: 4 }}>
//           <AnalyticsCurrentSubject
//             title="Current subject"
//             chart={{
//               categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
//               series: [
//                 { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
//                 { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
//                 { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
//               ],
//             }}
//           />
//         </Grid>

//         <Grid size={{ xs: 12, md: 6, lg: 8 }}>
//           <AnalyticsNews title="News" list={_posts.slice(0, 5)} />
//         </Grid>

//         {/* <Grid size={{ xs: 12, md: 6, lg: 4 }}>
//           <AnalyticsOrderTimeline title="Order timeline" list={_timeline} />
//         </Grid> */}

//         <Grid size={{ xs: 12, md: 6, lg: 4 }}>
//           <AnalyticsTrafficBySite title="Traffic by site" list={_traffic} />
//         </Grid>

//         {/* <Grid size={{ xs: 12, md: 6, lg: 8 }}>
//           <AnalyticsTasks title="Tasks" list={_tasks} />
//         </Grid> */}
//       </Grid>
//     </DashboardContent>
//   );
// }
