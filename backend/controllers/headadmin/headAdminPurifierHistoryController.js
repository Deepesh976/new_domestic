import DailyPurifierLog from '../../models/DailyPurifierLog.js';

/* =====================================================
   GET PURIFIER HISTORY (ADMIN + HEADADMIN)
===================================================== */
export const getPurifierHistory = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const orgId = req.user.organization;

    if (!orgId) {
      return res.status(401).json({
        message: 'Organization missing in token',
      });
    }

    const history = await DailyPurifierLog.find({
      'metadata.device_id': deviceId,
      'metadata.org_id': orgId,
    })
      .sort({ timestamp: -1 })
      .limit(500);

    return res.status(200).json({
      device_id: deviceId,
      history,
    });
  } catch (error) {
    console.error('❌ Purifier history error:', error);
    return res.status(500).json({
      message: 'Failed to fetch purifier history',
    });
  }
};
