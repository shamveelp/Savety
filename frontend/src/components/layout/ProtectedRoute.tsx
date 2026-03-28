import { Navigate, useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const userStr = localStorage.getItem('user');
  let user = null;
  
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error("Invalid user session", e);
    }
  }

  if (!user || !user.token) {
    // Redirect to login if unauthenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
