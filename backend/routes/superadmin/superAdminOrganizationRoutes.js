const express = require('express');
const router = express.Router();

/* ==============================
   CONTROLLERS
============================== */
const {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
} = require('../../controllers/superadmin/superAdminOrganizationController');

/* ==============================
   MIDDLEWARE
============================== */
const auth = require('../../middleware/auth');
const roleMiddleware = require('../../middleware/roleMiddleware');

/* ==============================
   PROTECT ALL ROUTES
============================== */
router.use(auth, roleMiddleware('SUPERADMIN'));

/* ==============================
   ROUTES (NO LOGO)
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

module.exports = router;
