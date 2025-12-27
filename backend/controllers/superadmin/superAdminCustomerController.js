import OrgUser from '../../models/OrgUser.js';

/* =====================================
   GET ALL CUSTOMERS (VIEW ONLY)
===================================== */
const getCustomers = async (req, res) => {
  try {
    const customers = await OrgUser.find().sort({ _id: -1 });

    const formattedCustomers = customers.map((c) => ({
      _id: c._id,
      org_name: c.org_id || '—',

      user_name: {
        first_name: c.user_name?.first_name || '',
        last_name: c.user_name?.last_name || '',
      },

      email_address: c.email_address || '',
      phone_number: c.phone_number || '',

      address: {
        city: c.address?.city || '',
        state: c.address?.state || '',
      },

      is_active: c.is_active,
      kyc_approval_status: c.kyc_approval_status,
      user_device_status: c.user_device_status,
    }));

    res.status(200).json(formattedCustomers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getCustomers };
