import mongoose from 'mongoose';

const orgUserSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      index: true,
    },

    org_id: {
      type: String, // e.g. "org_001"
      index: true,
    },

    email_address: {
      type: String,
      lowercase: true,
      trim: true,
    },

    phone_number: {
      type: String,
      trim: true,
    },

    user_name: {
      first_name: String,
      last_name: String,
    },

    address: {
      line: String,
      street: String,
      area: String,
      city: String,
      state: String,
      postal_code: Number,
      country: String,
    },

    is_active: {
      type: Boolean,
      default: false,
    },

    kyc_details: {
      type: Object,
      default: null,
    },

    kyc_approval_status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
    },

    user_device_status: {
      type: String,
      enum: ['linked', 'unlinked', 'delinked'],
    },
  },
  {
    timestamps: true,
    collection: 'org_users', // 🔥🔥🔥 THIS IS THE KEY FIX
  }
);

const OrgUser = mongoose.model('OrgUser', orgUserSchema);

export default OrgUser;
