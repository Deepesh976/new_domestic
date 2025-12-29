import OrgUser from '../../models/OrgUser.js';
import Device from '../../models/Device.js';
import RechargeTransaction from '../../models/RechargeTransaction.js';

export const getDashboard = async (req, res) => {
  try {
    const orgId = req.user.organization; // "org_001"

    const customers = await OrgUser.countDocuments({ org_id: orgId });
    const devices = await Device.countDocuments({ org_id: orgId });

    const revenueAgg = await RechargeTransaction.aggregate([
      { $match: { org_id: orgId, status: 'SUCCESS' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    res.json({
      customers,
      devices,
      revenue: revenueAgg[0]?.total || 0,
    });
  } catch (error) {
    console.error('HeadAdmin Dashboard Error:', error);
    res.status(500).json({ message: 'Dashboard load failed' });
  }
};
