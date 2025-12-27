import express from 'express';
import auth from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';
import {
  createDevice,
  getDevices,
} from '../../controllers/superadmin/superAdminDeviceController.js';

const router = express.Router();

// 🔐 SuperAdmin only
router.use(
  auth,
  roleMiddleware('superadmin') // ✅ lowercase
);

// CREATE DEVICE
router.post('/', createDevice);

// GET ALL DEVICES
router.get('/', getDevices);

export default router;
