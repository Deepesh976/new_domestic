import mongoose from 'mongoose';

const RechargeTransactionSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    org_id: { type: String, required: true }, // 🔐 IMPORTANT
    device_id: { type: String, required: true },
    txn_id: { type: String, required: true },
    plan_id: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    payment_gateway: { type: String },
    date: { type: Number }, // epoch millis
    status: { type: String },
    type: { type: String }, // recharge
  },
  { collection: 'recharge_transactions' }
);

export default mongoose.model(
  'RechargeTransaction',
  RechargeTransactionSchema
);
