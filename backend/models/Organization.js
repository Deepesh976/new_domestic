import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema(
  {
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      trim: true,
    },

    gstNumber: {
      type: String,
      trim: true,
    },

    emailId: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    phoneNumber: {
      type: String,
      trim: true,
    },

    pincode: {
      type: String,
      trim: true,
    },

    building: {
      type: String,
      trim: true,
    },

    area: {
      type: String,
      trim: true,
    },

    district: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      default: 'India',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Organization = mongoose.model('Organization', OrganizationSchema);

export default Organization;
