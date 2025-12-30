import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';
import {
  getServiceRequests,
} from '../../controllers/headadmin/headAdminServiceRequestController.js';

const router = express.Router();

/* =========================
   GET SERVICE REQUESTS
========================= */
router.get(
  '/',
  authMiddleware,
  roleMiddleware('headadmin'),
  getServiceRequests
);

export default router;
