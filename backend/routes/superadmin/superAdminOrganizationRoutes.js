import express from 'express';

/* ==============================
   CONTROLLERS
============================== */
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} from '../../controllers/superadmin/superAdminOrganizationController.js';

/* ==============================
   MIDDLEWARE
============================== */
import auth from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';

const router = express.Router();

/* ==============================
   PROTECT ALL ROUTES
============================== */
router.use(
  auth,
  roleMiddleware('superadmin') // ✅ lowercase
);

/* ==============================
   ROUTES
============================== */

// CREATE organization
router.post('/', createOrganization);

// GET all organizations
router.get('/', getOrganizations);

// GET single organization by ID
router.get('/:id', getOrganizationById);

// UPDATE organization
router.put('/:id', updateOrganization);

// DELETE organization
router.delete('/:id', deleteOrganization);

export default router;
