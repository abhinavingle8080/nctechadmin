import { useState } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------
import LoginPage from 'src/pages/login';

// config
import { USER_DASHBOARD_PATH } from '../config';

// hooks
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/LoadingScreen';

// ----------------------------------------------------------------------

EmployeeAuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function EmployeeAuthGuard({ children }) {
  const { isAuthenticated, isInitialized, isUser } = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isUser) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Navigate to={USER_DASHBOARD_PATH} />;
  }

  if (requestedLocation && pathname !== requestedLocation && isUser) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
}
