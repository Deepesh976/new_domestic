import express from 'express';
import auth from '../../middleware/auth.js';          // 🔥 ADD THIS
import roleMiddleware from '../../middleware/roleMiddleware.js';
import {
  createPlan,
  getActivePlans,
  getArchivedPlans,
  updatePlan,
  deletePlan,
} from '../../controllers/headadmin/headAdminPlanController.js';

const router = express.Router();

/* =========================
   AUTH FIRST (CRITICAL)
========================= */
router.use(auth);

/* =========================
   READ ACCESS
   headadmin + admin
========================= */
router.get(
  '/active',
  roleMiddleware('headadmin', 'admin'),
  getActivePlans
);

router.get(
  '/archived',
  roleMiddleware('headadmin', 'admin'),
  getArchivedPlans
);

/* =========================
   WRITE ACCESS
   headadmin only
========================= */
router.post(
  '/',
  roleMiddleware('headadmin'),
  createPlan
);

router.put(
  '/:id',
  roleMiddleware('headadmin'),
  updatePlan
);

router.delete(
  '/:id',
  roleMiddleware('headadmin'),
  deletePlan
);

export default router;
