import express from 'express';
import {
  superAdminRegister,
  superAdminLogin,
} from '../../controllers/superadmin/superAdminAuthController.js';

const router = express.Router();

/* =========================
   SUPER ADMIN AUTH (PUBLIC)
========================= */
router.post('/register', superAdminRegister);
router.post('/login', superAdminLogin);

export default router;
