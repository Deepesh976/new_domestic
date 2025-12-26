import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { checkTokenExpiration } from '../../utils/authUtils';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const reduxToken = useSelector((state) => state.auth.token);
  const reduxRole = useSelector((state) => state.auth.role);

  // 🔥 fallback to localStorage
  const token = reduxToken || localStorage.getItem('token');
  const role = reduxRole || localStorage.getItem('role');

  useEffect(() => {
    checkTokenExpiration();
  }, []);

  /* =========================
     AUTH CHECK
  ========================= */
  if (!token || !checkTokenExpiration()) {
    return <Navigate to="/login" replace />;
  }

  /* =========================
     ROLE CHECK
  ========================= */
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
