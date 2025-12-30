import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const location = useLocation();

  /* =========================
     READ FROM REDUX
  ========================= */
  const auth = useSelector((state) => state.auth || {});

  const reduxToken = auth.token;
  const reduxRole = auth.role;
  const reduxOrganization = auth.organization;

  /* =========================
     FALLBACK TO LOCALSTORAGE
  ========================= */
  const token =
    reduxToken || localStorage.getItem('token');

  const role =
    reduxRole || localStorage.getItem('role');

  const organization =
    reduxOrganization || localStorage.getItem('organization');

  /* =========================
     NOT AUTHENTICATED
  ========================= */
  if (!token || !role) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location }}
      />
    );
  }

  /* =========================
     ROLE CHECK
  ========================= */
  const normalizedRole = String(role).toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((r) =>
    String(r).toLowerCase()
  );

  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(normalizedRole)
  ) {
    return <Navigate to="/" replace />;
  }

  /* =========================
     HEAD ADMIN → ORG REQUIRED
  ========================= */
  if (
    normalizedRole === 'headadmin' &&
    !organization
  ) {
    console.error(
      '❌ HeadAdmin missing organization in auth state'
    );
    return <Navigate to="/" replace />;
  }

  /* =========================
     ACCESS GRANTED ✅
  ========================= */
  // 🔥 THIS IS THE FIX
  // If this route is wrapped (like /profile), render children
  if (children) {
    return children;
  }

  // Otherwise render nested routes (/super-admin/*, /head-admin/*)
  return <Outlet />;
};

export default ProtectedRoute;
