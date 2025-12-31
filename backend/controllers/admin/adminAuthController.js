import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import OrgAdmin from '../../models/OrgAdmin.js';

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email & password required' });
    }

    const admin = await OrgAdmin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: 'admin',
        org_id: admin.org_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        org_id: admin.org_id,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};
