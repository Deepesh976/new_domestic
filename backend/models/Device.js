import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
  {
  org_id: {
    type: String,      
    required: true,
    index: true,
  },

    mac_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    serial_number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    qr_code: {
      type: String,
      required: true, // JSON string
    },
  },
  {
    timestamps: true,
    collection: 'devices',
  }
);

const Device = mongoose.model('Device', deviceSchema);
export default Device;
