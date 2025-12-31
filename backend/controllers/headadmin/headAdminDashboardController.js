import OrgUser from '../../models/OrgUser.js';
import Device from '../../models/Device.js';
import Plan from '../../models/Plan.js';

export const getDashboard = async (req, res) => {
  try {
    const org_id = req.user.organization;
    const year = Number(req.query.year) || new Date().getFullYear();
    const month = req.query.month; // optional

    /* =========================
       TOP COUNTS
    ========================= */
    const customers = await OrgUser.countDocuments({ org_id });
    const devices = await Device.countDocuments({
      org_id,
      is_active: true,
    });

    /* =========================
       CUSTOMER GROWTH (YEAR)
    ========================= */
    const users = await OrgUser.find(
      {
        org_id,
        createdAt: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
      { createdAt: 1 }
    );

    const monthMap = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(year, i, 1).toLocaleString('en-IN', {
        month: 'short',
      }),
      customers: 0,
    }));

    users.forEach((u) => {
      const m = new Date(u.createdAt).getMonth();
      monthMap[m].customers += 1;
    });

    /* =========================
       TRENDING PLANS (MONTH + YEAR)
    ========================= */
    const planFilter = { org_id };

    if (month) {
      const mIndex = new Date(`${month} 1, ${year}`).getMonth();
      planFilter.created_at = {
        $gte: new Date(year, mIndex, 1),
        $lte: new Date(year, mIndex + 1, 0),
      };
    }

    const plans = await Plan.find(planFilter, { name: 1 });

    const planMap = {};
    plans.forEach((p) => {
      planMap[p.name] = (planMap[p.name] || 0) + 1;
    });

    const trendingPlans = Object.keys(planMap).map((k) => ({
      plan: k,
      count: planMap[k],
    }));

    return res.json({
      customers,
      devices,
      customerGrowth: monthMap,
      trendingPlans,
    });
  } catch (err) {
    console.error('❌ DASHBOARD ERROR:', err);
    res.status(500).json({ message: 'Dashboard failed' });
  }
};
