import OrgPurifier from '../../models/OrgPurifier.js';
import OrgHeadAdmin from '../../models/OrgHeadAdmin.js';
import OrgUser from '../../models/OrgUser.js';

/* =========================
   GET ORG PURIFIERS (WITH USER NAME)
========================= */
export const getPurifiers = async (req, res) => {
  try {
    const headAdmin = await OrgHeadAdmin.findById(req.user.id);

    if (!headAdmin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const purifiers = await OrgPurifier.find({
      org_id: headAdmin.org_id,
    }).sort({ createdAt: -1 });

    // 🔥 Attach user name safely
    const enriched = await Promise.all(
      purifiers.map(async (p) => {
        let userName = null;
        let userDetails = null;

        if (p.user_id) {
          const user = await OrgUser.findOne({
            user_id: p.user_id,       // ✅ STRING MATCH
            org_id: headAdmin.org_id, // ✅ ORG SAFETY
          }).select('-password');

          if (user) {
            userName = `${user.user_name?.first_name || ''} ${user.user_name?.last_name || ''}`.trim();
            userDetails = user;
          }
        }

        return {
          ...p.toObject(),
          user_name: userName,
          user_details: userDetails, // 👈 for popup
        };
      })
    );

    res.status(200).json({ purifiers: enriched });
  } catch (error) {
    console.error('Get purifiers error:', error);
    res.status(500).json({ message: 'Failed to fetch purifiers' });
  }
};
