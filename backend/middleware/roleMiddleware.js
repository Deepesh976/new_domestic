const roleMiddleware = (...allowedRoles) => {
  // Normalize allowed roles once
  const normalizedRoles = allowedRoles.map((role) =>
    role.toLowerCase()
  );

  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        message: 'Authentication required',
      });
    }

    const userRole = req.user.role.toLowerCase();

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'Access denied: insufficient permissions',
      });
    }

    next();
  };
};

export default roleMiddleware;
