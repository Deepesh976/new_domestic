import OrgUser from '../../models/OrgUser.js';
import OrgPurifier from '../../models/OrgPurifier.js';
import OrgTechnician from '../../models/OrgTechnician.js';
import RechargedPlan from '../../models/RechargedPlan.js';

/* =====================================================
   HEAD ADMIN DASHBOARD — GUARANTEED PIE FIX
===================================================== */
export const getDashboard = async (req, res) => {
  try {
    const org_id = req.user.organization;
    const purifierYear = Number(req.query.purifierYear);
    const planYear = Number(req.query.planYear);

    if (!org_id || !purifierYear || !planYear) {
      return res.status(400).json({ message: 'Missing year params' });
    }

    /* =========================
       STATS
    ========================= */
    const totalCustomers = await OrgUser.countDocuments({ org_id });
    const totalTechnicians = await OrgTechnician.countDocuments({ org_id });

    /* =========================
       PURIFIER CREATION GROWTH
    ========================= */
    const purifierStart = new Date(Date.UTC(purifierYear, 0, 1));
    const purifierEnd = new Date(Date.UTC(purifierYear, 11, 31, 23, 59, 59));

    const purifierRaw = await OrgPurifier.aggregate([
      {
        $match: {
          org_id,
          created_at: { $gte: purifierStart, $lte: purifierEnd },
        },
      },
      {
        $group: {
          _id: { month: { $month: '$created_at' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.month': 1 } },
    ]);

    const purifierGrowth = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(purifierYear, i).toLocaleString('en-IN', {
        month: 'short',
      }),
      purifiers: 0,
    }));

    purifierRaw.forEach((r) => {
      purifierGrowth[r._id.month - 1].purifiers = r.count;
    });

    /* =========================
       🔥 TRENDING PLANS — TRY YEAR FIRST
    ========================= */
    const yearStart = new Date(Date.UTC(planYear, 0, 1));
    const yearEnd = new Date(Date.UTC(planYear, 11, 31, 23, 59, 59));

    const buildPipeline = (match) => [
      { $match: match },

      {
        $lookup: {
          from: 'active_plans',
          let: { pid: '$plan_id', oid: '$org_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$plan_id', '$$pid'] },
                    { $eq: ['$org_id', '$$oid'] },
                  ],
                },
              },
            },
            { $project: { name: 1 } },
          ],
          as: 'plan_info',
        },
      },

      {
        $addFields: {
          plan: {
            $ifNull: [
              { $arrayElemAt: ['$plan_info.name', 0] },
              'Unknown Plan',
            ],
          },
        },
      },

      {
        $group: {
          _id: '$plan',
          count: { $sum: 1 },
          firstUsedOn: { $min: '$createdAt' },
          lastUsedOn: { $max: '$createdAt' },
        },
      },

      {
        $project: {
          _id: 0,
          plan: '$_id',
          count: 1,
          firstUsedOn: 1,
          lastUsedOn: 1,
        },
      },

      { $sort: { count: -1 } },
    ];

    // 1️⃣ Try year filter
    let trendingPlans = await RechargedPlan.aggregate(
      buildPipeline({
        org_id,
        createdAt: { $gte: yearStart, $lte: yearEnd },
      })
    );

    // 2️⃣ Fallback → ALL TIME
    if (trendingPlans.length === 0) {
      trendingPlans = await RechargedPlan.aggregate(
        buildPipeline({ org_id })
      );
    }

    console.log('🥧 FINAL PIE DATA:', trendingPlans);

    return res.json({
      stats: { totalCustomers, totalTechnicians },
      purifierGrowth,
      trendingPlans,
    });
  } catch (error) {
    console.error('❌ DASHBOARD ERROR:', error);
    return res.status(500).json({ message: 'Dashboard failed' });
  }
};
