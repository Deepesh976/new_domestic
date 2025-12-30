import express from 'express';

import {
  getInstallationOrders,
  assignInstallationTechnician,
  completeInstallation,
} from '../../controllers/headadmin/headAdminInstallationOrderController.js';

import authMiddleware from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';

const router = express.Router();

/* =====================================================
   GET INSTALLATION ORDERS
   - Org scoped
   - payment_received === true
   - kyc_verified === true
===================================================== */
router.get(
  '/',
  authMiddleware,
  roleMiddleware('headadmin'),
  getInstallationOrders
);

/* =====================================================
   ASSIGN TECHNICIAN TO INSTALLATION ORDER
===================================================== */
router.put(
  '/:id/assign',
  authMiddleware,
  roleMiddleware('headadmin'),
  assignInstallationTechnician
);

/* =====================================================
   COMPLETE INSTALLATION ORDER
   - Releases technician (busy → free)
===================================================== */
router.put(
  '/:id/complete',
  authMiddleware,
  roleMiddleware('headadmin'),
  completeInstallation
);

export default router;
