import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import { getDashboardPath } from '@/utils/helpers';

/* ─── Layouts ─── */
const DashboardLayout = lazy(() => import('@/components/layout/DashboardLayout'));
const PublicLayout = lazy(() => import('@/components/layout/PublicLayout'));
const AuthLayout = lazy(() => import('@/components/layout/AuthLayout'));

/* ─── Public Pages ─── */
const LandingPage = lazy(() => import('@/pages/public/LandingPage'));
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const FeaturesPage = lazy(() => import('@/pages/public/FeaturesPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));

/* ─── Auth Pages ─── */
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));

/* ─── Citizen Pages ─── */
const CitizenDashboard = lazy(() => import('@/pages/citizen/CitizenDashboard'));
const ComplaintSubmit = lazy(() => import('@/pages/citizen/ComplaintSubmit'));
const ComplaintHistory = lazy(() => import('@/pages/citizen/ComplaintHistory'));
const ComplaintDetail = lazy(() => import('@/pages/citizen/ComplaintDetail'));
const RewardsPage = lazy(() => import('@/pages/citizen/RewardsPage'));
const ProfilePage = lazy(() => import('@/pages/citizen/ProfilePage'));

/* ─── Worker Pages ─── */
const WorkerDashboard = lazy(() => import('@/pages/worker/WorkerDashboard'));
const ActiveTask = lazy(() => import('@/pages/worker/ActiveTask'));
const WorkerShifts = lazy(() => import('@/pages/worker/WorkerShifts'));

/* ─── Admin Pages ─── */
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const ComplaintManagement = lazy(() => import('@/pages/admin/ComplaintManagement'));
const WorkerManagement = lazy(() => import('@/pages/admin/WorkerManagement'));
const HeatmapPage = lazy(() => import('@/pages/admin/HeatmapPage'));
const AIReportsPage = lazy(() => import('@/pages/admin/AIReportsPage'));

/* ─── Government Pages ─── */
const GovDashboard = lazy(() => import('@/pages/government/GovDashboard'));
const EscalationCenter = lazy(() => import('@/pages/government/EscalationCenter'));
const CityAnalytics = lazy(() => import('@/pages/government/CityAnalytics'));

/* ─── Fallback ─── */
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-surface-secondary">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-neutral-500">Loading…</p>
      </div>
    </div>
  );
}

/* ─── Route Guards ─── */
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

function RoleRoute({ allowedRoles, children }) {
  const user = useAuthStore((s) => s.user);
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user?.role)} replace />;
  }
  return children;
}

function GuestRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  if (isAuthenticated && user) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

/* ─── Router Config ─── */
const router = createBrowserRouter([
  // Public marketing pages
  {
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'features', element: <FeaturesPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },

  // Auth pages
  {
    element: (
      <GuestRoute>
        <AuthLayout />
      </GuestRoute>
    ),
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },

  // Citizen routes
  {
    path: 'citizen',
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={['CITIZEN']}>
          <DashboardLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <CitizenDashboard /> },
      { path: 'report', element: <ComplaintSubmit /> },
      { path: 'complaints', element: <ComplaintHistory /> },
      { path: 'complaints/:id', element: <ComplaintDetail /> },
      { path: 'rewards', element: <RewardsPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  // Worker routes
  {
    path: 'worker',
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={['WORKER']}>
          <DashboardLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <WorkerDashboard /> },
      { path: 'tasks/:id', element: <ActiveTask /> },
      { path: 'shifts', element: <WorkerShifts /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  // Admin routes
  {
    path: 'admin',
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={['ADMIN']}>
          <DashboardLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'complaints', element: <ComplaintManagement /> },
      { path: 'complaints/:id', element: <ComplaintDetail /> },
      { path: 'workers', element: <WorkerManagement /> },
      { path: 'heatmap', element: <HeatmapPage /> },
      { path: 'ai-reports', element: <AIReportsPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  // Government routes
  {
    path: 'gov',
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={['GOVERNMENT']}>
          <DashboardLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <GovDashboard /> },
      { path: 'escalations', element: <EscalationCenter /> },
      { path: 'analytics', element: <CityAnalytics /> },
      { path: 'complaints/:id', element: <ComplaintDetail /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  // Catch-all redirect
  { path: '*', element: <Navigate to="/" replace /> },
]);

export default router;
