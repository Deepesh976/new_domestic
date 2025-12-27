import mongoose from 'mongoose';
import Device from '../../models/Device.js';

/* =========================
   CREATE DEVICE
========================= */
const createDevice = async (req, res) => {
  try {
    const { organization, macId, serialNumber } = req.body;

    // ✅ basic validation
    if (!macId || !serialNumber) {
      return res.status(400).json({
        message: 'MAC ID and Serial Number are required',
      });
    }

    // ✅ normalize values
    const normalizedMacId = macId.trim().toUpperCase();
    const normalizedSerial = serialNumber.trim().toUpperCase();

    // ✅ optional org validation
    if (organization && !mongoose.Types.ObjectId.isValid(organization)) {
      return res.status(400).json({
        message: 'Invalid organization ID',
      });
    }

    // ✅ duplicate protection (user-friendly)
    const exists = await Device.findOne({
      $or: [
        { macId: normalizedMacId },
        { serialNumber: normalizedSerial },
      ],
    });

    if (exists) {
      return res.status(409).json({
        message: 'Device with same MAC ID or Serial Number already exists',
      });
    }

    // ✅ QR payload (stable & readable)
    const qrCode = JSON.stringify({
  mac_id: normalizedMacId,
  serial_no: normalizedSerial,
});


    const device = await Device.create({
      organization: organization || null,
      macId: normalizedMacId,
      serialNumber: normalizedSerial,
      qrCode,
    });

    return res.status(201).json({
      message: 'Device created successfully',
      device,
    });
  } catch (error) {
    console.error('❌ Create device error:', error);

    // ✅ Mongo duplicate safety net
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Duplicate MAC ID or Serial Number',
      });
    }

    return res.status(500).json({
      message: 'Failed to create device',
    });
  }
};

/* =========================
   GET ALL DEVICES
========================= */
const getDevices = async (req, res) => {
  try {
    const devices = await Device.find()
      .populate('organization', 'organizationName')
      .sort({ createdAt: -1 });

    return res.status(200).json(devices);
  } catch (error) {
    console.error('❌ Get devices error:', error);
    return res.status(500).json({
      message: 'Failed to fetch devices',
    });
  }
};

export {
  createDevice,
  getDevices,
};
