import mongoose from 'mongoose';

const InstallationOrderSchema = new mongoose.Schema(
  {
    /* =========================
       ORGANIZATION SCOPING
    ========================= */
    org_id: {
      type: String,
      required: true,
      index: true,
    },

    /* =========================
       CUSTOMER & ORDER IDENTIFIERS
    ========================= */
    user_id: {
      type: String,
      required: true,
      index: true,
    },

    order_id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    plan_id: {
      type: String,
    },

    device_id: {
      type: String,
    },

    txn_id: {
      type: String,
      index: true,
    },

    /* =========================
       PAYMENT (FUTURE SAFE)
       - Not used currently
       - Kept for migration later
    ========================= */
    payment_received: {
      type: Boolean,
      default: false,
      index: true,
    },

    /* =========================
       DELIVERY / INSTALLATION ADDRESS
    ========================= */
    delivery_address: {
      house_flat_no: String,
      street: String,
      area: String,
      district: String,
      state: String,
      postal_code: String,
      country: String,
    },

    /* =========================
       KYC SNAPSHOT (OPTIONAL)
    ========================= */
    kyc_details: {
      type: {
        type: String,
      },
      document: {
        type: String,
      },
    },

    /* =========================
       ORDER STATUS
    ========================= */
    status: {
      type: String,
      enum: ['open', 'assigned', 'completed', 'cancelled'],
      default: 'open',
      index: true,
    },

    /* =========================
       STAGES (SYSTEM CONTROLLED)
       🔥 SOURCE OF TRUTH (CURRENT)
    ========================= */
    stages: {
      payment_received: {
        type: Boolean,
        default: false,
        index: true,
      },

      kyc_verified: {
        type: Boolean,
        default: false,
        index: true,
      },

      technician_assigned: {
        type: Boolean,
        default: false,
      },

      installation_completed: {
        type: Boolean,
        default: false,
      },
    },

    /* =========================
       TECHNICIAN ASSIGNMENT
    ========================= */
    technician_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'org_technicians',
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   COMPOUND INDEXES
========================= */
InstallationOrderSchema.index({
  org_id: 1,
  user_id: 1,
});

InstallationOrderSchema.index({
  org_id: 1,
  'stages.payment_received': 1,
  'stages.kyc_verified': 1,
});

/* =========================
   OPTIONAL VIRTUAL (SAFE)
   - Frontend can use payment_received
========================= */
InstallationOrderSchema.virtual('payment_received_ui').get(function () {
  return this.stages?.payment_received === true;
});

InstallationOrderSchema.set('toJSON', { virtuals: true });
InstallationOrderSchema.set('toObject', { virtuals: true });

export default mongoose.model(
  'installation_orders',
  InstallationOrderSchema
);
