import express from 'express';
import auth from '../../middleware/auth.js';
import {
  superAdminRegister,
  superAdminLogin,
  changeSuperAdminPassword,
  resetSuperAdminPasswordByEmail,
} from '../../controllers/superadmin/superAdminAuthController.js';

const router = express.Router();

router.post('/register', superAdminRegister);
router.post('/login', superAdminLogin);
router.post('/change-password', auth, changeSuperAdminPassword);
router.post('/reset-password', resetSuperAdminPasswordByEmail);

export default router;
