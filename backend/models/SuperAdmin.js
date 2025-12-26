const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      default: 'SUPERADMIN',
    },
  },
  {
    timestamps: true,
    collection: 'super_admins', // 🔥 VERY IMPORTANT
  }
);

module.exports = mongoose.model('SuperAdmin', superAdminSchema);
