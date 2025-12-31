import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; // ✅ REQUIRED IMPORT

const ServiceRequestSchema = new mongoose.Schema(
  {
    request_id: {
      type: String,
      default: uuidv4, // ✅ UUID v4 auto-generated
      unique: true,
      index: true,
    },

    user_id: {
      type: String, // OrgUser.user_id
      index: true,
    },

    org_id: {
      type: String,
      required: true,
      index: true,
    },

    request_type: String,
    device_id: String,
    description: String,

    assigned_to: {
      type: String, // OrgTechnician _id
      default: null,
    },

    scheduled_at: {
      type: Date,
      default: null,
    },

    arrived_at: {
      type: Date,
      default: null,
    },

    completed_at: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ['open', 'assigned', 'closed'],
      default: 'open',
      index: true,
    },

    replaced_parts: {
      type: [String],
      default: [],
    },

    completion_images: {
      type: [String],
      default: [],
    },

    location: {
      street: String,
      area: String,
      city: String,
      state: String,
      postal_code: String,
      country: String,
    },

    observations: String,
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/* =========================
   INDEXES
========================= */
ServiceRequestSchema.index({ org_id: 1, status: 1 });

export default mongoose.model(
  'service_requests',
  ServiceRequestSchema
);
