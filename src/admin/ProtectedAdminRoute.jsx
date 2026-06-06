import { Navigate, useLocation } from 'react-router-dom';
import { getStoredAdmin } from '../lib/authStorage.js';

export default function ProtectedAdminRoute({ children }) {
  const location = useLocation();
  const session = getStoredAdmin();

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
