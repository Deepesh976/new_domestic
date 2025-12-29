import RechargeTransaction from '../../models/RechargeTransaction.js';

/* =========================
   GET RECHARGE TRANSACTIONS
   HeadAdmin only
   Org scoped 🔐
========================= */
export const getRechargeTransactions = async (req, res) => {
  try {
    const { device_id } = req.query;

    const query = {
      org_id: req.user.organization, // 🔐 CRITICAL
      type: 'recharge',
    };

    if (device_id) {
      query.device_id = device_id;
    }

    const transactions = await RechargeTransaction.find(query)
      .sort({ date: -1 });

    return res.json(transactions);
  } catch (err) {
    console.error('❌ RECHARGE TXN ERROR:', err);
    return res.status(500).json({ message: 'Failed to load transactions' });
  }
};
