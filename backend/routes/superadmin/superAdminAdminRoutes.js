import express from 'express';
import auth from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';

import {
  createAdmin,
  getAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} from '../../controllers/superadmin/superAdminAdminController.js';

const router = express.Router();

// 🔐 Protect all routes (SuperAdmin only)
router.use(
  auth,
  roleMiddleware('superadmin') // ✅ lowercase
);

// CRUD routes
router.post('/', createAdmin);
router.get('/', getAdmins);
router.get('/:id', getAdminById);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

export default router;
