import mongoose from 'mongoose';

const orgUserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
  },
  { timestamps: true }
);

const OrgUser = mongoose.model('OrgUser', orgUserSchema);
export default OrgUser;
