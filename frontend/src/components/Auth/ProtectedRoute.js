import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

/* =====================================================
   PROTECTED ROUTE
   - Auth guard
   - Role-based access
   - Org isolation for headadmin/admin
===================================================== */

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();

  /* =========================
     READ AUTH (REDUX → STORAGE)
  ========================= */
  const auth = useSelector((state) => state.auth || {});

  const token =
    auth.token ||
    localStorage.getItem('token');

  const role =
    auth.role ||
    localStorage.getItem('role');

  const orgId =
    auth.org_id ||
    localStorage.getItem('org_id');

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
     ROLE NOT ALLOWED
  ========================= */
  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(normalizedRole)
  ) {
    return <Navigate to="/" replace />;
  }

  /* =========================
     ORG CHECK (HEADADMIN / ADMIN)
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
  return <Outlet />;
};

export default ProtectedRoute;
