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