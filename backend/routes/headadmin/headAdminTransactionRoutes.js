import express from 'express';
import { getRechargeTransactions } from '../../controllers/headadmin/headAdminTransactionController.js';
import authMiddleware from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  roleMiddleware('headadmin'),
  getRechargeTransactions
);

export default router;
