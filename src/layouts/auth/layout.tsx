import type { CSSObject, Breakpoint } from '@mui/material/styles';

import { merge } from 'es-toolkit';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';

import { AuthContent } from './content';
import { MainSection } from '../core/main-section';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';

import type { AuthContentProps } from './content';
import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type AuthLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
    content?: AuthContentProps;
  };
};

// export function AuthLayout({ sx, cssVars, children }: LayoutBaseProps) {
//   return (
//     <LayoutSection
//       headerSection={null}
//       footerSection={null}
//       cssVars={{ '--layout-auth-content-width': '100%', ...cssVars }}
//       sx={[
//         {
//           position: 'relative',
//           '&::before': backgroundStyles(), // overlay
//         },
//         ...(Array.isArray(sx) ? sx : [sx]),
//       ]}
//     >
//       <MainSection
//         sx={(theme) => ({
//           alignItems: 'center',
//           justifyContent: 'center',
//           p: theme.spacing(10, 2),
//         })}
//       >
//         <AuthContent>{children}</AuthContent>
//       </MainSection>
//     </LayoutSection>
//   );
// }


export function AuthLayout({ sx, cssVars, children }: LayoutBaseProps) {
  return (
    <LayoutSection
      headerSection={null}
      footerSection={null}
      cssVars={{ '--layout-auth-content-width': '100%', ...cssVars }}
      sx={[
        {
          position: 'relative',
          '&::before': backgroundStyles(), // overlay
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
        <AuthContent>{children}</AuthContent>
    </LayoutSection>
  );
}

// ----------------------------------------------------------------------

export function BackgroundLayout({ sx, cssVars, children }: LayoutBaseProps) {
  return (
    <LayoutSection
      headerSection={null}
      footerSection={null}
      cssVars={{ '--layout-auth-content-width': '100%', ...cssVars }}
      sx={[
        {
          position: 'relative',
          '&::before': backgroundStyles(), // overlay
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>{children}</Box>
    </LayoutSection>
  );
}

// ----------------------------------------------------------------------

const backgroundStyles = (): CSSObject => ({
  zIndex: 1,
  // opacity: 0.24,
  width: '100%',
  height: '100%',
  content: "''",
  position: 'absolute',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  // backgroundPosition: 'center center',
  // backgroundImage: 'url(/assets/background/overlay.jpg)',
  backgroundImage: 'url(/hcmue_white_bg.png)',
});
