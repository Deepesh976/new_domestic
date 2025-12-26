const express = require('express');
const router = express.Router();

const {
  getCustomers,
} = require('../../controllers/superadmin/superAdminCustomerController');

const auth = require('../../middleware/auth');
const roleMiddleware = require('../../middleware/roleMiddleware');

router.use(auth, roleMiddleware('SUPERADMIN'));

// VIEW ONLY
router.get('/', getCustomers);

module.exports = router;
