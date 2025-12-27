import Organization from '../../models/Organization.js';

/* =========================
   CREATE ORGANIZATION
========================= */
export const createOrganization = async (req, res) => {
  try {
    const {
      organizationName,
      type,
      gstNumber,
      emailId,
      phoneNumber,
      pincode,
      building,
      area,
      district,
      state,
      country,
    } = req.body;

    /* =========================
       VALIDATION
    ========================= */
    if (!organizationName || !emailId) {
      return res.status(400).json({
        message: 'Organization name and email are required',
      });
    }

    /* =========================
       DUPLICATE CHECK
    ========================= */
    const existingOrg = await Organization.findOne({ emailId });
    if (existingOrg) {
      return res.status(400).json({
        message: 'Organization already exists with this email',
      });
    }

    /* =========================
       CREATE
    ========================= */
    const organization = await Organization.create({
      organizationName,
      type,
      gstNumber,
      emailId,
      phoneNumber,
      pincode,
      building,
      area,
      district,
      state,
      country: country || 'India',
    });

    res.status(201).json({
      message: 'Organization created successfully',
      organization,
    });
  } catch (error) {
    console.error('Create organization error:', error);
    res.status(500).json({
      message: 'Failed to create organization',
    });
  }
};

/* =========================
   GET ALL ORGANIZATIONS
========================= */
export const getOrganizations = async (req, res) => {
  try {
    const orgs = await Organization.find().sort({ createdAt: -1 });
    res.json(orgs);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch organizations',
    });
  }
};

/* =========================
   GET ORGANIZATION BY ID
========================= */
export const getOrganizationById = async (req, res) => {
  try {
    const org = await Organization.findById(req.params.id);

    if (!org) {
      return res.status(404).json({
        message: 'Organization not found',
      });
    }

    res.json(org);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch organization',
    });
  }
};

/* =========================
   UPDATE ORGANIZATION
========================= */
export const updateOrganization = async (req, res) => {
  try {
    const org = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!org) {
      return res.status(404).json({
        message: 'Organization not found',
      });
    }

    res.json(org);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update organization',
    });
  }
};

/* =========================
   DELETE ORGANIZATION
========================= */
export const deleteOrganization = async (req, res) => {
  try {
    const org = await Organization.findByIdAndDelete(req.params.id);

    if (!org) {
      return res.status(404).json({
        message: 'Organization not found',
      });
    }

    res.json({
      message: 'Organization deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete organization',
    });
  }
};
