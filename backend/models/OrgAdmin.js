import mongoose from 'mongoose';

const orgAdminSchema = new mongoose.Schema(
  {
    /* =========================
       ORGANIZATION LINK
    ========================= */
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization', // ✅ matches Organization model
      required: true,
      index: true,
    },

    org_id: {
      type: String,
      required: true,
      index: true,
   },

    /* =========================
       BASIC INFO
    ========================= */
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },

    password: {
      type: String,
      required: true,
    },

    phoneNo: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    /* =========================
       ROLE (RBAC SAFE)
    ========================= */
    role: {
      type: String,
      enum: ['admin'], // ✅ OrgAdmin can ONLY be admin
      default: 'admin',
    },
  },
  {
    timestamps: true,
    collection: 'org_admins', // 🔥 explicit collection name
  }
);

/* =========================
   INDEXES
========================= */
orgAdminSchema.index({ email: 1 }, { unique: true });

const OrgAdmin = mongoose.model('OrgAdmin', orgAdminSchema);

export default OrgAdmin;
