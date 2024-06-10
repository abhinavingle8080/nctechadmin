import { lazy } from 'react';
import GuestGard from "../guards/GuestGuard";

export const LoginPage = lazy(() => import('src/pages/login'));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      children: [
        {
          path: "/",
          element: (
            <GuestGard>
              <LoginPage />
            </GuestGard>
          ),
        },
      ],
    }
  ]
};

export default LoginRoutes;
