import jwt from 'jsonwebtoken';
import OrgHeadAdmin from '../../models/OrgHeadAdmin.js';

/* =====================================================
   HEAD ADMIN LOGIN
   - embeds org_id (string) into JWT
===================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const headAdmin = await OrgHeadAdmin.findOne({ email }).populate(
      'organization'
    );

    if (!headAdmin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 🔐 TODO: bcrypt.compare(password, headAdmin.password)

    if (!headAdmin.organization?.org_id) {
      return res.status(400).json({
        message: 'Organization not linked properly',
      });
    }

    /* =========================
       SIGN JWT (org_id STRING)
    ========================= */
    const token = jwt.sign(
      {
        id: headAdmin._id,
        role: 'headadmin',
        organization: headAdmin.organization.org_id, // 🔥 org_001
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      role: 'headadmin',
      organization: headAdmin.organization.org_id,
    });
  } catch (error) {
    console.error('HeadAdmin Login Error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};
