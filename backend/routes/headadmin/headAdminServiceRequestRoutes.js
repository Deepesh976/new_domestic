import express from 'express';
import authMiddleware from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';

import {
  getServiceRequests,
  getAvailableTechnicians,
  assignTechnicianToRequest,
  updateServiceStatus,
} from '../../controllers/headadmin/headAdminServiceRequestController.js';

const router = express.Router();

/* =====================================================
   SERVICE REQUESTS – HEAD ADMIN
===================================================== */

/* =========================
   GET SERVICE REQUESTS
   - Search (device id / user name)
   - Filter by status
========================= */
router.get(
  '/',
  authMiddleware,
  roleMiddleware('headadmin'),
  getServiceRequests
);

/* =========================
   GET AVAILABLE TECHNICIANS
   - Only status: available
========================= */
router.get(
  '/technicians/available',
  authMiddleware,
  roleMiddleware('headadmin'),
  getAvailableTechnicians
);

/* =========================
   ASSIGN TECHNICIAN
   - Marks technician busy
   - Status → assigned
========================= */
router.patch(
  '/:id/assign',
  authMiddleware,
  roleMiddleware('headadmin'),
  assignTechnicianToRequest
);

/* =========================
   UPDATE SERVICE STATUS
   - open / assigned / completed / closed
   - Frees technician when closed
========================= */
router.patch(
  '/:id/status',
  authMiddleware,
  roleMiddleware('headadmin'),
  updateServiceStatus
);

export default router;
