import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/* =====================================================
   PROTECTED ROUTE
   - Auth + Role guard
   - Supports superadmin, headadmin, admin
   - NO dependency on password hashing
===================================================== */

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const location = useLocation();

  /* =========================
     READ FROM REDUX
  ========================= */
  const auth = useSelector((state) => state.auth || {});

  const reduxToken = auth.token;
  const reduxRole = auth.role;
  const reduxOrgId =
    auth.org_id || auth.organization || null;

  /* =========================
     FALLBACK TO LOCALSTORAGE
  ========================= */
  const token =
    reduxToken || localStorage.getItem('token');

  const role =
    reduxRole || localStorage.getItem('role');

  const orgId =
    reduxOrgId ||
    localStorage.getItem('org_id') ||
    localStorage.getItem('organization');

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
     NORMALIZE ROLE
  ========================= */
  const normalizedRole = String(role).toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((r) =>
    String(r).toLowerCase()
  );

  /* =========================
     ROLE CHECK
  ========================= */
  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(normalizedRole)
  ) {
    console.warn(
      `❌ Role "${normalizedRole}" not allowed`
    );
    return <Navigate to="/" replace />;
  }

  /* =========================
     ORG CONTEXT CHECK
     (Admin + HeadAdmin ONLY)
  ========================= */
  if (
    (normalizedRole === 'headadmin' ||
      normalizedRole === 'admin') &&
    !orgId
  ) {
    console.error(
      `❌ ${normalizedRole} missing org_id`
    );
    return <Navigate to="/" replace />;
  }

  /* =========================
     ACCESS GRANTED ✅
  ========================= */
  // Wrapped usage
  if (children) {
    return children;
  }

  // Nested routes usage
  return <Outlet />;
};

export default ProtectedRoute;
