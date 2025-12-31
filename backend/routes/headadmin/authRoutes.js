import express from 'express';
import auth from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';

import {
  login,
  changePassword,
} from '../../controllers/headadmin/authController.js';

const router = express.Router();

/* =====================================================
   ADMIN + HEADADMIN AUTH ROUTES
===================================================== */

/* =========================
   LOGIN
   POST /api/headadmin/auth/login
========================= */
router.post('/login', login);

/* =========================
   CHANGE PASSWORD
   POST /api/headadmin/auth/change-password
   - Protected
   - Admin + HeadAdmin
========================= */
router.post(
  '/change-password',
  auth,
  roleMiddleware('headadmin', 'admin'),
  changePassword
);

export default router;
