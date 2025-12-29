import bcrypt from 'bcryptjs';
import OrgAdmin from '../../models/OrgAdmin.js';
import OrgHeadAdmin from '../../models/OrgHeadAdmin.js';
import Organization from '../../models/Organization.js';

/* =====================================================
   CREATE ADMIN / HEAD ADMIN
===================================================== */
const createAdmin = async (req, res) => {
  try {
    const {
      organization, // Organization ObjectId
      username,
      email,
      password,
      phoneNo,
      location,
      role, // "admin" | "headadmin"
    } = req.body;

    /* -------------------------
       BASIC VALIDATION
    ------------------------- */
    if (!organization || !username || !email || !password || !role) {
      return res.status(400).json({
        message: 'Required fields missing',
      });
    }

    /* -------------------------
       FETCH ORGANIZATION
    ------------------------- */
    const org = await Organization.findById(organization);
    if (!org) {
      return res.status(404).json({
        message: 'Organization not found',
      });
    }

    /* -------------------------
       SELECT MODEL BY ROLE
    ------------------------- */
    const Model = role === 'headadmin' ? OrgHeadAdmin : OrgAdmin;

    /* -------------------------
       DUPLICATE EMAIL CHECK
    ------------------------- */
    const existing = await Model.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: 'Admin already exists with this email',
      });
    }

    /* -------------------------
       HASH PASSWORD
    ------------------------- */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* -------------------------
       CREATE ADMIN
    ------------------------- */
    const admin = await Model.create({
      organization: org._id,
      org_id: org.org_id, // ✅ AUTO-FILLED
      username,
      email,
      password: hashedPassword,
      phoneNo,
      location,
      role,
    });

    return res.status(201).json({
      message: 'Admin created successfully',
      admin,
    });
  } catch (error) {
    console.error('Create admin error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   GET ALL ADMINS + HEAD ADMINS
===================================================== */
const getAdmins = async (req, res) => {
  try {
    const admins = await OrgAdmin.find()
      .populate('organization', 'org_id org_name')
      .sort({ createdAt: -1 });

    const headAdmins = await OrgHeadAdmin.find()
      .populate('organization', 'org_id org_name')
      .sort({ createdAt: -1 });

    return res.status(200).json([...admins, ...headAdmins]);
  } catch (error) {
    console.error('Get admins error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   GET ADMIN BY ID
===================================================== */
const getAdminById = async (req, res) => {
  try {
    let admin = await OrgAdmin.findById(req.params.id)
      .populate('organization', 'org_id org_name');

    if (!admin) {
      admin = await OrgHeadAdmin.findById(req.params.id)
        .populate('organization', 'org_id org_name');
    }

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    return res.status(200).json(admin);
  } catch (error) {
    console.error('Get admin error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   UPDATE ADMIN / HEAD ADMIN
===================================================== */
const updateAdmin = async (req, res) => {
  try {
    const { role, password, organization, ...rest } = req.body;

    const Model = role === 'headadmin' ? OrgHeadAdmin : OrgAdmin;

    /* -------------------------
       HANDLE ORG CHANGE
    ------------------------- */
    if (organization) {
      const org = await Organization.findById(organization);
      if (!org) {
        return res.status(404).json({
          message: 'Organization not found',
        });
      }

      rest.organization = org._id;
      rest.org_id = org.org_id; // ✅ SYNC org_id
    }

    /* -------------------------
       HASH PASSWORD (IF UPDATED)
    ------------------------- */
    if (password) {
      rest.password = await bcrypt.hash(password, 10);
    }

    const admin = await Model.findByIdAndUpdate(
      req.params.id,
      rest,
      { new: true }
    ).populate('organization', 'org_id org_name');

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    return res.status(200).json({
      message: 'Admin updated successfully',
      admin,
    });
  } catch (error) {
    console.error('Update admin error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   DELETE ADMIN / HEAD ADMIN
===================================================== */
const deleteAdmin = async (req, res) => {
  try {
    const adminDeleted = await OrgAdmin.findByIdAndDelete(req.params.id);
    const headAdminDeleted = await OrgHeadAdmin.findByIdAndDelete(req.params.id);

    if (!adminDeleted && !headAdminDeleted) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    return res.status(200).json({
      message: 'Admin deleted successfully',
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   EXPORTS
===================================================== */
export {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
