import mongoose from 'mongoose';

const ServiceRequestSchema = new mongoose.Schema(
  {
    /* =========================
       IDENTIFIERS
    ========================= */
    request_id: {
      type: String,
      required: true,
      index: true,
    },

    user_id: {
      type: String,
      index: true,
    },

    org_id: {
      type: String,
      required: true,
      index: true,
    },

    /* =========================
       REQUEST DETAILS
    ========================= */
    request_type: String,
    device_id: String,
    description: String,

    /* =========================
       ASSIGNMENT & TIMELINE
    ========================= */
    assigned_to: {
      type: String, // technician_id (string for now)
      default: '',
    },

    scheduled_at: String,
    arrived_at: String,
    completed_at: String,

    /* =========================
       STATUS
       (stored as string in DB)
    ========================= */
    status: {
      type: String,
      default: 'open',
      index: true,
    },

    /* =========================
       ADDITIONAL INFO
    ========================= */
    replaced_parts: [String],
    completion_images: [String],

    location: {
      street: String,
      area: String,
      city: String,
      state: String,
      postal_code: String,
      address_line: String,
      country: String,
    },

    observations: String,
  },
  {
    timestamps: true,
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
