import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

// hooks
import useAuth from '../hooks/useAuth';
// config
import { PATH_AFTER_LOGIN, USER_DASHBOARD_PATH } from '../config';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, isAdmin, isUser } = useAuth();

  if (isAuthenticated && isAdmin) {
    return <Navigate to={PATH_AFTER_LOGIN} replace/>;
  }
  if (isAuthenticated && isUser) {
    return <Navigate to={USER_DASHBOARD_PATH} replace/>;
  }

  return <>{children}</>;
}
