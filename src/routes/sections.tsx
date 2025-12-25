import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

// import ExamLayout from 'src/layouts/exam/layout';
import { DashboardLayout } from 'src/layouts/dashboard';
import { AuthLayout, BackgroundLayout } from 'src/layouts/auth';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const PortalPage = lazy(() => import('src/pages/portal'));
export const PhoneOtpPage = lazy(() => import('src/pages/phone-otp'));
export const RegisterDgnlPage = lazy(() => import('src/pages/register-dgnl'));
export const UpcomingExamsPage = lazy(() => import('src/pages/upcoming-exams'));


const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'upcoming-exams', element: <UpcomingExamsPage /> }
    ],
  },
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: 'sign-up',
    element: (
      <AuthLayout>
        <SignUpPage />
      </AuthLayout>
    ),
  },
  {
    path: 'phone-otp',
    element: (
      <AuthLayout>
        <PhoneOtpPage />
      </AuthLayout>
    ),
  },
  {
    path: 'register-dgnl',
    element: (
      <DashboardLayout>
        <RegisterDgnlPage />
      </DashboardLayout>
    )
  },
  {
    path: '/',
    element: (
      <BackgroundLayout>
        <PortalPage />
      </BackgroundLayout>
    )
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
