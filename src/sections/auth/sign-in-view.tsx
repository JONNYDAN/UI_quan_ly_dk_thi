import { useState, useRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/contexts/AuthContext';

import { Iconify } from 'src/components/iconify';

import { loginAPI, verifyCCCD } from '../../services/authService';

export function SignInView() {
  const { login, loginFromResponse } = useAuth();
  const router = useRouter();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [showPassword, setShowPassword] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [cccdImage, setCccdImage] = useState<string>('');
  const [ocrData, setOcrData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    password: '',
    cccd: '', // For manual fallback
  });

  // Clean up camera on unmount
  useEffect(() => () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
  }, [stream]);

  // Attach/detach stream to video element when stream changes (fix race with conditional render)
  useEffect(() => {
    if (videoRef.current) {
      if (stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => console.error('Error playing video:', err));
        };
        videoRef.current.play?.().catch(() => {});
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const startCamera = async () => {
    try {
      setLoading(true);
      setError('');

      // Stop any existing streams before starting a new one
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
        setCameraActive(false);
      }

      // Kiểm tra quyền camera
      const hasPermission = await checkCameraPermission();
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });

      // Save stream and let effect attach to the video element when it exists
      setStream(mediaStream);

      setCameraActive(true);
      setPhotoTaken(false);
      setError('');
    } catch (err: any) {
      let errorMessage = 'Không thể truy cập camera. ';
      
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMessage += 'Không tìm thấy camera.';
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage += 'Quyền truy cập camera bị từ chối.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage += 'Trình duyệt không hỗ trợ camera.';
      } else if (err.name === 'ConstraintNotSatisfiedError') {
        errorMessage += 'Camera không hỗ trợ độ phân giải yêu cầu.';
      } else {
        errorMessage += 'Vui lòng kiểm tra quyền truy cập.';
      }
      
      setError(errorMessage);
      console.error('Camera error:', err);
    } finally {
      setLoading(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCccdImage(imageData);
      setPhotoTaken(true);
      
      // Stop camera stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
        setCameraActive(false);
        if (videoRef.current) videoRef.current.srcObject = null;
      }
      
      // Extract CCCD from image
      extractCCCDInfo(imageData);
    }
  };

  const retakePhoto = () => {
    setPhotoTaken(false);
    setCccdImage('');
    setOcrData(null);
    // Ensure previous stream cleared and restart camera
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setTimeout(() => startCamera(), 100);
  };

  const extractCCCDInfo = async (imageBase64: string) => {
    try {
      setLoading(true);
      const result = await verifyCCCD(imageBase64);
      if (result.status === "success") {
        setOcrData(result.ocr_data);
        setFormData(prev => ({ ...prev, cccd: result.ocr_data?.id || '' }));
      } else {
        setError('Không thể đọc thông tin CCCD. Vui lòng chụp lại hoặc nhập thủ công.');
      }
    } catch (err) {
      setError('Lỗi xử lý ảnh CCCD. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const checkCameraPermission = async () => {
    try {
      // Kiểm tra permission
      const permissionStatus = await navigator.permissions.query({
        name: 'camera' as PermissionName,
      });

      if (permissionStatus.state === 'denied') {
        setError('Camera đã bị từ chối. Vui lòng cấp quyền trong trình duyệt.');
        return false;
      }

      if (permissionStatus.state === 'prompt') {
        console.log('Camera permission is prompt');
      }

      // Kiểm tra thiết bị có camera không
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === 'videoinput');

      if (videoDevices.length === 0) {
        setError('Không tìm thấy camera trên thiết bị.');
        return false;
      }

      return true;
    } catch (err) {
      console.error('Permission check error:', err);
      return true; // Vẫn thử mở camera nếu kiểm tra thất bại
    }
  };

  const handleSignIn = async () => {
    if (!formData.password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }

    if (!cccdImage && !formData.cccd) {
      setError('Vui lòng chụp ảnh CCCD hoặc nhập số CCCD thủ công');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const loginData: any = { 
        password: formData.password 
      };
      
      if (cccdImage) {
        loginData.cccd_image = cccdImage;
      } else {
        loginData.cccd = formData.cccd;
      }

      console.log('Sending login data:', { ...loginData, cccd_image: cccdImage ? '[BASE64_IMAGE]' : null });

      const result = await loginAPI(loginData);
      console.log("Đăng nhập thành công", result);
      
      // Kiểm tra cấu trúc response
      if (!result) {
        throw new Error('Không nhận được phản hồi từ server');
      }
      
      if (result.status !== 'success') {
        throw new Error(result.message || 'Đăng nhập thất bại');
      }
      
      if (!result.user || !result.tokens || !result.tokens.accessToken) {
        throw new Error('Dữ liệu đăng nhập không hợp lệ');
      }
      
      console.log('Login successful, user data:', result.user);
      console.log('Tokens received:', result.tokens);
      
      // Lưu thông tin user và token với cấu trúc đúng
      // result.tokens.accessToken thay vì result.authorization.token
      loginFromResponse(result);
      
      // Điều hướng đến dashboard
      router.push('/dashboard/');
      
    } catch (err: any) {
      console.error("Lỗi đăng nhập chi tiết:", err);
      
      // Xử lý các loại lỗi khác nhau
      let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại.';
      
      if (err.response) {
        // Lỗi từ server với status code
        const serverError = err.response.data;
        errorMessage = serverError.message || `Lỗi ${err.response.status}: ${serverError.error || 'Lỗi không xác định'}`;
      } else if (err.request) {
        // Không nhận được response
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else if (err.message) {
        // Lỗi từ code
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '450px',
        padding: '30px',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 6px 20px rgba(18,72,116,0.15)',
        borderTop: '6px solid #124874',
        textAlign: 'center'
      }}>
        <img 
          src="/images/logo.png" 
          alt="Logo SP HCM" 
          height="80"
          style={{ display: 'block', margin: '0 auto' }}
        />
        <h4 style={{ marginTop: '15px', marginBottom: '10px', color: '#124874' }}>
          TRƯỜNG ĐH SƯ PHẠM TP.HCM
        </h4>
        <p style={{ color: '#6c757d', marginBottom: '30px' }}>
          Hệ thống đăng nhập với xác thực CCCD
        </p>

        {error && (
          <div style={{
            padding: '10px 15px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            {error}
          </div>
        )}

        {/* Manual CCCD Input */}
        <TextField
          fullWidth
          name="cccd"
          label="Nhập số CCCD"
          value={formData.cccd}
          onChange={handleChange}
          disabled={!!ocrData?.id}
          style={{ marginBottom: '20px' }}
        />

        {/* Password Input */}
        <TextField
          fullWidth
          name="password"
          label="Mật khẩu"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          style={{ marginBottom: '20px' }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSignIn}
          disabled={loading}
          style={{
            backgroundColor: '#CF373D',
            color: 'white',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 500,
            marginTop: '10px'
          }}
        >
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <Typography variant="body2" style={{ color: '#6c757d' }}>
            Chưa có tài khoản?{' '}
            <Link 
              href="/sign-up" 
              style={{ 
                color: '#124874', 
                textDecoration: 'none',
                fontWeight: 500 
              }}
            >
              Đăng ký ngay
            </Link>
          </Typography>
          <Typography variant="body2" style={{ color: '#6c757d', marginTop: '5px' }}>
            <Link 
              href="/forgot-password" 
              style={{ 
                color: '#124874', 
                textDecoration: 'none' 
              }}
            >
              Quên mật khẩu?
            </Link>
          </Typography>
        </div>

        <div style={{
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px dashed #dee2e6',
          textAlign: 'center'
        }}>
          <Typography variant="overline" style={{ color: '#6c757d', fontWeight: 500 }}>
            HCMUE
          </Typography>
        </div>
      </div>

      <footer style={{ 
        textAlign: 'center', 
        color: '#6c757d', 
        marginTop: '20px',
        paddingBottom: '20px'
      }}>
        © 2025 Ho Chi Minh City University of Education
      </footer>
    </div>
  );
}