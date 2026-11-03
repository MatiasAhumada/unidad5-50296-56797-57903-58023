import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';
import { ROUTES } from '../../shared/constants/appConstants';

function ProtectedRoute({
  children,
  allowedRole,
  redirectTo = ROUTES.patientLogin,
}) {
  const { isAuthenticated, role, sessionExpired } = useAuth();

  if (!isAuthenticated) {
    const loginRoute = sessionExpired
      ? `${redirectTo}?session=expired`
      : redirectTo;

    return <Navigate to={loginRoute} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={ROUTES.accessDenied} replace />;
  }

  return children;
}

export default ProtectedRoute;
