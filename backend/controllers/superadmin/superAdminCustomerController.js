const OrgUser = require('../../models/OrgUser');

/* =====================================
   GET ALL CUSTOMERS (VIEW ONLY)
===================================== */
exports.getCustomers = async (req, res) => {
  try {
    const customers = await OrgUser.find().sort({ _id: -1 });

    res.status(200).json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
