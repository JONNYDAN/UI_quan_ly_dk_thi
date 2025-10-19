import { useState, useCallback } from 'react';

import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { CccdSection } from 'src/sections/profile/cccd-section';

import { ProfileTabs } from '../profile-tabs';
import { ProfileInfoItem } from '../profile-info-item';

import type { IUserProfile } from '../profile-info-item';


// ----------------------------------------------------------------------

type Props = {
  user: IUserProfile;
};

export function ProfileView({ user }: Props) {
  const [activeTab, setActiveTab] = useState('cccd');
  const [openEdit, setOpenEdit] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    email: user.email || '',
    phone: user.phone || '',
    location: user.location || '',
  });

  const handleTabChange = useCallback((newTab: string) => {
    setActiveTab(newTab);
  }, []);

  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    console.log('Updated info:', formData);
    // TODO: Gọi API cập nhật user tại đây
    handleCloseEdit();
  };


  return (
    <DashboardContent>
      <Container maxWidth="lg">

        <Grid container spacing={4} sx={{ mt: 3}}>
          {/* Sidebar Profile Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ position: 'relative' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 2,
                }}
              >
                <Avatar
                  src={user.avatarUrl}
                  sx={{
                    width: 120,
                    height: 150,
                    borderRadius: 2,
                    border: (theme) => `4px solid ${theme.palette.background.paper}`,
                  }}
                >
                  {user.displayName?.charAt(0).toUpperCase()}
                </Avatar>
              </Box>

                <CardContent sx={[
                  (theme) => ({
                    pl: 2,
                    py: 1,
                    gap: 2,
                    pr: 1.5,
                    borderRadius: 0.75,
                    typography: 'body2',
                    fontWeight: 'fontWeightMedium',
                    color: theme.vars.palette.text.secondary,
                    minHeight: 44,
                    textAlign: 'center',
                  }),
                ]}>
                <Typography variant="h5" gutterBottom>
                  {user.displayName}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Chip
                    icon={<Iconify icon={user.verified ? "material-symbols:verified" : "material-symbols:warning" as any} />}
                    label={user.verified ? "Đã xác thực" : "Chưa xác thực"}
                    color={user.verified ? "success" : "warning"}
                    variant="outlined"
                    sx={{ px: 1, py: 0.5 }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Contact Information */}
                <Box sx={{ textAlign: 'left' }}>
                  <ProfileInfoItem
                    icon="mingcute:mail-line"
                    label="Email"
                    value={user.email}
                  />
                  
                  <ProfileInfoItem
                    icon="mingcute:phone-line"
                    label="Điện thoại"
                    value={user.phone}
                  />
                  
                  <ProfileInfoItem
                    icon="mingcute:location-fill"
                    label="Địa chỉ"
                    value={user.location}
                  />
                  
                  <ProfileInfoItem
                    icon="mingcute:calendar-line"
                    label="Ngày tham gia"
                    value={user.joinDate}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Verification Status */}
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="solar:pen-bold" />}
                    onClick={handleOpenEdit}
                  >
                    Cập nhật
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Main Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                {/* Profile Tabs */}
                <ProfileTabs
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  tabs={[
                    { value: 'cccd', label: 'Chứng minh thư' },
                    { value: 'education', label: 'Học vấn' },
                    { value: 'experience', label: 'Lịch đăng ký' },
                  ]}
                />

                {/* Tab Content */}
                {activeTab === 'cccd' && (
                  <CccdSection 
                    user={user}
                    onUpdateCccd={(side, imageUrl) => {
                      // Xử lý cập nhật user state hoặc gọi API
                      console.log(`Update ${side} with:`, imageUrl);
                    }}
                  />
                )}

                {activeTab === 'experience' && (
                  <Box sx={{ py: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Work Experience
                    </Typography>
                    
                    {user.experience?.map((exp, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {exp.position}
                        </Typography>
                        <Typography variant="body2" color="primary" gutterBottom>
                          {exp.company} • {exp.period}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {exp.description}
                        </Typography>
                        {user.experience && index < user.experience.length - 1 && <Divider sx={{ my: 2 }} />}
                      </Box>
                    ))}

                    {(!user.experience || user.experience.length === 0) && (
                      <Typography variant="body2" color="text.secondary">
                        No work experience added.
                      </Typography>
                    )}
                  </Box>
                )}

                {activeTab === 'education' && (
                  <Box sx={{ py: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Education
                    </Typography>
                    
                    {user.education?.map((edu, index) => (
                      <Box key={index} sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {edu.degree}
                        </Typography>
                        <Typography variant="body2" color="primary" gutterBottom>
                          {edu.school} • {edu.period}
                        </Typography>
                        {edu.description && (
                          <Typography variant="body2" color="text.secondary">
                            {edu.description}
                          </Typography>
                        )}
                        {user.education && index < user.education.length - 1 && <Divider sx={{ my: 2 }} />}
                      </Box>
                    ))}

                    {(!user.education || user.education.length === 0) && (
                      <Typography variant="body2" color="text.secondary">
                        No education information added.
                      </Typography>
                    )}
                  </Box>
                )}

              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Dialog Chỉnh sửa thông tin */}
      <Dialog open={openEdit} onClose={handleCloseEdit} fullWidth maxWidth="sm" container={document.body}>
        <DialogTitle>Cập nhật thông tin cá nhân</DialogTitle>
        <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Họ và tên"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            fullWidth
            sx={{ mt: 2 }}
          />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth />
          <TextField label="Điện thoại" name="phone" value={formData.phone} onChange={handleChange} fullWidth />
          <TextField label="Địa chỉ" name="location" value={formData.location} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Hủy</Button>
          <Button variant="contained" onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}