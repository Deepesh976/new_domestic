import express from 'express';
import auth from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';
import mongoose from 'mongoose';

import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from '../../controllers/headadmin/headAdminAdminController.js';

const router = express.Router();

/* =====================================================
   ADMIN MANAGEMENT ROUTES
   - HeadAdmin: full access
   - Admin: ❌ NO ACCESS
===================================================== */

/* =========================
   AUTH + ROLE (HEADADMIN ONLY)
========================= */
router.use(auth, roleMiddleware('headadmin'));

/* =========================
   VALIDATE ADMIN ID PARAM
========================= */
const validateAdminId = (req, res, next) => {
  const { adminId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({
      message: 'Invalid admin ID',
    });
  }

  next();
};

/* =========================
   ROUTES
========================= */

/**
 * GET /api/headadmin/admins
 * Access:
 *  - headadmin only
 */
router.get('/', getAdmins);

/**
 * POST /api/headadmin/admins
 * Access:
 *  - headadmin only
 */
router.post('/', createAdmin);

/**
 * PUT /api/headadmin/admins/:adminId
 * Access:
 *  - headadmin only
 */
router.put('/:adminId', validateAdminId, updateAdmin);

/**
 * DELETE /api/headadmin/admins/:adminId
 * Access:
 *  - headadmin only
 */
router.delete('/:adminId', validateAdminId, deleteAdmin);

export default router;
