import DailyPurifierLog from '../../models/DailyPurifierLog.js';

/* =========================
   GET PURIFIER HISTORY
========================= */
export const getPurifierHistory = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { from, to } = req.query;

    const query = {
      'metadata.device_id': deviceId,
      'metadata.org_id': req.user.org_id, // 🔐 org isolation
    };

    // Date filter
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const history = await DailyPurifierLog.find(query)
      .sort({ timestamp: -1 });

    res.status(200).json({ history });
  } catch (error) {
    console.error('Get purifier history error:', error);
    res.status(500).json({
      message: 'Failed to fetch purifier history',
    });
  }
};
