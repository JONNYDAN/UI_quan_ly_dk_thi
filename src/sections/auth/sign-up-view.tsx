import { useState, useRef, useEffect } from 'react';

import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Tabs,
  Tab,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import thptService, { THPT } from '../../services/thptService';
import { register, verifyCCCD } from '../../services/authService';
import provinceService, { Province } from '../../services/provinceService';
import districtService, { District } from '../../services/districtService';

// const steps = ['Chụp/tải ảnh CCCD', 'Nhập thông tin tài khoản', 'Thông tin Trường THPT'];
const steps = ['Bước 1', 'Bước 2', 'Bước 3'];

// Tab selection
enum CaptureMode {
  CAMERA = 'camera',
  UPLOAD = 'upload'
}

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ open, onClose, onAccept }) => {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const contentRef = useRef(null);

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      // Kiểm tra xem đã scroll đến cuối chưa (với độ chính xác 5px)
      const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 5;
      setScrolledToBottom(isAtBottom);
    }
  };

  const handleAccept = () => {
    onAccept();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          maxHeight: '80vh',
          minHeight: '500px',
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Iconify icon="material-symbols:contract-outline" width={24} sx={{ mr: 1 }} />
          ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ
        </Box>
        <IconButton 
          onClick={onClose} 
          sx={{ color: 'white' }}
          size="small"
        >
          <Iconify icon="material-symbols:close" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent 
        dividers
        ref={contentRef}
        onScroll={handleScroll}
        sx={{ 
          position: 'relative',
          p: 0
        }}
      >
        {/* Scroll Indicator */}
        {!scrolledToBottom && (
          <Box
            sx={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              bgcolor: 'warning.light',
              color: 'warning.contrastText',
              py: 1,
              px: 2,
              textAlign: 'center',
              fontSize: '0.875rem',
              fontWeight: 'medium',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Iconify icon="material-symbols:keyboard-double-arrow-down" width={20} />
            <span>Vui lòng đọc hết nội dung để tiếp tục</span>
            <Iconify icon="material-symbols:keyboard-double-arrow-down" width={20} />
          </Box>
        )}

        <Box sx={{ p: 3 }}>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'justify',
              fontWeight: 'regular',
              lineHeight: 1.6,
            }}
          >
            <p>Chào mừng thí sinh đến với trang thông tin điện tử Kỳ thi đánh giá năng lực chuyên biệt của Trường Đại học Sư phạm Thành phố Hồ Chí Minh (sau đây gọi tắt là Trường).</p>
            <p>Cùng với việc truy cập trang dgnl.hcmue.edu.vn và sử dụng các dịch vụ, thí sinh đồng ý bị ràng buộc với Điều khoản Sử dụng này, Chính sách Quảng cáo và Chính sách Bảo mật của chúng tôi.</p>
            
            <Typography sx={{ fontWeight: 'bold', my: 2, color: 'primary.main' }}>
              1. Đăng ký tài khoản
            </Typography>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Để sử dụng dịch vụ trên trang thông tin điện tử dgnl.hcmue.edu.vn, thí sinh đăng ký tài khoản với các thông tin cơ bản theo yêu cầu;</li>
              <li>Sau khi đăng ký thành công, thí sinh đăng nhập với thông tin tài khoản với tài khoản là số Căn cước công dân (CCCD) và mật khẩu mặc định là ngày sinh theo định dạng DDMMYYYY (ví dụ: 25122023).</li>
            </ul>

            <Typography sx={{ fontWeight: 'bold', my: 2, color: 'primary.main' }}>
              2. Quyền được bảo mật thông tin
            </Typography>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Khi sử dụng dịch vụ trên trang dgnl.hcmue.edu.vn, thí sinh được đảm bảo rằng những thông tin bạn cung cấp sẽ chỉ được dùng vào mục đích thi và nâng cao hiệu quả phục vụ của Trường. Những thông tin này sẽ không được chuyển giao cho bên thứ ba nào khác vì mục đích thương mại. Những thông tin này hoàn toàn được bảo mật, chỉ trong trường hợp pháp luật yêu cầu, Trường buộc phải cung cấp thông tin cho cơ quan chức năng theo quy định pháp luật;</li>
              <li>Thông tin của thí sinh cùng với kết quả thi được lưu trữ 2 năm trên website và được lưu trữ theo nghiệp vụ tại Trường.</li>
            </ul>

            {/* Các phần còn lại giữ nguyên... */}
            <Typography sx={{ fontWeight: 'bold', my: 2, color: 'primary.main' }}>
              3. Kết nối vào/ra từ website
            </Typography>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Một số nội dung trên trang dgnl.hcmue.edu.vn chỉ liên kết tới một số trang thông tin điện tử khác của Trường có phần địa chỉ gốc hcmue.edu.vn. Trường không kết nối hoặc điều hướng đến các trang thông tin điện tử của đơn vị hoặc đối tác khác;</li>
              <li>Khi thí sinh phát hiện nội dung có các đường dẫn tới các trang khác ngoài tên miền hcmue.edu.vn; vui lòng không truy cập vào các nội dung này.</li>
            </ul>

            <Typography sx={{ fontWeight: 'bold', my: 2, color: 'primary.main' }}>
              4. Trách nhiệm của thí sinh
            </Typography>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Thí sinh cần đọc kỹ tất cả các thông tin Điều khoản dịch vụ khi đăng ký dự thi;</li>
              <li>Thí sinh tuyệt đối không được xâm nhập bất hợp pháp vào hệ thống hoặc làm thay đổi cấu trúc dữ liệu của trang dgnl.hcmue.edu.vn dưới bất kỳ hình thức nào. Thí sinh không được sử dụng bất kỳ phương tiện nào để can thiệp hoặc cổ vũ việc xâm nhập hệ thống máy chủ của Trường. Nếu thí sinh thấy bất kỳ lỗi nào xảy ra trong quá trình sử dụng, xin vui lòng báo cho Trường qua số điện thoại 08 3835 2020 hoặc email dgnl.hotro@hcmue.edu.vn.</li>
            </ul>

            <Typography sx={{ fontWeight: 'bold', my: 2, color: 'primary.main' }}>
              5. Thông tin phòng thi
            </Typography>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Thí sinh cần truy cập vào tài khoản đã đăng ký để xem thông tin phòng thi được Hội đồng thi sắp xếp trước khi đến dự thi. Thí sinh không bắt buộc phải in phiếu dự thi (file PDF trên website). Thông tin cần ghi nhớ là Phòng thi, giờ thi; </li>
              <li>Khi dự thi, thí sinh cần tuân thủ hướng dẫn của cán bộ coi thi trong quá trình làm bài.</li>
            </ul>

            <Typography sx={{ fontWeight: 'bold', my: 2, color: 'primary.main' }}>
              6. Vật dụng ĐƯỢC mang vào phòng thi
            </Typography>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Thí sinh PHẢI mang theo Căn cước Công dân bản gốc, không chấp nhận giấy tờ thay thế;</li>
              <li>Thí sinh được phép mang vào máy tính cầm tay;</li>
              <li>Thí sinh có thể mang áo khoác;</li>
              <li>Thẻ giữ đồ do Trường cấp.</li>
            </ul>

            <Typography sx={{ fontWeight: 'bold', my: 2, color: 'primary.main' }}>
              7. Vật dụng KHÔNG ĐƯỢC mang vào phòng thi
            </Typography>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Tất cả các vật dụng khác so với quy định lại [Điều 6] phải được gửi tại quầy Giữ đồ.</li>
            </ul>

            <Typography sx={{ fontWeight: 'bold', my: 2, color: 'primary.main' }}>
              8. Kết quả thi
            </Typography>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Trường sẽ công bố kết quả thi của thí sinh theo hình thức phát hành điện tử. Thí sinh có thể tải thông tin kết quả thi về lưu giữ hoặc sử dụng cho các công việc khác;</li>
              <li>Nếu thí sinh đăng ký xét tuyển các ngành của Trường bằng kết quả thi Đánh giá năng lực thì mặc định điểm thi được chuyển lên hệ thống dữ liệu của Bộ Giáo dục và Đào tạo (Việc chọn ngành, chọn khối đăng ký xét tuyển phải xem các hướng dẫn của các qui định khác của Trường hoặc của Bộ Giáo dục và Đào tạo);</li>
              <li>Khi chưa hài lòng về kết quả thi, thí sinh có thể đăng ký phúc khảo theo qui định.</li>
            </ul>

            <Typography sx={{ fontWeight: 'bold', my: 2, color: 'primary.main' }}>
              9. Chính sách hoàn tiền
            </Typography>
            <Typography sx={{ fontStyle: 'italic', fontWeight: 'medium', mt: 1 }}>
              a) Các trường hợp được hoàn tiền
            </Typography>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
              <li>Thí sinh chuyển tiền lệ phí đăng ký dự thi nhưng hệ thống ngân hàng gặp lỗi không thể xác nhận được nguồn tiền được chuyển đến tài khoản ngân hàng của Trường. Sau đó, ngân hàng vẫn chuyển được tiền nhưng đã kết thúc thời gian đăng ký dự thi hoặc đã hết chỗ;</li>
              <li>Thí sinh điều trị bệnh trong thời gian dài không thể tham gia dự thi (có giấy xác nhận của bệnh viện);</li>
              <li>Nơi ở hoặc gia đình của thí sinh gặp thiên tai không thể tham gia dự thi.</li>
            </ul>

            <Typography sx={{ fontStyle: 'italic', fontWeight: 'medium', mt: 1 }}>
              b) Các trường hợp không được hoàn tiền
            </Typography>
            <ul style={{ marginLeft: '1.5rem', marginBottom: '2rem' }}>
              <li>Thí sinh tự ý bỏ thi;</li>
              <li>Thí sinh đi trễ quá thời gian cho phép vào thi;</li>
              <li>Thí sinh không mang theo căn cước công dân khi dự thi.</li>
            </ul>

            {/* Phần cuối để xác nhận */}
            <Box
              sx={{
                mt: 3,
                pt: 3,
                borderTop: '2px solid',
                borderColor: 'divider',
                textAlign: 'center',
              }}
            >
              <Typography variant="h6" gutterBottom color="primary">
                XÁC NHẬN ĐỒNG Ý
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Bằng việc nhấn nút TÔI ĐÃ ĐỌC VÀ ĐỒNG Ý bên dưới, tôi xác nhận đã đọc toàn bộ nội dung Điều khoản sử dụng dịch vụ và đồng ý với tất cả các điều khoản trên.
              </Typography>
            </Box>
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        justifyContent: 'space-between',
        px: 3,
        py: 2,
        bgcolor: scrolledToBottom ? 'success.lighter' : 'grey.50'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color={scrolledToBottom ? "success.main" : "warning.main"}>
            {scrolledToBottom 
              ? "✓ Bạn đã đọc hết nội dung điều khoản" 
              : "Vui lòng đọc hết nội dung điều khoản"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAccept}
          disabled={!scrolledToBottom}
          startIcon={<Iconify icon="material-symbols:check" />}
          sx={{ minWidth: 200 }}
        >
          TÔI ĐÃ ĐỌC VÀ ĐỒNG Ý
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export function SignUpView() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [confirmedInfo, setConfirmedInfo] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [captureMode, setCaptureMode] = useState<CaptureMode>(CaptureMode.CAMERA);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string>('');

  // Camera refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [cccdImage, setCccdImage] = useState<string>('');
  const [captureAttempted, setCaptureAttempted] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Step 1 - CCCD Info (sẽ được điền tự động từ OCR)
    cccd: '',
    full_name: '',
    date_of_birth: '',
    sex: '',
    nationality: '',
    place_of_origin: '',
    place_of_residence: '',

    // Step 2 - Account Info
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',

    // Step 3 - THPT School Info
    provinceCode: '',
    districtCode: '',
    thptCode: '',
    schoolName: '',
  });

  // OCR data from API
  const [ocrData, setOcrData] = useState<any>(null);
  const [ocrExtracted, setOcrExtracted] = useState(false);

  // Province, District, THPT data
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [thpts, setThpts] = useState<THPT[]>([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingThpts, setLoadingThpts] = useState(false);

  // Trong component chính của bạn, thêm:
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Start camera on component mount if camera mode is selected
  useEffect(() => {
    if (captureMode === CaptureMode.CAMERA) {
      startCamera();
    }

    // Load provinces on component mount
    loadProvinces();

    // Clean up camera on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [captureMode]);

  // Ensure video element gets the stream when available
  useEffect(() => {
    if (captureMode === CaptureMode.CAMERA && videoRef.current) {
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
  }, [stream, captureMode]);

  // Load districts when province changes
  useEffect(() => {
    if (formData.provinceCode) {
      loadDistricts(formData.provinceCode);
      // Reset district and thpt when province changes
      setFormData(prev => ({
        ...prev,
        districtCode: '',
        thptCode: '',
        schoolName: ''
      }));
      setDistricts([]);
      setThpts([]);
    }
  }, [formData.provinceCode]);

  // Load THPTs when district changes
  useEffect(() => {
    if (formData.provinceCode && formData.districtCode) {
      loadTHPTs(formData.provinceCode, formData.districtCode);
      // Reset thpt when district changes
      setFormData(prev => ({
        ...prev,
        thptCode: '',
        schoolName: ''
      }));
      setThpts([]);
    }
  }, [formData.provinceCode, formData.districtCode]);

  // Update school name when THPT is selected
  useEffect(() => {
    if (formData.thptCode) {
      const selectedTHPT = thpts.find(thpt => thpt.code === formData.thptCode);
      if (selectedTHPT) {
        setFormData(prev => ({
          ...prev,
          schoolName: selectedTHPT.name
        }));
      }
    }
  }, [formData.thptCode, thpts]);

  const loadProvinces = async () => {
    try {
      setLoadingProvinces(true);
      const response = await provinceService.getAllProvinces();
      if (response.data) {
        setProvinces(response.data);
      }
    } catch (fetchError) {
      console.error('Error loading provinces:', fetchError);
    } finally {
      setLoadingProvinces(false);
    }
  };

  const loadDistricts = async (provinceCode: string) => {
    try {
      setLoadingDistricts(true);
      const response = await districtService.getDistrictsByProvince(provinceCode);
      if (response.data) {
        setDistricts(response.data);
      }
    } catch (fetchError) {
      console.error('Error loading districts:', fetchError);
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const loadTHPTs = async (provinceCode: string, districtCode: string) => {
    try {
      setLoadingThpts(true);
      const response = await thptService.getTHPTsByProvinceAndDistrict(provinceCode, districtCode);
      if (response.data) {
        setThpts(response.data);
      }
    } catch (fetchError) {
      console.error('Error loading THPTs:', fetchError);
      setThpts([]);
    } finally {
      setLoadingThpts(false);
    }
  };

  const startCamera = async () => {
    try {
      setLoading(true);
      setError('');

      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }

      const hasPermission = await checkCameraPermission();
      if (!hasPermission) {
        setLoading(false);
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: isMobile ? 640 : 800 },
          height: { ideal: isMobile ? 480 : 600 },
        },
      });

      setStream(mediaStream);
      setCameraReady(true);

      if (videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(() => {});
        };
        videoRef.current.play?.().catch(() => {});
      }
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

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setError('Camera chưa sẵn sàng');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setCaptureAttempted(true);

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
        setCameraReady(false);
      }

      // Extract CCCD info
      await extractCCCDInfo(imageData);
    } catch (err) {
      setError('Lỗi khi chụp ảnh. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra loại file
    if (!file.type.match('image.*')) {
      setError('Vui lòng chọn file ảnh (JPEG, PNG, etc.)');
      return;
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setCaptureAttempted(true);

      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageData = event.target?.result as string;
        
        // Lưu file và preview
        setUploadedFile(file);
        setUploadPreview(imageData);
        setCccdImage(imageData);
        setPhotoTaken(true);

        // Extract CCCD info
        await extractCCCDInfo(imageData);
      };
      reader.onerror = () => {
        setError('Lỗi khi đọc file. Vui lòng thử lại.');
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Lỗi khi xử lý file. Vui lòng thử lại.');
      console.error(err);
      setLoading(false);
    }
  };

  const retakePhoto = async () => {
    // Reset all states
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    
    setPhotoTaken(false);
    setCccdImage('');
    setUploadedFile(null);
    setUploadPreview('');
    setOcrData(null);
    setOcrExtracted(false);
    setConfirmedInfo(false);
    setCaptureAttempted(false);
    setCameraReady(false);
    
    // Reset form data
    setFormData((prev) => ({
      ...prev,
      cccd: '',
      full_name: '',
      date_of_birth: '',
      sex: '',
      nationality: '',
      place_of_origin: '',
      place_of_residence: '',
    }));

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Restart camera if in camera mode
    if (captureMode === CaptureMode.CAMERA) {
      setTimeout(() => {
        startCamera();
      }, 100);
    }
  };

  const extractCCCDInfo = async (imageBase64: string) => {
    try {
      setLoading(true);
      const result = await verifyCCCD(imageBase64);

      if (result.status === 'success' && result.ocr_data) {
        const ocr = result.ocr_data;
        setOcrData(ocr);
        setOcrExtracted(true);

        // Auto-fill form with OCR data
        setFormData((prev) => ({
          ...prev,
          cccd: ocr.id || '',
          full_name: ocr.full_name || '',
          date_of_birth: ocr.date_of_birth || '',
          sex: ocr.sex || '',
          nationality: ocr.nationality || '',
          place_of_origin: ocr.place_of_origin || '',
          place_of_residence: ocr.place_of_residence || '',
        }));

        setSuccess('Đã đọc thông tin CCCD thành công! Vui lòng kiểm tra thông tin bên dưới.');
      } else {
        setError('Không thể đọc thông tin từ CCCD. Vui lòng chụp/tải lại ảnh rõ hơn.');
        setOcrExtracted(false);
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi xử lý ảnh CCCD. Vui lòng thử lại.');
      setOcrExtracted(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModeChange = (event: React.SyntheticEvent, newMode: CaptureMode) => {
    setCaptureMode(newMode);
    
    // Reset camera if switching to upload mode
    if (newMode === CaptureMode.UPLOAD && stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setCameraReady(false);
    }
    
    // Reset photo taken state
    if (!photoTaken) {
      setPhotoTaken(false);
      setCccdImage('');
      setUploadedFile(null);
      setUploadPreview('');
      setOcrData(null);
      setOcrExtracted(false);
      setConfirmedInfo(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate step 1
      if (!photoTaken) {
        setError('Vui lòng chụp hoặc tải ảnh CCCD trước khi tiếp tục');
        return;
      }
      if (!ocrExtracted) {
        setError('Không thể đọc thông tin từ ảnh CCCD. Vui lòng thử lại với ảnh rõ hơn.');
        return;
      }
      if (!formData.cccd) {
        setError('Không thể đọc số CCCD. Vui lòng thử lại với ảnh rõ hơn.');
        return;
      }
      if (!formData.full_name) {
        setError('Không thể đọc họ tên. Vui lòng thử lại với ảnh rõ hơn.');
        return;
      }
      if (!confirmedInfo) {
        setError('Vui lòng xác nhận thông tin đã chính xác');
        return;
      }

      setError('');
      setActiveStep((prevStep) => prevStep + 1);
    } else if (activeStep === 1) {
      // Validate step 2
      const validationError = validateStep2();
      if (validationError) {
        setError(validationError);
        return;
      }
      
      setError('');
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setError('');
    setActiveStep((prevStep) => prevStep - 1);
  };

  const validateStep2 = () => {
    if (!formData.email) {
      return 'Vui lòng nhập địa chỉ email';
    }
    if (!formData.email.includes('@')) {
      return 'Email không hợp lệ';
    }
    if (!formData.phone) {
      return 'Vui lòng nhập số điện thoại';
    }
    if (!/^\d{10,11}$/.test(formData.phone.replace(/\D/g, ''))) {
      return 'Số điện thoại không hợp lệ (10-11 số)';
    }
    if (!formData.password) {
      return 'Vui lòng nhập mật khẩu';
    }
    if (formData.password.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    if (formData.password !== formData.password_confirmation) {
      return 'Mật khẩu xác nhận không khớp';
    }
    return '';
  };

  const validateStep3 = () => {
    if (!formData.provinceCode) {
      return 'Vui lòng chọn Tỉnh/Thành phố';
    }
    if (!formData.districtCode) {
      return 'Vui lòng chọn Quận/Huyện';
    }
    if (!formData.thptCode) {
      return 'Vui lòng chọn Trường THPT';
    }
    return '';
  };

  const handleSubmit = async () => {
    const validationError = validateStep3();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Prepare data for backend (matching controller structure)
      const registerData = {
        fullname: formData.full_name,
        cccd: formData.cccd,
        birthday: formData.date_of_birth,
        gender: formData.sex === 'Nam' ? 1 : 0,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        acceptTerms: true,
        cccd_image: cccdImage,
        // THPT school info
        province_code: formData.provinceCode,
        district_code: formData.districtCode,
        school_code: formData.thptCode,
        school_name: formData.schoolName,
      };

      const result = await register(registerData);

      setSuccess('Đăng ký thành công! Đang chuyển hướng...');

      setTimeout(() => {
        router.push('/sign-in');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      console.error('Lỗi đăng ký', err);
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

  const renderCameraView = () => (
    <>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={capturePhoto}
        disabled={!cameraReady || loading || photoTaken}
        startIcon={<Iconify icon="material-symbols:camera" />}
      >
        Chụp ảnh CCCD
      </Button>

      {/* Camera Preview */}
      {cameraReady && !photoTaken ? (
        <Box sx={{ position: 'relative', display: 'inline-block', width: '100%', mt: 2 }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: '100%',
              maxWidth: '400px',
              height: 'auto',
              borderRadius: '8px',
              backgroundColor: '#000',
              display: 'block',
              margin: '0 auto',
            }}
          />
          {/* Guide frame */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '280px',
              height: '180px',
              maxWidth: '70%',
              border: '2px dashed rgba(255, 255, 255, 0.7)',
              borderRadius: '8px',
              pointerEvents: 'none',
            }}
          />
        </Box>
      ) : null}
    </>
  );

  const renderUploadView = () => (
    <>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        component="label"
        disabled={loading || photoTaken}
        startIcon={<Iconify icon="material-symbols:upload" />}
        sx={{ mb: 2 }}
      >
        Tải ảnh lên từ thiết bị
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileUpload}
        />
      </Button>

      {uploadedFile && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Đã chọn: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
        </Typography>
      )}

      {/* Upload Preview */}
      {uploadPreview && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <img
            src={uploadPreview}
            alt="CCCD đã tải lên"
            style={{
              width: '100%',
              maxWidth: '400px',
              maxHeight: '300px',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '8px',
              backgroundColor: '#f5f5f5',
            }}
          />
        </Box>
      )}
    </>
  );

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Bước 1: Chụp hoặc tải ảnh CCCD/CMND
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Vui lòng chụp ảnh hoặc tải ảnh CCCD/CMND rõ ràng để hệ thống tự động đọc thông tin
            </Typography>

            {/* Mode Selection Tabs */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 0 }}>
                <Tabs
                  value={captureMode}
                  onChange={handleModeChange}
                  variant="fullWidth"
                  sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                  <Tab 
                    label="Chụp ảnh" 
                    value={CaptureMode.CAMERA}
                    icon={<Iconify icon="material-symbols:camera" width={20} />}
                    iconPosition="start"
                  />
                  <Tab 
                    label="Tải ảnh lên" 
                    value={CaptureMode.UPLOAD}
                    icon={<Iconify icon="material-symbols:upload" width={20} />}
                    iconPosition="start"
                  />
                </Tabs>

                <Box sx={{ p: 3 }}>
                  {captureMode === CaptureMode.CAMERA ? renderCameraView() : renderUploadView()}
                </Box>
              </CardContent>
            </Card>

            {/* Photo Actions */}
            {photoTaken && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={retakePhoto}
                    disabled={loading}
                    startIcon={<Iconify icon="material-symbols:refresh" />}
                  >
                    {captureMode === CaptureMode.CAMERA ? 'Chụp lại' : 'Tải ảnh khác'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* OCR Processing Status */}
            {captureAttempted && !ocrExtracted && !loading && (
              <Alert severity="warning" sx={{ mb: 3 }}>
                Không thể đọc thông tin từ ảnh. Vui lòng thử lại với ảnh rõ hơn.
              </Alert>
            )}

            {/* CCCD Info Form - CHỈ HIỂN THỊ SAU KHI CHỤP/TẢI THÀNH CÔNG */}
            {photoTaken && ocrExtracted && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main' }}>
                    Thông tin đọc được từ CCCD
                  </Typography>

                  <Alert severity="info" sx={{ mb: 2 }}>
                    Vui lòng kiểm tra và chỉnh sửa thông tin nếu cần thiết
                  </Alert>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      fullWidth
                      name="cccd"
                      label="Số CCCD/CMND *"
                      value={formData.cccd}
                      onChange={handleChange}
                      required
                      error={!formData.cccd}
                      helperText={!formData.cccd ? 'Không thể đọc số CCCD' : ''}
                    />

                    <TextField
                      fullWidth
                      name="full_name"
                      label="Họ và tên *"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                      error={!formData.full_name}
                      helperText={!formData.full_name ? 'Không thể đọc họ tên' : ''}
                    />

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          name="date_of_birth"
                          label="Ngày sinh"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                        />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          name="sex"
                          label="Giới tính"
                          value={formData.sex}
                          onChange={handleChange}
                        />
                      </Box>
                    </Box>

                    <TextField
                      fullWidth
                      name="nationality"
                      label="Quốc tịch"
                      value={formData.nationality}
                      onChange={handleChange}
                    />

                    <TextField
                      fullWidth
                      name="place_of_origin"
                      label="Quê quán"
                      value={formData.place_of_origin}
                      onChange={handleChange}
                    />

                    <TextField
                      fullWidth
                      name="place_of_residence"
                      label="Địa chỉ thường trú"
                      value={formData.place_of_residence}
                      onChange={handleChange}
                      multiline
                      rows={2}
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={acceptedTerms}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTermsModalOpen(true);
                            } else {
                              setAcceptedTerms(false);
                            }
                          }}
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          Tôi đã đọc và đồng ý với{' '}
                          <Button
                            component="span"
                            variant="text"
                            size="small"
                            sx={{
                              color: 'primary.main',
                              textDecoration: 'underline',
                              p: 0,
                              minWidth: 'auto',
                              fontWeight: 'bold',
                            }}
                            onClick={() => setTermsModalOpen(true)}
                          >
                            Điều khoản sử dụng dịch vụ
                          </Button>
                        </Typography>
                      }
                    />

                    <TermsModal
                      open={termsModalOpen}
                      onClose={() => setTermsModalOpen(false)}
                      onAccept={() => {
                        setAcceptedTerms(true);
                        setTermsModalOpen(false);
                      }}
                    />
                  </Box>

                  {!formData.cccd || !formData.full_name ? (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      Không thể đọc đủ thông tin từ CCCD. Vui lòng thử lại.
                    </Alert>
                  ) : null}
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            <Card variant="outlined"
              sx={{ 
                borderColor: 'primary.light',
                borderWidth: 2,
                backgroundColor: 'primary.50',
              }}>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Hướng dẫn:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Typography component="li" variant="body2">
                    <strong>Chụp ảnh:</strong> Đặt CCCD trong khung hình, đảm bảo ánh sáng đủ
                  </Typography>
                  <Typography component="li" variant="body2">
                    <strong>Tải ảnh:</strong> Chọn file ảnh rõ nét từ thiết bị
                  </Typography>
                  <Typography component="li" variant="body2">
                    Đảm bảo ảnh không bị mờ, lóa, hoặc bị che khuất
                  </Typography>
                  <Typography component="li" variant="body2">
                    Đợi hệ thống tự động đọc thông tin
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>Lưu ý:</strong> Ảnh phải có kích thước dưới 5MB
                </Typography>
              </CardContent>
            </Card>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Bước 2: Thông tin tài khoản
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Vui lòng nhập thông tin để tạo tài khoản
            </Typography>

            <Card>
              <CardContent>
                {/* Review CCCD Info */}
                <Card
                  variant="outlined"
                  sx={{
                    mb: 3,
                    bgcolor: 'primary.lighter',
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
                      Thông tin CCCD đã xác thực:
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        flexWrap: 'wrap',
                        gap: 1,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: '200px' }}>
                        <Typography variant="body2">
                          <strong>Số CCCD:</strong> {formData.cccd || 'Chưa có'}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, minWidth: '200px' }}>
                        <Typography variant="body2">
                          <strong>Họ tên:</strong> {formData.full_name || 'Chưa có'}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, minWidth: '200px' }}>
                        <Typography variant="body2">
                          <strong>Ngày sinh:</strong> {formData.date_of_birth || 'Chưa có'}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1, minWidth: '200px' }}>
                        <Typography variant="body2">
                          <strong>Giới tính:</strong> {formData.sex || 'Chưa có'}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                {/* Account Info Form */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    name="email"
                    label="Địa chỉ Email *"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    helperText="Email sẽ được dùng để đăng nhập"
                  />

                  <TextField
                    fullWidth
                    name="phone"
                    label="Số điện thoại *"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    helperText="Số điện thoại phải có 10-11 chữ số"
                  />

                  <TextField
                    fullWidth
                    name="password"
                    label="Mật khẩu *"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                          >
                            <Iconify
                              icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                              width={20}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    helperText="Mật khẩu phải có ít nhất 6 ký tự"
                  />

                  <TextField
                    fullWidth
                    name="password_confirmation"
                    label="Xác nhận mật khẩu *"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                            size="small"
                          >
                            <Iconify
                              icon={
                                showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                              }
                              width={20}
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Bước 3: Thông tin Trường THPT
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Vui lòng chọn trường THPT mà bạn đang học/đã tốt nghiệp
            </Typography>

            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Province Selection */}
                  <FormControl fullWidth>
                    <InputLabel id="province-label">Tỉnh/Thành phố *</InputLabel>
                    <Select
                      labelId="province-label"
                      name="provinceCode"
                      value={formData.provinceCode}
                      label="Tỉnh/Thành phố *"
                      onChange={handleSelectChange}
                      disabled={loadingProvinces}
                    >
                      <MenuItem value="">
                        <em>Chọn Tỉnh/Thành phố</em>
                      </MenuItem>
                      {provinces.map((province) => (
                        <MenuItem key={province.code} value={province.code}>
                          {province.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {loadingProvinces && (
                      <Box sx={{ mt: 1 }}>
                        <CircularProgress size={20} />
                      </Box>
                    )}
                  </FormControl>

                  {/* District Selection */}
                  <FormControl fullWidth disabled={!formData.provinceCode || loadingDistricts}>
                    <InputLabel id="district-label">Quận/Huyện *</InputLabel>
                    <Select
                      labelId="district-label"
                      name="districtCode"
                      value={formData.districtCode}
                      label="Quận/Huyện *"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="">
                        <em>{formData.provinceCode ? 'Chọn Quận/Huyện' : 'Chọn Tỉnh/Thành phố trước'}</em>
                      </MenuItem>
                      {districts.map((district) => (
                        <MenuItem key={district.code} value={district.code}>
                          {district.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {loadingDistricts && (
                      <Box sx={{ mt: 1 }}>
                        <CircularProgress size={20} />
                      </Box>
                    )}
                    {formData.provinceCode && districts.length === 0 && !loadingDistricts && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Không có Quận/Huyện nào cho Tỉnh/Thành phố đã chọn
                      </Typography>
                    )}
                  </FormControl>

                  {/* THPT School Selection */}
                  <FormControl fullWidth disabled={!formData.districtCode || loadingThpts}>
                    <InputLabel id="thpt-label">Trường THPT *</InputLabel>
                    <Select
                      labelId="thpt-label"
                      name="thptCode"
                      value={formData.thptCode}
                      label="Trường THPT *"
                      onChange={handleSelectChange}
                    >
                      <MenuItem value="">
                        <em>{formData.districtCode ? 'Chọn Trường THPT' : 'Chọn Quận/Huyện trước'}</em>
                      </MenuItem>
                      {thpts.map((thpt) => (
                        <MenuItem key={thpt.code} value={thpt.code}>
                          {thpt.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {loadingThpts && (
                      <Box sx={{ mt: 1 }}>
                        <CircularProgress size={20} />
                      </Box>
                    )}
                    {formData.districtCode && thpts.length === 0 && !loadingThpts && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                        Không có Trường THPT nào cho Quận/Huyện đã chọn
                      </Typography>
                    )}
                  </FormControl>

                  {/* Display Selected School Info */}
                  {formData.schoolName && (
                    <Card variant="outlined" sx={{ bgcolor: 'success.lighter' }}>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom sx={{ color: 'success.main' }}>
                          Trường THPT đã chọn:
                        </Typography>
                        <Typography variant="body1">
                          {formData.schoolName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(() => {
                            const province = provinces.find(p => p.code === formData.provinceCode);
                            const district = districts.find(d => d.code === formData.districtCode);
                            return `${district?.name || ''}, ${province?.name || ''}`;
                          })()}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}

                  {/* Instructions */}
                  <Card variant="outlined"
                    sx={{ 
                      borderColor: 'primary.light',
                      borderWidth: 2,
                      backgroundColor: 'primary.50',
                    }}>
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        Lưu ý:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        <Typography component="li" variant="body2">
                          Vui lòng chọn đúng trường THPT bạn đang học/đã tốt nghiệp
                        </Typography>
                        <Typography component="li" variant="body2">
                          Thông tin này sẽ được dùng để xác minh hồ sơ
                        </Typography>
                        <Typography component="li" variant="body2">
                          Nếu không tìm thấy trường của bạn, vui lòng liên hệ với bộ phận hỗ trợ
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        maxWidth: '800px',
        mx: 'auto',
        px: { xs: 2, sm: 3 },
        py: 4,
      }}
    >
      {/* Main Card */}
      <Card
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          borderTop: '4px solid',
          borderColor: 'primary.main',
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center' }}>
          <Box
            component="img"
            src="/images/logo.png"
            alt="Logo HCMUE"
            sx={{
              height: 70,
            }}
          />
        </Box>

        {/* Stepper */}
        <Box sx={{ px: { xs: 2, sm: 4 }, pt: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel={isMobile} sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Divider />

        {/* Content */}
        <Box sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
          {/* Messages */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {/* Step Content */}
          {renderStepContent(activeStep)}

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 4,
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              fullWidth={isMobile}
              sx={{
                order: { xs: 2, sm: 1 },
                minWidth: { sm: 120 },
              }}
            >
              Quay lại
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                fullWidth={isMobile}
                sx={{
                  order: { xs: 1, sm: 2 },
                  minWidth: { sm: 120 },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Hoàn tất đăng ký'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={
                  loading ||
                  (activeStep === 0 && (!photoTaken || !ocrExtracted || !formData.cccd || !formData.full_name || !confirmedInfo)) ||
                  (activeStep === 1 && (validateStep2() !== '')) ||
                  (activeStep === 2 && (validateStep3() !== ''))
                }
                fullWidth={isMobile}
                sx={{
                  order: { xs: 1, sm: 2 },
                  minWidth: { sm: 120 },
                }}
              >
                Tiếp theo
              </Button>
            )}
          </Box>

          {/* Login Link */}
          <Box sx={{ textAlign: 'center', mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              Đã có tài khoản?{' '}
              <Button
                component="a"
                href="/sign-in"
                variant="text"
                size="small"
                sx={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Đăng nhập ngay
              </Button>
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Typography variant="caption" color="text.secondary">
          © 2025 Ho Chi Minh City University of Education
        </Typography>
      </Box>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </Box>
  );
}