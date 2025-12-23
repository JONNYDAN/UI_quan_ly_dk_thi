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
export const HomePage = lazy(() => import('src/pages/home'));
export const SearchPage = lazy(() => import('src/pages/search'));

// Additional auth pages migrated from xettuyen
export const LoginAdminPage = lazy(() => import('src/sections/auth/login-admin-view'));
export const ComingSoonPage = lazy(() => import('src/sections/auth/coming-soon-view'));

// Migrated pages from xettuyen2025_frontend
export const BoardAdminPage = lazy(() => import('src/sections/admin/view/board-admin-view'));
export const BoardModeratorPage = lazy(() => import('src/sections/admin/view/board-moderator-view'));
export const BoardUserPage = lazy(() => import('src/sections/admin/view/board-user-view'));
export const DashboardExamPage = lazy(() => import('src/sections/admin/view/dashboard-exam-view'));
export const UserManagementPage = lazy(() => import('src/sections/admin/view/user-management-view'));
export const ExamManagementPage = lazy(() => import('src/sections/admin/view/exam-management-view'));
export const ExamTurnManagementPage = lazy(() => import('src/sections/admin/view/exam-turn-management-view'));
export const ExamPayManagementPage = lazy(() => import('src/sections/admin/view/exam-pay-management-view'));

export const PaymentDetailPage = lazy(() => import('src/sections/payment/view/payment-detail-view'));
export const PaymentReturnPage = lazy(() => import('src/sections/payment/view/payment-return-view'));

export const EnrollmentPage = lazy(() => import('src/sections/exam/view/enrollment-view'));
export const EnrollmentNNPage = lazy(() => import('src/sections/exam/view/enrollment-nn-view'));
export const ExamInfoPage = lazy(() => import('src/sections/exam/view/exam-info-view'));
export const ExamPaperPage = lazy(() => import('src/sections/exam/view/exam-paper-view'));
export const ExamResultPage = lazy(() => import('src/sections/exam/view/exam-result-view'));
export const ReExamRegisterPage = lazy(() => import('src/sections/exam/view/reexam-register-view'));
export const ReExamInfoPage = lazy(() => import('src/sections/exam/view/reexam-info-view'));


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

      // Admin pages (migrated)
      { path: 'admin/board', element: <BoardAdminPage /> },
      { path: 'admin/moderator', element: <BoardModeratorPage /> },
      { path: 'admin/user', element: <BoardUserPage /> },
      { path: 'admin/exams', element: <DashboardExamPage /> },
      { path: 'admin/users', element: <UserManagementPage /> },
      { path: 'admin/exam-management', element: <ExamManagementPage /> },
      { path: 'admin/exam-turns', element: <ExamTurnManagementPage /> },
      { path: 'admin/exam-payments', element: <ExamPayManagementPage /> },

      // Payment pages
      { path: 'payment/:orderCode', element: <PaymentDetailPage /> },
      { path: 'payment-return', element: <PaymentReturnPage /> },

      // Exam / Enrollment
      { path: 'exam/enrollment', element: <EnrollmentPage /> },
      { path: 'exam/enrollment-nn', element: <EnrollmentNNPage /> },
      { path: 'exam/info', element: <ExamInfoPage /> },
      { path: 'exam/paper', element: <ExamPaperPage /> },
      { path: 'exam/results', element: <ExamResultPage /> },
      { path: 'exam/re-register', element: <ReExamRegisterPage /> },
      { path: 'exam/re-info', element: <ReExamInfoPage /> },

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
    path: 'admin/sign-in',
    element: (
      <AuthLayout>
        <LoginAdminPage />
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
    path: 'home',
    element: (
      <BackgroundLayout>
        <HomePage />
      </BackgroundLayout>
    )
  },
  {
    path: 'coming-soon',
    element: (
      <BackgroundLayout>
        <ComingSoonPage />
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
