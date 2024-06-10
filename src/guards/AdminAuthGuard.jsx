import { useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------
import LoginPage from 'src/pages/login';

// hooks
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

AdminAuthGuard.propTypes = {
  children: PropTypes.node,
};

// export default function AdminAuthGuard({ children }) {
//   const { isAuthenticated, isInitialized, isAdmin, isUser } = useAuth();
//   const { pathname } = useLocation();
//   const [requestedLocation, setRequestedLocation] = useState(null);
//   if (!isInitialized) {
//     return <LoadingScreen />;
//   }

//   if (!isAuthenticated) {
//     if (pathname !== requestedLocation) {
//       setRequestedLocation(pathname);
//     }
//     return <LoginPage />;
//   }

//   if (requestedLocation && pathname !== requestedLocation) {
//     console.log('requestedLocation', requestedLocation);
//     setRequestedLocation(null);
//     return <Navigate to={requestedLocation} replace/>;
//   }

//   if (isAdmin) {
//     console.log('isadmin', isAdmin);
//     console.log('pathname', pathname);
//     return <Navigate to={pathname} replace />;
//   }



//   return <>{children}</>;
// }

export default function AdminAuthGuard({ children }) {
  const { isAuthenticated, isInitialized, isAdmin } = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAdmin) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <LoginPage />;
  }

  if (requestedLocation && pathname !== requestedLocation && isAdmin) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
