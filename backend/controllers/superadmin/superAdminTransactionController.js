const RechargeTransaction = require('../../models/RechargeTransaction');

/* =====================================================
   GET ALL TRANSACTIONS (READ ONLY)
===================================================== */
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await RechargeTransaction.find()
      .sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
