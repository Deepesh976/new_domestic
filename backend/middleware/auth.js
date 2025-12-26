const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/SuperAdmin');

const protect = async (req, res, next) => {
  let token;

  // Expect: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      message: 'Not authorized, no token',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // SUPERADMIN ONLY (for now)
    const admin = await SuperAdmin.findById(decoded.id).select('-password');

    if (!admin) {
      return res.status(401).json({
        message: 'Not authorized, user not found',
      });
    }

    // Attach user to request
    req.user = {
      id: admin._id,
      role: 'SUPERADMIN',
      email: admin.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Not authorized, token failed',
    });
  }
};

module.exports = protect;
