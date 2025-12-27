import mongoose from 'mongoose';

const orgHeadAdminSchema = new mongoose.Schema(
  {
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
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
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
       ORGANIZATION LINK
    ========================= */
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },

    /* =========================
       ROLE (RBAC SAFE)
    ========================= */
    role: {
      type: String,
      default: 'headadmin', // 🔥 lowercase only
      enum: ['headadmin'],
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   INDEXES
========================= */
orgHeadAdminSchema.index({ email: 1 }, { unique: true });

/* =========================
   MODEL EXPORT (ESM)
========================= */
const OrgHeadAdmin = mongoose.model('org_head_admins', orgHeadAdminSchema);

export default OrgHeadAdmin;
