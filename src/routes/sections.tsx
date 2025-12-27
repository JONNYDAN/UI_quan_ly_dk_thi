import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { DashboardLayout } from 'src/layouts/dashboard';
import { AuthLayout, BackgroundLayout } from 'src/layouts/auth';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
// export const BlogPage = lazy(() => import('src/pages/blog'));
// export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
// export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const ProfilePage = lazy(() => import('src/pages/profile'));
export const PortalPage = lazy(() => import('src/pages/portal'));
// export const PhoneOtpPage = lazy(() => import('src/pages/phone-otp'));
export const SearchPage = lazy(() => import('src/pages/search'));

export const ExamPage = lazy(() => import('src/pages/exam'));
export const ExamInfoPage = lazy(() => import('src/pages/exam-info'));
export const ExamPaperPage = lazy(() => import('src/pages/exam-paper'));
export const ExamResultPage = lazy(() => import('src/pages/exam-result'));

export const PaymentDetailPage = lazy(() => import('src/pages/payment'));
export const PaymentReturnPage = lazy(() => import('src/pages/payment'));


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
      { path: 'profile', element: <DashboardPage /> },

      // Exam 
      { path: 'exam', element: <ExamPage/> },
      { path: 'exam-info', element: <ExamInfoPage/> },
      { path: 'exam-paper', element: <ExamPaperPage/> },
      { path: 'result', element: <ExamResultPage/> },

      // Payment pages
      { path: 'payment/:type/:orderCode', element: <PaymentDetailPage /> },
      { path: 'payment-return', element: <PaymentReturnPage /> },
 
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
  // {
  //   path: 'phone-otp',
  //   element: (
  //     <AuthLayout>
  //       <PhoneOtpPage />
  //     </AuthLayout>
  //   ),
  // },
  {
    path: '/',
    element: (
      <BackgroundLayout>
        <PortalPage />
      </BackgroundLayout>
    )
  },
  {
    path: 'search',
    element: (
      <BackgroundLayout>
        <SearchPage />
      </BackgroundLayout>
    )
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
