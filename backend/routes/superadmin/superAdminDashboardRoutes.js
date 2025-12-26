import express from 'express';
import { getDashboardStats } from '../../controllers/superadmin/superAdminDashboardController.js';
import auth from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';

const router = express.Router();

router.use(auth, roleMiddleware('SUPERADMIN'));

router.get('/stats', getDashboardStats);

export default router;
