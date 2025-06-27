import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authToken } = useAuth();

  return authToken ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
