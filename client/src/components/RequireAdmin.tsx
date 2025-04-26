import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

interface RequireAdminProps {
  children: React.ReactNode;
}

export function RequireAdmin({ children }: RequireAdminProps) {
  const { user, token } = useAuthStore();
  const location = useLocation();

  if (!user || !token) {
    // Redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.isAdmin) {
    // Redirect to home page if user is not an admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}