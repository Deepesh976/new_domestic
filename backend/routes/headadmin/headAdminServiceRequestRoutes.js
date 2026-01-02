import express from 'express';
import auth from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';
import serviceImageUpload from '../../middleware/serviceImageUpload.js';

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

/* =========================
   GET SERVICE REQUESTS
   GET /api/headadmin/service-requests
   - Search (device_id / customer name)
   - Filter by status
   Access:
     - headadmin
     - admin (read-only)
========================= */
router.get(
  '/',
  auth,
  roleMiddleware('headadmin', 'admin'),
  getServiceRequests
);

/* =========================
   GET AVAILABLE TECHNICIANS
   GET /api/headadmin/service-requests/technicians/available
   Access:
     - headadmin only
========================= */
router.get(
  '/technicians/available',
  auth,
  roleMiddleware('headadmin'),
  getAvailableTechnicians
);

/* =========================
   ASSIGN TECHNICIAN
   PATCH /api/headadmin/service-requests/:id/assign
   Access:
     - headadmin only
   Effect:
     - Technician → busy
     - Request → assigned
========================= */
router.patch(
  '/:id/assign',
  auth,
  roleMiddleware('headadmin'),
  assignTechnicianToRequest
);

/* =========================
   UPDATE SERVICE STATUS
   PATCH /api/headadmin/service-requests/:id/status
   Access:
     - headadmin only
   Features:
     - Upload completion images
     - Save filenames to MongoDB
     - Free technician on close
========================= */
router.patch(
  '/:id/status',
  auth,
  roleMiddleware('headadmin'),
  serviceImageUpload.array('completion_images', 5), // 🔥 IMPORTANT
  updateServiceStatus
);

export default router;
