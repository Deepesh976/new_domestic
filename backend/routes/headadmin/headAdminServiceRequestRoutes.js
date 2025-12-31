import express from 'express';
import auth from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';

import {
  getServiceRequests,
  getAvailableTechnicians,
  assignTechnicianToRequest,
  updateServiceStatus,
} from '../../controllers/headadmin/headAdminServiceRequestController.js';

const router = express.Router();

/* =====================================================
   SERVICE REQUEST ROUTES
   Rules:
   - HeadAdmin: full access
   - Admin: read-only access
===================================================== */

/**
 * GET /api/headadmin/service-requests
 *
 * Access:
 *  - headadmin → full access
 *  - admin     → read-only access
 *
 * Features:
 *  - Search (device_id / customer name)
 *  - Filter by status
 */
router.get(
  '/',
  auth,
  roleMiddleware('headadmin', 'admin'),
  getServiceRequests
);

/**
 * GET /api/headadmin/service-requests/technicians/available
 *
 * Access:
 *  - headadmin only
 */
router.get(
  '/technicians/available',
  auth,
  roleMiddleware('headadmin'),
  getAvailableTechnicians
);

/**
 * PATCH /api/headadmin/service-requests/:id/assign
 *
 * Access:
 *  - headadmin only
 *
 * Effect:
 *  - Technician status → busy
 *  - Service request → assigned
 */
router.patch(
  '/:id/assign',
  auth,
  roleMiddleware('headadmin'),
  assignTechnicianToRequest
);

/**
 * PATCH /api/headadmin/service-requests/:id/status
 *
 * Access:
 *  - headadmin only
 *
 * Effect:
 *  - Status transitions:
 *      open → assigned → completed → closed
 *  - Frees technician when request is closed
 */
router.patch(
  '/:id/status',
  auth,
  roleMiddleware('headadmin'),
  updateServiceStatus
);

export default router;
