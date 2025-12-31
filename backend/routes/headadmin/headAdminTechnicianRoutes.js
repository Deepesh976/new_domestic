import express from 'express';
import auth from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';

import {
  getTechnicians,
  createTechnician,
  updateTechnician,
} from '../../controllers/headadmin/headAdminTechnicianController.js';

const router = express.Router();

/* =====================================================
   TECHNICIAN ROUTES
   - HeadAdmin: full access
   - Admin: read-only access
===================================================== */

/**
 * GET /api/headadmin/technicians
 *
 * Access:
 *  - headadmin → full access
 *  - admin     → read-only access
 */
router.get(
  '/',
  auth,
  roleMiddleware('headadmin', 'admin'),
  getTechnicians
);

/**
 * POST /api/headadmin/technicians
 *
 * Access:
 *  - headadmin only
 */
router.post(
  '/',
  auth,
  roleMiddleware('headadmin'),
  createTechnician
);

/**
 * PUT /api/headadmin/technicians/:id
 *
 * Access:
 *  - headadmin only
 */
router.put(
  '/:id',
  auth,
  roleMiddleware('headadmin'),
  updateTechnician
);

export default router;
