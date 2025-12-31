import express from 'express';
import auth from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';

import {
  getInstallationOrders,
  assignInstallationTechnician,
  completeInstallation,
} from '../../controllers/headadmin/headAdminInstallationOrderController.js';

const router = express.Router();

/* =====================================================
   INSTALLATION ORDER ROUTES
   Rules:
   - HeadAdmin: full access
   - Admin: read-only access
===================================================== */

/**
 * GET /api/headadmin/installations
 *
 * Access:
 *  - headadmin → full access
 *  - admin     → read-only access
 *
 * Conditions handled in controller:
 *  - payment_received === true
 *  - kyc_verified === true
 */
router.get(
  '/',
  auth,
  roleMiddleware('headadmin', 'admin'),
  getInstallationOrders
);

/**
 * PUT /api/headadmin/installations/:id/assign
 *
 * Access:
 *  - headadmin only
 */
router.put(
  '/:id/assign',
  auth,
  roleMiddleware('headadmin'),
  assignInstallationTechnician
);

/**
 * PUT /api/headadmin/installations/:id/complete
 *
 * Access:
 *  - headadmin only
 *
 * Effect:
 *  - technician status updated (busy → free)
 */
router.put(
  '/:id/complete',
  auth,
  roleMiddleware('headadmin'),
  completeInstallation
);

export default router;
