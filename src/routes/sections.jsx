import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

// guards
import AdminAuthGuard from '../guards/AdminAuthGuard';
import EmployeeAuthGuard from '../guards/EmployeeAuthGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';
import GuestGuard from '../guards/GuestGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';

// Admin Pages
export const IndexPage = lazy(() => import('src/pages/app'));
export const Dashboard = lazy(() => import('src/pages/app-users/admin/dashboard/Dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const Employee = lazy(() => import('src/pages/app-users/admin/employee/Employee'));
export const EmployeeOperation = lazy(() =>
  import('src/pages/app-users/admin/employee/EmployeeOperation')
);
export const Holiday = lazy(() => import('src/pages/app-users/admin/holidays/Holiday'));
export const HolidayOperation = lazy(() =>
  import('src/pages/app-users/admin/holidays/HolidayOperation')
);

export const Notice = lazy(() => import('src/pages/app-users/admin/notice/Notice')); 
export const NoticeOperation = lazy(() => import('src/pages/app-users/admin/notice/NoticeOperation'));


export const Leave = lazy(() => import('src/pages/app-users/admin/leaves/Leave'));
export const LeaveOperation = lazy(() => import('src/pages/app-users/admin/leaves/LeaveOperation'));

export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const UserAccount = lazy(() => import('src/pages/app-users/admin/profile/UserAccount'));



// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <LoginPage /> },
      ],
    },
    {
      path: 'user',
      element: (
        <EmployeeAuthGuard>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </EmployeeAuthGuard>
      ),
      children: [
        { path: 'dashboard', element: <Dashboard />, index: true },
      ]
    },
    {
      path: '/',
      element: (
        <AdminAuthGuard>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </AdminAuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'dashboard', element: <Dashboard />, index: true },
        {
          path: 'profile',
          children: [{ path: 'edit-profile', element: <UserAccount /> }],
        },
        { path: 'employees', element: <Employee /> },
        { path: 'employees/:id/view', element: <EmployeeOperation /> },
        { path: 'employees/:id/edit', element: <EmployeeOperation /> },
        { path: 'employees/add', element: <EmployeeOperation /> },
        { path: 'holidays', element: <Holiday /> },
        { path: 'holidays/:id/view', element: <HolidayOperation /> },
        { path: 'holidays/:id/edit', element: <HolidayOperation /> },
        { path: 'holidays/add', element: <HolidayOperation /> },
        { path: 'leaves', element: <Leave /> },
        { path: 'leaves/add', element: <LeaveOperation /> },
        { path: 'leaves/:id/view', element: <LeaveOperation /> },
        { path: 'leaves/:id/edit', element: <LeaveOperation /> },
        { path: 'notice', element: <Notice /> },  
        { path: 'notice/:id/view', element: <NoticeOperation /> },
        { path: 'notice/:id/edit', element: <NoticeOperation /> },
        { path: 'notice/add', element: <NoticeOperation /> },
      ],
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
