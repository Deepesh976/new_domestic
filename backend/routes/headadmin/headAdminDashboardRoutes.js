import express from 'express';
import auth from '../../middleware/auth.js';
import role from '../../middleware/roleMiddleware.js';
import { getDashboard } from '../../controllers/headadmin/headAdminDashboardController.js';

const router = express.Router();

router.get(
  '/',
  auth,
  role('headadmin'),
  getDashboard
);

export default router;
