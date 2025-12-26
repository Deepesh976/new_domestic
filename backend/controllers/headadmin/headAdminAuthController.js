import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import OrgHeadAdmin from '../../models/OrgHeadAdmin.js';

/* =========================
   HEAD ADMIN LOGIN
========================= */
export const loginHeadAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* -------------------------
       VALIDATION
    ------------------------- */
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    /* -------------------------
       FIND HEAD ADMIN
    ------------------------- */
    const headAdmin = await OrgHeadAdmin.findOne({ email })
      .populate('organization', 'organizationName');

    if (!headAdmin) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    /* -------------------------
       PASSWORD CHECK
    ------------------------- */
    const isMatch = await bcrypt.compare(password, headAdmin.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    /* -------------------------
       JWT GENERATION
    ------------------------- */
    const token = jwt.sign(
      {
        userId: headAdmin._id,
        role: 'HEADADMIN',
        organization: headAdmin.organization?._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    /* -------------------------
       RESPONSE
    ------------------------- */
    res.status(200).json({
      token,
      role: 'HEADADMIN',
      user: {
        id: headAdmin._id,
        name: headAdmin.name,
        email: headAdmin.email,
        organization: headAdmin.organization,
      },
    });
  } catch (error) {
    console.error('❌ HeadAdmin login error:', error);
    res.status(500).json({
      message: 'Server error',
    });
  }
};
