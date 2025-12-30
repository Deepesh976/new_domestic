import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  /* =========================
     READ FROM REDUX FIRST
  ========================= */
  const {
    token: reduxToken,
    role: reduxRole,
    organization: reduxOrg,
  } = useSelector((state) => state.auth);

  /* =========================
     FALLBACK TO LOCALSTORAGE
  ========================= */
  const token = reduxToken || localStorage.getItem('token');
  const role = reduxRole || localStorage.getItem('role');
  const organization =
    reduxOrg || localStorage.getItem('organization');

  /* =========================
     NO TOKEN → LOGIN
  ========================= */
  if (!token || !role) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  /* =========================
     ROLE VALIDATION
  ========================= */
  const normalizedRole = role.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((r) =>
    r.toLowerCase()
  );

  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(normalizedRole)
  ) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  /* =========================
     HEADADMIN → ORG REQUIRED
  ========================= */
  if (normalizedRole === 'headadmin' && !organization) {
    console.error('❌ HeadAdmin missing organization in auth state');
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  /* =========================
     ACCESS GRANTED ✅
  ========================= */
  return children;
};

export default ProtectedRoute;
