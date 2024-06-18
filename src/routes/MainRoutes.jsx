import React, { lazy, Suspense, useEffect } from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

// guards
import AdminAuthGuard from '../guards/AdminAuthGuard';
// config
import { PATH_AFTER_LOGIN } from '../config';

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
export const Leave = lazy(() => import('src/pages/app-users/admin/leaves/Leave'));
export const LeaveOperation = lazy(() => import('src/pages/app-users/admin/leaves/LeaveOperation'));

export const Designation = lazy(() => import('src/pages/app-users/admin/designation/Designation'));
export const DesignationOperation = lazy(() =>
  import('src/pages/app-users/admin/designation/DesignationOperation')
);

export const Notice = lazy(() => import('src/pages/app-users/admin/notice/Notice'));
export const NoticeOperation = lazy(() =>
  import('src/pages/app-users/admin/notice/NoticeOperation')
);

export const Team = lazy(() => import('src/pages/app-users/admin/team/Team'));
export const TeamOperation = lazy(() => import('src/pages/app-users/admin/team/TeamOperation'));

export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const UserAccount = lazy(() => import('src/pages/app-users/admin/profile/UserAccount'));

export const Student = lazy(() => import('src/pages/app-users/admin/student/Student'));

export const Courses = lazy(() => import('src/pages/app-users/admin/courses/Courses'));
export const CourseOperation = lazy(() =>
  import('src/pages/app-users/admin/courses/CourseOperation'));


export const Payment = lazy(() => import('src/pages/app-users/admin/payments/Payment'));
export const PaymentOperation = lazy(() =>
  import('src/pages/app-users/admin/payments/PaymentOperation')
);
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/admin',
  children: [
    {
      path: '/admin',
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
        { path: 'leaves/:id/edit', element: <LeaveOperation /> },
        { path: 'leaves/:id/view', element: <LeaveOperation /> },

        { path: 'designations', element: <Designation /> },
        { path: 'designations/:id/view', element: <DesignationOperation /> },
        { path: 'designations/:id/edit', element: <DesignationOperation /> },
        { path: 'designations/add', element: <DesignationOperation /> },

        { path: 'notices', element: <Notice /> },
        { path: 'notices/:id/view', element: <NoticeOperation /> },
        { path: 'notices/:id/edit', element: <NoticeOperation /> },
        { path: 'notices/add', element: <NoticeOperation /> },

        { path: 'teams', element: <Team /> },
        { path: 'teams/:id/view', element: <TeamOperation /> },
        { path: 'teams/:id/edit', element: <TeamOperation /> },
        { path: 'teams/add', element: <TeamOperation /> },

        { path: 'students', element: <Student /> },
        
        { path: 'payments', element: <Payment /> },
        { path: 'payments/:id/view', element: <PaymentOperation /> },
        { path: 'payments/:id/edit', element: <PaymentOperation /> },
        { path: 'payments/add', element: <PaymentOperation/> },

        { path: 'courses', element: <Courses /> },
        { path: 'courses/:id/view', element: <CourseOperation /> },
        { path: 'courses/:id/edit', element: <CourseOperation /> },
        { path: 'courses/add', element: <CourseOperation/> },



      ],
    },
  ],
};

// export default AppRoutes;
export default MainRoutes;
