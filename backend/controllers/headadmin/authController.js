import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import OrgAdmin from '../../models/OrgAdmin.js';
import OrgHeadAdmin from '../../models/OrgHeadAdmin.js';
import Organization from '../../models/Organization.js';

/* =====================================================
   ADMIN + HEADADMIN LOGIN (UNIFIED)
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

    const normalizedEmail = email.toLowerCase();

    let user = null;
    let role = null;
    let organization = null;

    /* =========================
       TRY HEAD ADMIN FIRST
    ========================= */
    const headAdmin = await OrgHeadAdmin.findOne({
      email: normalizedEmail,
    })
      .select('+password')
      .populate('organization');

    if (headAdmin) {
      user = headAdmin;
      role = 'headadmin';
      organization = headAdmin.organization;
    } else {
      /* =========================
         TRY ADMIN
      ========================= */
      const admin = await OrgAdmin.findOne({
        email: normalizedEmail,
      }).select('+password');

      if (admin) {
        user = admin;
        role = 'admin';

        organization = await Organization.findOne({
          org_id: admin.org_id,
        });
      }
    }

    /* =========================
       USER / ORG VALIDATION
    ========================= */
    if (!user || !organization) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    /* =========================
       PASSWORD CHECK
    ========================= */
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    /* =========================
       SIGN JWT
       (ONLY org_id INSIDE TOKEN)
    ========================= */
    const token = jwt.sign(
      {
        id: user._id,
        role,
        org_id: organization.org_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    /* =========================
       RESPONSE (FRONTEND FRIENDLY)
    ========================= */
    return res.status(200).json({
      token,
      role,

      organization: {
        org_id: organization.org_id,
        org_name: organization.org_name,
        logo: organization.logo || null,
      },

      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('❌ Unified Login Error:', error);
    return res.status(500).json({
      message: 'Login failed',
    });
  }
};

/* =====================================================
   CHANGE PASSWORD (ADMIN + HEADADMIN)
===================================================== */
export const changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { id, role } = req.user;

    /* =========================
       VALIDATION
    ========================= */
    if (!password || password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long',
      });
    }

    let user = null;

    /* =========================
       FIND USER BY ROLE
    ========================= */
    if (role === 'headadmin') {
      user = await OrgHeadAdmin.findById(id).select('+password');
    } else if (role === 'admin') {
      user = await OrgAdmin.findById(id).select('+password');
    } else {
      return res.status(403).json({
        message: 'Unauthorized role',
      });
    }

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    /* =========================
       HASH & SAVE PASSWORD
    ========================= */
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res.status(200).json({
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('❌ Change Password Error:', error);
    return res.status(500).json({
      message: 'Failed to update password',
    });
  }
};
