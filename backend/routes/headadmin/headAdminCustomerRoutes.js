import express from 'express';
import auth from '../../middleware/auth.js';
import role from '../../middleware/roleMiddleware.js';

import {
  getCustomers,
  updateKycStatus,
  updateDeviceStatus,
} from '../../controllers/headadmin/headAdminCustomerController.js';

const router = express.Router();

router.get('/', auth, role('headadmin'), getCustomers);

router.patch('/:id/kyc', auth, role('headadmin'), updateKycStatus);

router.patch(
  '/:id/device-status',
  auth,
  role('headadmin'),
  updateDeviceStatus
);

export default router;
