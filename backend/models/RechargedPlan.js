import mongoose from 'mongoose';

const RechargedPlanSchema = new mongoose.Schema(
  {
    org_id: String,
    device_id: String,
    user_id: String,
    plan_id: String,
    txn_id: String,
    limit: Number,
    validity: String,
    status: String,
    ack: Boolean,
  },
  {
    timestamps: true, // gives createdAt
    collection: 'recharged_plans', // 🔥 VERY IMPORTANT
  }
);

export default mongoose.model('RechargedPlan', RechargedPlanSchema);
