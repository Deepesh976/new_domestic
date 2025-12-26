const express = require('express');
const router = express.Router();

const {
  superAdminRegister,
  superAdminLogin,
} = require('../../controllers/superadmin/superAdminAuthController');

/* PUBLIC ROUTES */
router.post('/register', superAdminRegister);
router.post('/login', superAdminLogin);

module.exports = router;
