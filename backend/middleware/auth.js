import jwt from 'jsonwebtoken';
import SuperAdmin from '../models/SuperAdmin.js';

const protect = async (req, res, next) => {
  let token;

  /* =========================
     READ TOKEN
  ========================= */
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      message: 'Not authorized, token missing',
    });
  }

  try {
    /* =========================
       VERIFY TOKEN
    ========================= */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* =========================
       LOAD USER
    ========================= */
    const admin = await SuperAdmin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        message: 'Not authorized, user not found',
      });
    }

    /* =========================
       ATTACH USER (NORMALIZED)
    ========================= */
    req.user = {
      id: admin._id.toString(),
      email: admin.email,
      role: (admin.role || 'superadmin').toLowerCase(), // 🔥 normalize
    };

    next();
  } catch (error) {
    console.error('Auth error:', error.message);

    return res.status(401).json({
      message: 'Not authorized, token invalid or expired',
    });
  }
};

export default protect;
