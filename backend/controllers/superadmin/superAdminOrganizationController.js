import Organization from '../../models/Organization.js';

/* =====================================================
   CREATE ORGANIZATION
===================================================== */
const createOrganization = async (req, res) => {
  try {
    const {
      org_id,
      org_name,
      type,
      gst_number,
      email_id,
      phone_number,
      state,
      pincode,
      country,
    } = req.body;

    // 🔒 Required field validation
    if (!org_id || !org_name || !email_id) {
      return res.status(400).json({
        message: 'org_id, org_name and email_id are required',
      });
    }

    // 🔁 Duplicate check
    const existingOrg = await Organization.findOne({
      $or: [{ org_id }, { email_id }],
    });

    if (existingOrg) {
      return res.status(409).json({
        message: 'Organization already exists',
      });
    }

    const organization = await Organization.create({
      org_id,
      org_name,
      type,
      gst_number,
      email_id,
      phone_number,
      state,
      pincode,
      country: country || 'India',
    });

    return res.status(201).json(organization);
  } catch (error) {
    console.error('Create organization error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   GET ALL ORGANIZATIONS
===================================================== */
const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find().sort({ createdAt: -1 });
    return res.status(200).json(organizations);
  } catch (error) {
    console.error('Get organizations error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   GET ORGANIZATION BY ID
===================================================== */
const getOrganizationById = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);

    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    return res.status(200).json(org);
  } catch (error) {
    console.error('Get organization error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   UPDATE ORGANIZATION
===================================================== */
const updateOrganization = async (req, res) => {
  try {
    const updated = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body, // snake_case safe
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    return res.status(200).json(updated);
  } catch (error) {
    console.error('Update organization error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   DELETE ORGANIZATION
===================================================== */
const deleteOrganization = async (req, res) => {
  try {
    const deleted = await Organization.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    return res.status(200).json({ message: 'Organization deleted' });
  } catch (error) {
    console.error('Delete organization error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* =====================================================
   EXPORTS (NO DUPLICATES)
===================================================== */
export {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
};
