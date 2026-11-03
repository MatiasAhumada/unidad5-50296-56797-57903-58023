import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';
import { ROUTES } from '../../shared/constants/appConstants';

function ProtectedRoute({ children, redirectTo = ROUTES.patientLogin }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
}

export default ProtectedRoute;
