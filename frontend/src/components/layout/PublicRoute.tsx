import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const userStr = localStorage.getItem('user');
  let user = null;
  
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error("Invalid session", e);
    }
  }

  // Redirect to home if user is already authenticated
  if (user && user.token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
