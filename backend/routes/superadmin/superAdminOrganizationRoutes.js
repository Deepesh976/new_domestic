import express from 'express';
import auth from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from '../../controllers/superadmin/superAdminOrganizationController.js';

const router = express.Router();

/* =====================================================
   SUPERADMIN PROTECTION
===================================================== */
router.use(auth, roleMiddleware('superadmin')); // ✅ lowercase (matches auth.js)

/* =====================================================
   ROUTES
===================================================== */
router.post('/', createOrganization);
router.get('/', getOrganizations);
router.get('/:id', getOrganizationById);
router.put('/:id', updateOrganization);
router.delete('/:id', deleteOrganization);

export default router;
