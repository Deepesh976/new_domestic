import mongoose from 'mongoose';

const rechargeTransactionSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrgUser',
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: String,
      enum: ['ONLINE', 'CASH', 'UPI'],
      default: 'ONLINE',
    },
    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'PENDING'],
      default: 'SUCCESS',
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const RechargeTransaction = mongoose.model(
  'RechargeTransaction',
  rechargeTransactionSchema
);

export default RechargeTransaction;
