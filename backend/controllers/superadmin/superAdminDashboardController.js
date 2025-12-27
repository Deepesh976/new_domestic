import Organization from '../../models/Organization.js';
import OrgUser from '../../models/OrgUser.js';
import OrgAdmin from '../../models/OrgAdmin.js';
import OrgHeadAdmin from '../../models/OrgHeadAdmin.js';
import RechargeTransaction from '../../models/RechargeTransaction.js';

/* =====================================================
   SUPER ADMIN DASHBOARD (ORG-AWARE)
===================================================== */
const getDashboardSummary = async (req, res) => {
  try {
    const { organizationId, year } = req.query;

    if (!organizationId || !year) {
      return res.status(400).json({ message: 'Missing parameters' });
    }

    /* -------------------------
       FETCH ORGANIZATION
    ------------------------- */
    const org = await Organization.findById(organizationId);
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }

    const orgIdString = org.org_id || org.organizationCode || org._id.toString();

    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31`);

    /* -------------------------
       COUNTS
    ------------------------- */
    const totalCustomers = await OrgUser.countDocuments({
      org_id: orgIdString,
    });

    const totalAdmins = await OrgAdmin.countDocuments({
      organization: organizationId,
    });

    const totalHeadAdmins = await OrgHeadAdmin.countDocuments({
      organization: organizationId,
    });

    /* -------------------------
       CUSTOMER GROWTH
    ------------------------- */
    const customerGrowth = await OrgUser.aggregate([
      {
        $match: {
          org_id: orgIdString,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    /* -------------------------
       REVENUE GROWTH
    ------------------------- */
    const revenueGrowth = await RechargeTransaction.aggregate([
      {
        $match: {
          org_id: orgIdString,
          status: 'success',
          date: {
            $gte: start.getTime(),
            $lte: end.getTime(),
          },
        },
      },
      {
        $group: {
          _id: {
            month: {
              $month: { $toDate: '$date' },
            },
          },
          total: { $sum: '$price' },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    /* -------------------------
       RESPONSE
    ------------------------- */
    res.status(200).json({
      stats: {
        totalAdmins,
        totalHeadAdmins,
        totalCustomers,
      },
      customerGrowth,
      revenueGrowth,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getDashboardSummary };
