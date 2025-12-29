import type { CSSObject, Breakpoint } from '@mui/material/styles';

import { merge } from 'es-toolkit';
import { useBoolean } from 'minimal-shared/hooks';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

import { useAuth } from 'src/contexts/AuthContext';

import { AuthContent } from './content';
import { _account } from '../nav-config-account';
import { navData } from '../nav-config-dashboard';
import { _workspaces } from '../nav-config-workspace';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { NavMobile, NavDesktop } from '../dashboard/nav';
import { AccountPopover } from '../components/account-popover';

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

export type PortalLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
  };
};

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

export function BackgroundLayout({ 
  sx, 
  cssVars, 
  children, 
  slotProps,  
  layoutQuery = 'lg', 
}: PortalLayoutProps) {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth(); // Lấy user và trạng thái đăng nhập

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  // Format user data cho AccountPopover
  const formatUserForAccountPopover = () => {
    if (!user) return null;
    
    return {
      fullname: user.fullname || 'Người dùng',
      email: user.email || '',
      cccd: user.cccd || '',
      phone: user.phone || '',
      roles: user.roles || [],
    };
  };

  const accountPopoverUser = formatUserForAccountPopover();

  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: false,
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      topArea: (
        <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={{ 
              mr: 1, 
              ml: -1, 
              [theme.breakpoints.up(layoutQuery)]: { display: 'none' } 
            }}
          />
          <NavMobile 
            data={navData} 
            open={open} 
            onClose={onClose} 
            workspaces={_workspaces} 
          />
        </>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
          {/** @slot Searchbar */}
          {/* <Searchbar /> */}

          {/** @slot Language popover */}
          {/** @slot Notifications popover */}

          {/* <NotificationsPopover data={_notifications} /> */}

          {/** @slot Account drawer */}
          {/* <LanguagePopover data={_langs} /> */}
          
          {/* Truyền user đã được format cho AccountPopover */}
          <AccountPopover 
            data={_account} 
            user={accountPopoverUser} 
            key={accountPopoverUser?.fullname || 'guest'} // Force re-render khi user thay đổi
          />
        </Box>
      ),
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  // Chỉ render header khi user đã đăng nhập
  const shouldShowHeader = isAuthenticated && !!user;

  return (
    <LayoutSection
      // /** **************************************
      //  * @Header
      //  *************************************** */
      // headerSection={shouldShowHeader ? renderHeader() : null}
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
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* Hiển thị thông báo nếu cần */}
        {children}
      </Box>
    </LayoutSection>
  );
}

// ----------------------------------------------------------------------

const backgroundStyles = (): CSSObject => ({
  zIndex: 1,
  width: '100%',
  height: '100%',
  content: "''",
  position: 'absolute',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundImage: 'url(/hcmue_white_bg.png)',
});