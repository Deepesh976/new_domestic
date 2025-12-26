const express = require('express');
const router = express.Router();

const {
  createDevice,
  getDevices,
} = require('../../controllers/superadmin/superAdminDeviceController');

const auth = require('../../middleware/auth');
const roleMiddleware = require('../../middleware/roleMiddleware');

router.use(auth, roleMiddleware('SUPERADMIN'));

router.post('/', createDevice);
router.get('/', getDevices);

module.exports = router;
