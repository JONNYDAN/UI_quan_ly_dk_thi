import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import { RootState } from 'src/store';
import thptService from 'src/services/thptService';
import { DashboardContent } from 'src/layouts/dashboard';
import provinceService from 'src/services/provinceService';
import districtService from 'src/services/districtService';
import userService, {
  UpdateUserData,
  ChangePasswordData,
  User as ApiUser,
  UserInfo as ApiUserInfo,
} from 'src/services/userService';

// ----------------------------------------------------------------------

// Types
interface Province {
  id: number;
  code: string;
  name: string;
  [key: string]: any;
}

interface District {
  id: number;
  code: string;
  name: string;
  [key: string]: any;
}

interface THPT {
  id: number;
  code: string;
  name: string;
  [key: string]: any;
}

interface UserData extends ApiUser {
  createdAt: string;
  birthday: string;
}

interface ExtendedUserInfo extends ApiUserInfo {
  school?: string;
  district?: string;
  province?: string;
  schoolprovinceId?: string;
  schooldistrictId?: string;
  schoolId?: string;
}

interface FormData extends UpdateUserData {
  cccd: string;
  fullname: string;
  birthday: string;
  phone: string;
  email: string;
  schoolId: string;
  school: string;
  schooldistrictId: string;
  schoolprovinceId: string;
}

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const navigate = useNavigate();
  const { user: currentUser, isLoggedIn } = useSelector((state: RootState) => state.auth);

  // State
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userInfo, setUserInfo] = useState<ExtendedUserInfo | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [openPasswordModal, setOpenPasswordModal] = useState<boolean>(false);
  const [openInfoModal, setOpenInfoModal] = useState<boolean>(false);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // School selection states
  const [schoolProvinces, setSchoolProvinces] = useState<Province[]>([]);
  const [schoolDistricts, setSchoolDistricts] = useState<District[]>([]);
  const [thpts, setThpts] = useState<THPT[]>([]);

  // Form data
  const [formData, setFormData] = useState<FormData>({
    cccd: '',
    fullname: '',
    birthday: '',
    phone: '',
    email: '',
    schoolId: '',
    school: '',
    schooldistrictId: '',
    schoolprovinceId: '',
  });

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await provinceService.getAllProvinces();
        setSchoolProvinces(response?.data || []);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province is selected
  useEffect(() => {
    const fetchDistricts = async (provinceCode: string) => {
      try {
        const response = await districtService.getDistrictsByProvince(provinceCode);
        if (Array.isArray(response?.data)) {
          setSchoolDistricts(response?.data);
        } else {
          setSchoolDistricts([]);
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
        setSchoolDistricts([]);
      }
    };

    if (formData.schoolprovinceId) {
      fetchDistricts(formData.schoolprovinceId);
    }
  }, [formData.schoolprovinceId]);

  // Fetch THPT schools when province and district are selected
  useEffect(() => {
    const fetchTHPTs = async (provinceCode: string, districtCode: string) => {
      if (provinceCode && districtCode) {
        try {
          const response = await thptService.getTHPTsByProvinceAndDistrict(provinceCode, districtCode);
          setThpts(response.data || []);
        } catch (error) {
          console.error('Error fetching THPTs:', error);
          setThpts([]);
        }
      }
    };

    if (formData.schoolprovinceId && formData.schooldistrictId) {
      fetchTHPTs(formData.schoolprovinceId, formData.schooldistrictId);
    }
  }, [formData.schoolprovinceId, formData.schooldistrictId]);

  // Fetch user data
  useEffect(() => {
    if (isLoggedIn) {
      const fetchUserData = async () => {
        try {
          const response = await userService.getUserInfo();
          const userDataResponse = response.data;
          const userInfoData = response.info;

          if (userDataResponse && userInfoData) {
            setUserData({
              ...userDataResponse,
              birthday: userDataResponse.birthday || '',
              createdAt: userDataResponse.createdAt || new Date().toISOString(),
            });
            setUserInfo(userInfoData);

            setFormData({
              cccd: userDataResponse.cccd || '',
              fullname: userDataResponse.fullname || '',
              birthday: userDataResponse.birthday || '',
              phone: userDataResponse.phone || '',
              email: userDataResponse.email || '',
              schooldistrictId: userInfoData.schooldistrictId || '',
              schoolId: userInfoData.schoolId || '',
              schoolprovinceId: userInfoData.schoolprovinceId || '',
              school: userInfoData.school || '',
            });
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      };

      fetchUserData();
    } else {
      navigate('/sign-in');
    }
  }, [isLoggedIn, navigate]);

  // Handlers
  const handleOpenPasswordModal = () => setOpenPasswordModal(true);
  const handleClosePasswordModal = () => {
    setOpenPasswordModal(false);
    setErrorMessage('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleOpenInfoModal = () => setOpenInfoModal(true);
  const handleCloseInfoModal = () => {
    setOpenInfoModal(false);
    setErrorMessage('');
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const handleSubmitUpdate = async () => {
    try {
      const response = await userService.updateUserInfo(formData);

      if (response.status === 200) {
        setSnackbarMessage('Cập nhật thông tin thành công!');
        setOpenSnackbar(true);
        handleCloseInfoModal();

        // Refresh user data
        const userResponse = await userService.getUserInfo();
        const userDataResponse = userResponse.data;
        if (userDataResponse) {
          setUserData({
            ...userDataResponse,
            birthday: userDataResponse.birthday || '',
            createdAt: userDataResponse.createdAt || new Date().toISOString(),
          });
        }
        setUserInfo(userResponse.info || null);
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      setErrorMessage('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      // Only allow numbers and limit to 10 digits
      if (/^\d{0,10}$/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateChange = (date: string) => {
    setFormData((prev) => ({ ...prev, birthday: date }));
  };

  const handleProvinceChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      schoolprovinceId: value,
      schooldistrictId: '',
      schoolId: '',
      school: '',
    }));
    setSchoolDistricts([]);
    setThpts([]);
  };

  const handleDistrictChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      schooldistrictId: value,
      schoolId: '',
      school: '',
    }));
    setThpts([]);
  };

  const handleSchoolChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    const selectedSchool = thpts.find((school) => school.code === value);

    setFormData((prev) => ({
      ...prev,
      schoolId: value,
      school: selectedSchool ? selectedSchool.name : '',
    }));
  };

  const handlePasswordSubmit = async () => {
  setErrorMessage('');

  if (newPassword.length < 8) {
    setErrorMessage('Mật khẩu mới phải có ít nhất 8 ký tự.');
    return;
  }

  if (newPassword !== confirmPassword) {
    setErrorMessage('Mật khẩu mới và mật khẩu xác nhận không trùng khớp.');
    return;
  }

  const data: ChangePasswordData = {
    currentPassword: currentPassword,
    oldPassword: currentPassword,
    newPassword,
    confirmPassword: confirmPassword,
  };

  setLoading(true);

  try {
    await userService.postChangePassword(data);
    setSnackbarMessage('Đổi mật khẩu thành công!');
    setOpenSnackbar(true);
    handleClosePasswordModal();
  } catch (error: any) {
    setErrorMessage(error.response?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
  } finally {
    setLoading(false);
  }
};

  if (!isLoggedIn || !userData) {
    return null;
  }

  return (
    <DashboardContent maxWidth="xl">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* User Profile Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ textAlign: 'center', p: 3, borderRadius: 3, boxShadow: 3 }}>
              <Avatar
                src="/assets/images/avatar_default.jpg"
                alt={userData.fullname}
                sx={{
                    width: 120,
                    height: 150,
                    borderRadius: 2,
                    border: (theme) => `4px solid ${theme.palette.background.paper}`,
                    mx: 'auto',
                  }}
              />
              <Typography variant="h6">{userData.fullname}</Typography>
              <Typography variant="body2" color="text.secondary">
                Số CCCD: {userData.cccd}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ngày sinh: {userData.birthday}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email: {userData.email !== 'noemail@mail.com' ? userData.email : 'Chưa cập nhật'}
              </Typography>
              {userData.student_id && (
                <Typography variant="body2" color="text.secondary">
                  MSSV: {userData.student_id}
                </Typography>
              )}
              <Divider sx={{ my: 2 }} />
              <Stack direction="column" spacing={1}>
                <Button variant="outlined" fullWidth onClick={handleOpenPasswordModal}>
                  Đổi mật khẩu
                </Button>
                <Button variant="contained" fullWidth onClick={handleOpenInfoModal}>
                  Chỉnh sửa thông tin
                </Button>
              </Stack>
            </Card>
          </Grid>

          {/* User Details Card */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Thông tin chi tiết
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Họ và tên
                      </Typography>
                      <Typography variant="body1">{userData.fullname}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Giới tính
                      </Typography>
                      <Typography variant="body1">{userData.gender === 1 ? 'Nữ' : 'Nam'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Số điện thoại
                      </Typography>
                      <Typography variant="body1">{userData.phone || 'Chưa cập nhật'}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Trường học
                      </Typography>
                      <Typography variant="body1">
                        {userInfo?.school || ''}
                        {userInfo?.school && userInfo?.district ? ', ' : ''}
                        {userInfo?.district || ''}
                        {userInfo?.district && userInfo?.province ? ', ' : ''}
                        {userInfo?.province || 'Chưa cập nhật'}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Ngày đăng ký tài khoản
                      </Typography>
                      <Typography variant="body1">
                        {dayjs(userData.createdAt).format('DD/MM/YYYY HH:mm:ss')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Password Change Modal */}
      <Dialog open={openPasswordModal} onClose={handleClosePasswordModal}>
        <DialogTitle>Đổi mật khẩu</DialogTitle>
        <DialogContent>
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Mật khẩu hiện tại"
              type={showCurrentPassword ? 'text' : 'password'}
              variant="outlined"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Mật khẩu mới"
              type={showNewPassword ? 'text' : 'password'}
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Nhập lại mật khẩu mới"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordModal} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handlePasswordSubmit}
            color="primary"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Đang thay đổi...' : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Info Modal */}
      <Dialog open={openInfoModal} onClose={handleCloseInfoModal} maxWidth="md" fullWidth>
        <DialogTitle>Cập nhật thông tin</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Số CCCD"
                  variant="outlined"
                  fullWidth
                  name="cccd"
                  value={formData.cccd}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Họ và tên"
                  variant="outlined"
                  fullWidth
                  name="fullname"
                  value={formData.fullname.toUpperCase()}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Ngày sinh (DD/MM/YYYY)"
                  variant="outlined"
                  fullWidth
                  name="birthday"
                  value={formData.birthday}
                  onChange={(e) => handleDateChange(e.target.value)}
                  placeholder="DD/MM/YYYY"
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Số điện thoại"
                  variant="outlined"
                  fullWidth
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {/* School Information */}
            <Box sx={{ mt: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Trường THPT
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel id="province-label">Tỉnh/Thành phố</InputLabel>
                    <Select
                      labelId="province-label"
                      label="Tỉnh/Thành phố"
                      value={formData.schoolprovinceId}
                      onChange={handleProvinceChange}
                      name="schoolprovinceId"
                    >
                      {schoolProvinces.map((province) => (
                        <MenuItem key={province.id} value={province.code}>
                          {province.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel id="district-label">Quận/Huyện</InputLabel>
                    <Select
                      labelId="district-label"
                      label="Quận/Huyện"
                      value={formData.schooldistrictId}
                      onChange={handleDistrictChange}
                      name="schooldistrictId"
                      disabled={!formData.schoolprovinceId}
                    >
                      {schoolDistricts.map((district) => (
                        <MenuItem key={district.id} value={district.code}>
                          {district.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <FormControl fullWidth>
                    <InputLabel id="school-label">Trường THPT</InputLabel>
                    <Select
                      labelId="school-label"
                      label="Trường THPT"
                      value={formData.schoolId}
                      onChange={handleSchoolChange}
                      name="schoolId"
                      disabled={!formData.schooldistrictId}
                    >
                      {thpts.map((thpt) => (
                        <MenuItem key={thpt.id} value={thpt.code}>
                          {thpt.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoModal} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleSubmitUpdate} color="primary" variant="contained">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </DashboardContent>
  );
}