const express = require('express');
const router = express.Router();

const {
  getTransactions,
} = require('../../controllers/superadmin/superAdminTransactionController');

const auth = require('../../middleware/auth');
const roleMiddleware = require('../../middleware/roleMiddleware');

// Protect all routes
router.use(auth, roleMiddleware('SUPERADMIN'));

// GET transactions (VIEW ONLY)
router.get('/', getTransactions);

module.exports = router;
