const mongoose = require('mongoose');

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
      type: String, // we store QR text, frontend will generate image
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Device', deviceSchema);
