const bcrypt = require('bcryptjs');
const OrgAdmin = require('../../models/OrgAdmin');
const OrgHeadAdmin = require('../../models/OrgHeadAdmin');

/* =====================================================
   CREATE ADMIN / HEAD ADMIN
===================================================== */
exports.createAdmin = async (req, res) => {
  try {
    const {
      organization, // ObjectId
      username,
      email,
      password,
      phoneNo,
      location,
      role, // "admin" | "headadmin"
    } = req.body;

    if (!organization || !email || !password || !role) {
      return res.status(400).json({
        message: 'Required fields missing',
      });
    }

    // ✅ choose correct model
    const Model = role === 'headadmin' ? OrgHeadAdmin : OrgAdmin;

    // ✅ check duplicate email
    const existing = await Model.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: 'Admin already exists with this email',
      });
    }

    // ✅ hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Model.create({
      organization,
      username,
      email,
      password: hashedPassword,
      phoneNo,
      location,
      role,
    });

    res.status(201).json({
      message: 'Admin created successfully',
      admin,
    });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   GET ALL ADMINS + HEAD ADMINS
===================================================== */
exports.getAdmins = async (req, res) => {
  try {
    const admins = await OrgAdmin.find()
      .populate('organization', 'organizationName');

    const headAdmins = await OrgHeadAdmin.find()
      .populate('organization', 'organizationName');

    res.status(200).json([...admins, ...headAdmins]);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   GET ADMIN BY ID
===================================================== */
exports.getAdminById = async (req, res) => {
  try {
    let admin =
      (await OrgAdmin.findById(req.params.id)
        .populate('organization', 'organizationName')) ||
      (await OrgHeadAdmin.findById(req.params.id)
        .populate('organization', 'organizationName'));

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error('Get admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   UPDATE ADMIN
===================================================== */
exports.updateAdmin = async (req, res) => {
  try {
    const { role } = req.body;
    const Model = role === 'headadmin' ? OrgHeadAdmin : OrgAdmin;

    const admin = await Model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({
      message: 'Admin updated successfully',
      admin,
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   DELETE ADMIN / HEAD ADMIN
===================================================== */
exports.deleteAdmin = async (req, res) => {
  try {
    await OrgAdmin.findByIdAndDelete(req.params.id);
    await OrgHeadAdmin.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
