import OrgUser from '../../models/OrgUser.js';

/* =====================================================
   HEAD ADMIN – CUSTOMER CONTROLLER
   RULES:
   - Organization isolation via org_id (string)
   - HeadAdmin can access ONLY their org customers
===================================================== */

/* =========================
   GET ALL CUSTOMERS (ORG-SCOPED)
========================= */
export const getCustomers = async (req, res) => {
  try {
    const org_id = req.user.organization; // e.g. "org_001"

    if (!org_id) {
      return res.status(403).json({
        message: 'Organization access denied',
      });
    }

    const customers = await OrgUser.find({ org_id }).sort({ createdAt: -1 });

    res.status(200).json({
      count: customers.length,
      customers,
    });
  } catch (error) {
    console.error('❌ Get Customers Error:', error);
    res.status(500).json({
      message: 'Failed to fetch customers',
    });
  }
};

/* =========================
   UPDATE KYC STATUS
   allowed: approved | rejected
========================= */
export const updateKycStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const org_id = req.user.organization;
    const customer_id = req.params.id;

    const allowedStatuses = ['approved', 'rejected'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid KYC status',
      });
    }

    const customer = await OrgUser.findOneAndUpdate(
      {
        _id: customer_id,
        org_id,
      },
      {
        $set: {
          'kyc_details.kyc_approval_status': status,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found or access denied',
      });
    }

    res.status(200).json({
      message: 'KYC status updated successfully',
      customer,
    });
  } catch (error) {
    console.error('❌ Update KYC Error:', error);
    res.status(500).json({
      message: 'Failed to update KYC status',
    });
  }
};

/* =========================
   UPDATE DEVICE STATUS
   allowed: linked | unlinked | declined
========================= */
export const updateDeviceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const org_id = req.user.organization;
    const customer_id = req.params.id;

    const allowedStatuses = ['linked', 'unlinked', 'declined'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid device status',
      });
    }

    const customer = await OrgUser.findOneAndUpdate(
      {
        _id: customer_id,
        org_id,
      },
      {
        $set: {
          user_device_status: status,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        message: 'Customer not found or access denied',
      });
    }

    res.status(200).json({
      message: 'Device status updated successfully',
      customer,
    });
  } catch (error) {
    console.error('❌ Update Device Error:', error);
    res.status(500).json({
      message: 'Failed to update device status',
    });
  }
};
