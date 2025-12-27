import mongoose from 'mongoose';

const rechargeTransactionSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      index: true,
    },

    org_id: {
      type: String, // e.g. "org_001"
      index: true,
    },

    device_id: {
      type: String,
    },

    txn_id: {
      type: String,
      index: true,
    },

    plan_id: {
      type: String,
    },

    price: {
      type: Number,
    },

    currency: {
      type: String,
      default: 'INR',
    },

    payment_gateway: {
      type: String,
    },

    date: {
      type: Number, // epoch millis
    },

    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
    },

    type: {
      type: String, // recharge
    },
  },
  {
    timestamps: true,
    collection: 'recharge_transactions', // 🔥 MUST MATCH MONGODB
  }
);

const RechargeTransaction = mongoose.model(
  'RechargeTransaction',
  rechargeTransactionSchema
);

export default RechargeTransaction;
