import OrgAdmin from '../../models/OrgAdmin.js';
import OrgHeadAdmin from '../../models/OrgHeadAdmin.js';

/* ======================================================
   GET ADMINS + HEADADMINS (SAME ORGANIZATION ONLY)
====================================================== */
export const getAdmins = async (req, res) => {
  try {
    // 🔥 Always resolve org from DB (NOT from token)
    const headAdmin = await OrgHeadAdmin.findById(req.user.id);

    if (!headAdmin) {
      return res.status(401).json({
        message: 'Invalid head admin',
      });
    }

    const orgId = headAdmin.org_id; // e.g. "org_001"

    // 1️⃣ Get all HeadAdmins of same org
    const headAdmins = await OrgHeadAdmin.find({
      org_id: orgId,
    }).select('-password');

    // 2️⃣ Get all Admins of same org
    const admins = await OrgAdmin.find({
      org_id: orgId,
    }).select('-password');

    // 3️⃣ Normalize & combine
    const users = [
      ...headAdmins.map((h) => ({
        _id: h._id,
        username: h.username,
        email: h.email,
        phoneNo: h.phoneNo || '',
        location: h.location || '',
        role: 'headadmin',
      })),
      ...admins.map((a) => ({
        _id: a._id,
        username: a.username,
        email: a.email,
        phoneNo: a.phoneNo || '',
        location: a.location || '',
        role: 'admin',
      })),
    ];

    res.status(200).json({
      admins: users,
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      message: 'Failed to fetch users',
    });
  }
};

/* ======================================================
   CREATE ADMIN (ADMIN ONLY, SAME ORG)
====================================================== */
export const createAdmin = async (req, res) => {
  try {
    const { username, email, password, phone_no, location } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: 'username, email and password are required',
      });
    }

    // 🔥 Get org info from headadmin
    const headAdmin = await OrgHeadAdmin.findById(req.user.id);

    if (!headAdmin) {
      return res.status(401).json({
        message: 'Invalid head admin',
      });
    }

    // Prevent duplicate admin in same org
    const existingAdmin = await OrgAdmin.findOne({
      email,
      org_id: headAdmin.org_id,
    });

    if (existingAdmin) {
      return res.status(409).json({
        message: 'Admin already exists in this organization',
      });
    }

    const admin = await OrgAdmin.create({
      username,
      email,
      password,
      phoneNo: phone_no,
      location,
      role: 'admin',

      // ✅ REQUIRED BY SCHEMA
      org_id: headAdmin.org_id,
      organization: headAdmin.organization, // ObjectId
    });

    res.status(201).json({
      message: 'Admin created successfully',
      admin,
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({
      message: 'Failed to create admin',
    });
  }
};

/* ======================================================
   UPDATE ADMIN (ORG SAFE)
====================================================== */
export const updateAdmin = async (req, res) => {
  try {
    const { username, email, phone_no, location, password } = req.body;

    const updateData = {
      username,
      email,
      phoneNo: phone_no,
      location,
    };

    if (password) {
      updateData.password = password;
    }

    // 🔥 Get org_id from DB (safety)
    const headAdmin = await OrgHeadAdmin.findById(req.user.id);

    if (!headAdmin) {
      return res.status(401).json({
        message: 'Invalid head admin',
      });
    }

    const admin = await OrgAdmin.findOneAndUpdate(
      {
        _id: req.params.adminId,
        org_id: headAdmin.org_id,
      },
      updateData,
      { new: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found for this organization',
      });
    }

    res.status(200).json({
      message: 'Admin updated successfully',
      admin,
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({
      message: 'Failed to update admin',
    });
  }
};

/* ======================================================
   DELETE ADMIN (ADMIN ONLY, SAME ORG)
====================================================== */
export const deleteAdmin = async (req, res) => {
  try {
    // 🔥 Resolve org safely
    const headAdmin = await OrgHeadAdmin.findById(req.user.id);

    if (!headAdmin) {
      return res.status(401).json({
        message: 'Invalid head admin',
      });
    }

    const admin = await OrgAdmin.findOneAndDelete({
      _id: req.params.adminId,
      org_id: headAdmin.org_id,
    });

    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found for this organization',
      });
    }

    res.status(200).json({
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      message: 'Failed to delete admin',
    });
  }
};
