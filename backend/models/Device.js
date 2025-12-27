import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },

    macId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    qrCode: {
      type: String, // QR payload text
      required: true,
    },
  },
  { timestamps: true }
);

const Device = mongoose.model('Device', deviceSchema);

export default Device;
