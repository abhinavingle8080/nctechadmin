import React, { lazy,  Suspense, useEffect, } from "react";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";

import DashboardLayout from 'src/layouts/dashboard';

// guards
import EmployeeAuthGuard from '../guards/EmployeeAuthGuard';
// config
import { USER_DASHBOARD_PATH } from '../config';

// User Pages
export const IndexPage = lazy(() => import('src/pages/app'));
export const Dashboard = lazy(() => import('src/pages/app-users/employee/dashboard/Dashboard'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const Employee = lazy(() => import('src/pages/app-users/employee/employee/Employee'));
export const EmployeeOperation = lazy(() =>
  import('src/pages/app-users/employee/employee/EmployeeOperation')
);
export const Holiday = lazy(() => import('src/pages/app-users/employee/holidays/Holiday'));
export const HolidayOperation = lazy(() =>
  import('src/pages/app-users/employee/holidays/HolidayOperation')
);
export const Leave = lazy(() => import('src/pages/app-users/employee/leaves/Leave'));
export const LeaveOperation = lazy(() =>
  import('src/pages/app-users/employee/leaves/LeaveOperation')
);
const Notices = lazy(() => import('src/pages/app-users/employee/notices/Notices'));
const NoticesOperation = lazy(() =>
  import('src/pages/app-users/employee/notices/NoticeOperation')
);
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const UserAccount = lazy(() =>
  import('src/pages/app-users/employee/profile/UserAccount')
);

// ==============================|| MAIN ROUTING ||============================== //

const UserRoutes = {
  path: "/user",
  children: [
    {
      path: "/user",
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
        { element: <Navigate to={USER_DASHBOARD_PATH} replace />, index: true },
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
        { path: 'notices', element: <Notices /> },
        { path: 'notices/:id/view', element: <NoticesOperation /> },
        { path: 'notices/:id/edit', element: <NoticesOperation /> },
        { path: 'notices/add', element: <NoticesOperation /> },
      ],
    }
  ]
};

// export default AppRoutes;
export default UserRoutes;