import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import OrgHeadAdmin from '../../models/OrgHeadAdmin.js';

/* =====================================================
   HEAD ADMIN LOGIN
   - Secure password check
   - Org scoped JWT
   - Matches frontend + middleware expectations
===================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* =========================
       BASIC VALIDATION
    ========================= */
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    /* =========================
       FIND HEAD ADMIN
    ========================= */
    const headAdmin = await OrgHeadAdmin.findOne({
      email: email.toLowerCase(),
    }).populate('organization');

    if (!headAdmin) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    /* =========================
       PASSWORD CHECK 🔐
    ========================= */
    const isMatch = await bcrypt.compare(
      password,
      headAdmin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    /* =========================
       ORG VALIDATION
    ========================= */
    if (
      !headAdmin.organization ||
      !headAdmin.organization.org_id
    ) {
      return res.status(400).json({
        message: 'Organization not linked properly',
      });
    }

    /* =========================
       SIGN JWT
       org_id is STRING (org_001)
    ========================= */
    const token = jwt.sign(
      {
        id: headAdmin._id,
        role: 'headadmin',
        organization: headAdmin.organization.org_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    /* =========================
       SUCCESS RESPONSE
    ========================= */
    return res.status(200).json({
      token,
      role: 'headadmin',
      organization: headAdmin.organization.org_id,
      user: {
        id: headAdmin._id,
        username: headAdmin.username,
        email: headAdmin.email,
      },
    });
  } catch (error) {
    console.error('❌ HeadAdmin Login Error:', error);
    return res.status(500).json({
      message: 'Login failed',
    });
  }
};
