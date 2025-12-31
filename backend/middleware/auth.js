import jwt from 'jsonwebtoken';

/* =====================================================
   AUTH MIDDLEWARE
   - Verifies JWT
   - Attaches decoded payload to req.user
   - Works for all roles (superadmin, headadmin, etc.)
===================================================== */
const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    /* =========================
       CHECK AUTH HEADER
    ========================= */
    if (!authHeader) {
      return res.status(401).json({
        message: 'Authorization header missing',
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Invalid authorization format',
      });
    }

    /* =========================
       EXTRACT TOKEN
    ========================= */
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        message: 'Token missing',
      });
    }

    /* =========================
       VERIFY TOKEN
    ========================= */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /*
      decoded contains:
      {
        id,
        role,
        organization,
        iat,
        exp
      }
    */

    if (!decoded?.id || !decoded?.role) {
      return res.status(401).json({
        message: 'Invalid token payload',
      });
    }

    /* =========================
       ATTACH USER
    ========================= */
    req.user = decoded;

    next();
  } catch (error) {
    console.error('❌ Auth Middleware Error:', error.message);

    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
};

export default auth;
