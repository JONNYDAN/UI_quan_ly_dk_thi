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
  {
    title: 'Xét chứng chỉ ngoại ngữ',
    path: '/xet-ccnn',
    icon: icon('fluent--certificate-20-regular')
  },
  {
    title: 'Lịch sử thanh toán',
    path: '#',
    icon: icon('ic--baseline-history'),
  }
];
