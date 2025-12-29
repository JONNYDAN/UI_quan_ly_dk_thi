import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

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
    icon: <Icon icon="ic-analytics" width={24} height={24} />,
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
    icon: <Icon icon="ic--baseline-account-circle" width={24} height={24} />,
  },
  {
    title: 'Kỳ thi sắp diễn ra',
    path: '/upcoming-exams',
    icon: <Icon icon="ic--baseline-event" width={24} height={24} />,
  },
  {
    title: 'Kỳ thi đã đăng ký',
    path: '/registered-exams',
    icon: <Icon icon="ic--baseline-checklist" width={24} height={24} />,
  },
  {
    title: 'Lịch xét tuyển',
    path: '/blog',
    icon: <Icon icon="ic--baseline-domain-verification" width={24} height={24} />,
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
    icon: <Icon icon="ic--round-history-edu" width={24} height={24} />,
  },
  // {
  //   title: 'Xét chứng chỉ ngoại ngữ',
  //   path: '/xet-ccnn',
  //   icon: icon('fluent--certificate-20-regular')
  // },
  {
    title: 'Thông tin thí sinh',
    path: '/profile',
    icon: <Icon icon="mdi:book-account-outline" width={24} height={24} />,
  },
  {
    title: 'Đăng ký dự thi',
    path: '/exam',
    icon: <Icon icon="lucide:clipboard-edit" width={24} height={24} />,
  },
  {
    title: 'Kết quả đăng ký',
    path: '/exam-info',
    icon: <Icon icon="mdi:checkbox-marked-circle-outline" width={24} height={24} />,
  },
  {
    title: 'Giấy báo dự thi',
    path: '/exam-paper',
    icon: <Icon icon="ci:file-document" width={24} height={24} />,
  },
  {
    title: 'Kết quả thi',
    path: '/result',
    icon: <Icon icon="tabler:clipboard-check" width={24} height={24} />,
  },
  {
    title: 'Lịch sử thanh toán',
    path: '#',
    icon: <Icon icon="mdi:history" width={24} height={24} />,
  }
];