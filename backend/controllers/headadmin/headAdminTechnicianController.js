import OrgTechnician from '../../models/OrgTechnician.js';
import { v4 as uuidv4 } from 'uuid';

/* =========================
   GET TECHNICIANS
========================= */
export const getTechnicians = async (req, res) => {
  try {
    const org_id = req.user.organization;

    const technicians = await OrgTechnician.find({ org_id }).sort({
      updatedAt: -1,
    });

    res.status(200).json(technicians);
  } catch (err) {
    console.error('🔥 getTechnicians:', err);
    res.status(500).json({
      message: 'Failed to fetch technicians',
    });
  }
};

/* =========================
   CREATE TECHNICIAN  ✅ REQUIRED
========================= */
export const createTechnician = async (req, res) => {
  try {
    const org_id = req.user.organization;

    const technician = await OrgTechnician.create({
      ...req.body,
      org_id,
      user_id: uuidv4(),
      is_active: false,
      work_status: 'free',
    });

    res.status(201).json({
      message: 'Technician created successfully',
      technician,
    });
  } catch (err) {
    console.error('🔥 createTechnician:', err);
    res.status(500).json({
      message: 'Failed to create technician',
    });
  }
};

/* =========================
   UPDATE TECHNICIAN
========================= */
export const updateTechnician = async (req, res) => {
  try {
    const { id } = req.params;
    const org_id = req.user.organization;
    const { is_active, kyc_approval_status } = req.body;

    const updatePayload = {};

    if (typeof is_active === 'boolean') {
      updatePayload.is_active = is_active;
    }

    if (kyc_approval_status) {
      updatePayload['kyc_details.kyc_approval_status'] =
        kyc_approval_status;
    }

    const technician = await OrgTechnician.findOneAndUpdate(
      { _id: id, org_id },
      { $set: updatePayload },
      { new: true }
    );

    if (!technician) {
      return res.status(404).json({
        message: 'Technician not found',
      });
    }

    res.status(200).json({
      message: 'Technician updated successfully',
      technician,
    });
  } catch (err) {
    console.error('🔥 updateTechnician:', err);
    res.status(500).json({
      message: 'Failed to update technician',
    });
  }
};
