import express from 'express';
import { headAdminLogin } from '../../controllers/headadmin/headAdminAuthController.js';

const router = express.Router();

router.post('/login', headAdminLogin);

export default router;
