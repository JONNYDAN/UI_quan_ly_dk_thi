// portal/options.tsx
import type { ReactNode } from 'react';

export type PortalOption = {
  key:
    | 'admission'
    | 'hsca_info'
    | 'account'
    | 'hsca'
    | 'special'
    | 'certificate';
  label: string;
  image?: string;
  topIcon?: ReactNode;
};

export const OPTIONS: PortalOption[] = [
  {
    key: 'admission',
    label: 'THÔNG TIN TUYỂN SINH',
    topIcon: <img src="/portal1_logo.png" alt="admission" width={70} height={70} />,
  },
  {
    key: 'hsca_info',
    label: 'THÔNG TIN KỲ THI ĐGNL CHUYÊN BIỆT',
    topIcon: <img src="/portal2_logo.png" alt="admission" width={70} height={70} />,
  },
    {
    key: 'account',
   label: 'ĐĂNG KÝ TÀI KHOẢN',
    topIcon: <img src="/portal3_logo.png" alt="admission" width={70} height={70} />,
  },
  {
    key: 'hsca',
    label: 'ĐĂNG KÝ DỰ THI ĐGNL CHUYÊN BIỆT',
    topIcon: <img src="/portal4_logo.png" alt="admission" width={70} height={70} />,
  },
  // {
  //   key: 'special',
  //   label: 'ĐĂNG KÝ DỰ THI NĂNG KHIẾU',
  //   topIcon: <img src="/portal5_logo.png" alt="admission" width={70} height={70} />,
  // },
  //  {
  //   key: 'certificate',
  //   label: 'ĐĂNG KÝ CHỨNG CHỈ NGOẠI NGỮ',
  //   topIcon: <img src="/portal6_logo.png" alt="admission" width={70} height={70} />,
  // },
];
