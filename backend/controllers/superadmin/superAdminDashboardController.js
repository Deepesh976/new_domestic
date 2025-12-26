import Organization from '../../models/Organization.js';
import OrgUser from '../../models/OrgUser.js';
import OrgAdmin from '../../models/OrgAdmin.js';
import OrgHeadAdmin from '../../models/OrgHeadAdmin.js';
import RechargeTransaction from '../../models/RechargeTransaction.js';

/* =====================================================
   SUPER ADMIN DASHBOARD SUMMARY
===================================================== */
export const getDashboardSummary = async (req, res) => {
  try {
    /* -------------------------
       ORGANIZATION COUNT
    ------------------------- */
    const totalOrganizations = await Organization.countDocuments();

    /* -------------------------
       USER / ADMIN COUNTS
    ------------------------- */
    const totalCustomers = await OrgUser.countDocuments();
    const totalAdmins = await OrgAdmin.countDocuments();
    const totalHeadAdmins = await OrgHeadAdmin.countDocuments();

    /* -------------------------
       TOTAL REVENUE
    ------------------------- */
    const revenueAgg = await RechargeTransaction.aggregate([
      {
        $match: { status: 'SUCCESS' },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amount' },
        },
      },
    ]);

    const totalRevenue =
      revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    /* -------------------------
       CUSTOMER GROWTH (MONTHLY)
    ------------------------- */
    const customerGrowth = await OrgUser.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    /* -------------------------
       REVENUE GROWTH (MONTHLY)
    ------------------------- */
    const revenueGrowth = await RechargeTransaction.aggregate([
      {
        $match: { status: 'SUCCESS' },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    /* -------------------------
       RESPONSE
    ------------------------- */
    res.status(200).json({
      stats: {
        totalOrganizations,
        totalCustomers,
        totalAdmins,
        totalHeadAdmins,
        totalRevenue,
      },
      customerGrowth,
      revenueGrowth,
    });
  } catch (error) {
    console.error('SuperAdmin Dashboard Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
