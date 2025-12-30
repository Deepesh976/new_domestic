import express from 'express';
import {
  getSupport,
  createSupport,
  updateSupport,
  deleteSupport,
} from '../../controllers/headadmin/headAdminSupportController.js';

import authMiddleware from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';

const router = express.Router();

// View (Admin + HeadAdmin)
router.get('/', authMiddleware, getSupport);

// Create
router.post(
  '/',
  authMiddleware,
  roleMiddleware('headadmin'),
  createSupport
);

// Update
router.put(
  '/',
  authMiddleware,
  roleMiddleware('headadmin'),
  updateSupport
);

// Delete
router.delete(
  '/',
  authMiddleware,
  roleMiddleware('headadmin'),
  deleteSupport
);

export default router;
