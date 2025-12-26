import mongoose from 'mongoose';

const orgHeadAdminSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    role: {
      type: String,
      default: 'HEADADMIN',
    },
  },
  { timestamps: true }
);

const OrgHeadAdmin = mongoose.model(
  'OrgHeadAdmin',
  orgHeadAdminSchema
);

export default OrgHeadAdmin;
