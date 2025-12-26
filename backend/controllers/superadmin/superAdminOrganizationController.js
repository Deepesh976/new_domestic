import Organization from '../../models/Organization.js';

/* =========================
   CREATE ORGANIZATION
========================= */

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
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json(org);
  } catch {
    res.status(500).json({ message: 'Failed to fetch organization' });
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
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json(org);
  } catch {
    res.status(500).json({ message: 'Failed to update organization' });
  }
};

/* =========================
   DELETE ORGANIZATION
========================= */
export const deleteOrganization = async (req, res) => {
  try {
    const org = await Organization.findByIdAndDelete(req.params.id);

    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    res.json({ message: 'Organization deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Failed to delete organization' });
  }
};
