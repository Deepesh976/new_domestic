import express from 'express';
import auth from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';
import {
  getPurifiers,
} from '../../controllers/headadmin/headAdminPurifierController.js';

const router = express.Router();

/* =====================================================
   PURIFIER ROUTES
   - HeadAdmin: full access
   - Admin: read-only access
===================================================== */

/**
 * GET /api/headadmin/purifiers
 *
 * Access:
 *  - headadmin → full access
 *  - admin     → read-only access
 */
router.get(
  '/',
  auth,
  roleMiddleware('headadmin', 'admin'),
  getPurifiers
);

export default router;
