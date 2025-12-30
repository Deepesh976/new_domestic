import jwt from 'jsonwebtoken';
import SuperAdmin from '../../models/SuperAdmin.js';

/* =====================================================
   REGISTER SUPER ADMIN
===================================================== */
const superAdminRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingAdmin = await SuperAdmin.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      return res.status(400).json({ message: 'SuperAdmin already exists' });
    }

    // 🔥 DO NOT HASH HERE (MODEL WILL HANDLE IT)
    const admin = await SuperAdmin.create({
      username,
      email: email.toLowerCase(),
      password,
    });

    return res.status(201).json({
      success: true,
      message: 'SuperAdmin registered successfully',
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('❌ SUPERADMIN REGISTER ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   LOGIN SUPER ADMIN
===================================================== */
const superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    // 🔥 MUST SELECT PASSWORD
    const admin = await SuperAdmin.findOne({
      email: email.toLowerCase(),
    }).select('+password');

    if (!admin) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    // 🔥 USE MODEL METHOD
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password',
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'superadmin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      token,
      role: 'superadmin',
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('❌ SUPERADMIN LOGIN ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   CHANGE PASSWORD (LOGGED IN)
===================================================== */
const changeSuperAdminPassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters',
      });
    }

    const admin = await SuperAdmin.findById(adminId);

    if (!admin) {
      return res.status(404).json({ message: 'SuperAdmin not found' });
    }

    // 🔥 DO NOT HASH HERE
    admin.password = password;
    await admin.save();

    return res.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('❌ CHANGE PASSWORD ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   RESET PASSWORD (FORGOT PASSWORD / POSTMAN)
===================================================== */
const resetSuperAdminPasswordByEmail = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: 'Email and newPassword are required',
      });
    }

    const admin = await SuperAdmin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      return res.status(404).json({
        message: 'SuperAdmin not found',
      });
    }

    // 🔥 DO NOT HASH HERE
    admin.password = newPassword;
    await admin.save();

    return res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('❌ RESET PASSWORD ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export {
  superAdminRegister,
  superAdminLogin,
  changeSuperAdminPassword,
  resetSuperAdminPasswordByEmail,
};
