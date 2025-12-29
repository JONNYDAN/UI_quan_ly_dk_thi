import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Bảng điều khiển',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  // {
  //   title: 'User',
  //   path: '/user',
  //   icon: icon('ic-user'),
  // },
  // {
  //   title: 'Product',
  //   path: '/products',
  //   icon: icon('ic-cart'),
  //   info: (
  //     <Label color="error" variant="inverted">
  //       +3
  //     </Label>
  //   ),
  // },
  {
    title: 'Thông tin thí sinh',
    path: '/student-info',
    icon: icon('ic--baseline-account-circle'),
  },
  {
    title: 'Kỳ thi sắp diễn ra',
    path: '/upcoming-exams',
    icon: icon('ic--baseline-event'),
  },
  {
    title: 'Kỳ thi đã đăng ký',
    path: '/registered-exams',
    icon: icon('ic--baseline-checklist'),
  },
  {
    title: 'Lịch xét tuyển',
    path: '/blog',
    icon: icon('ic--baseline-domain-verification'),
  },
  // {
  //   title: 'Sign in',
  //   path: '/sign-in',
  //   icon: icon('ic-lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
  {
    title: ' Đăng ký thi ĐGNL',
    path: '/register-dgnl',
    icon: icon('ic--round-history-edu'),
  },
  // {
  //   title: 'Xét chứng chỉ ngoại ngữ',
  //   path: '/xet-ccnn',
  //   icon: icon('fluent--certificate-20-regular')
  // },
  {
    title: 'Quản trị - Người dùng',
    path: '/admin/users',
    icon: icon('ic-user'),
  },
  {
    title: 'Quản trị - Kỳ thi',
    path: '/admin/exam-management',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Quản trị - Thanh toán',
    path: '/admin/exam-payments',
    icon: icon('ic--baseline-history'),
  },
  {
    title: 'Lịch sử thanh toán',
    path: '#',
    icon: icon('ic--baseline-history'),
  }
];
