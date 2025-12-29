import express from 'express';
import auth from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';
import {
  getPurifierHistory,
} from '../../controllers/headadmin/headAdminPurifierHistoryController.js';

const router = express.Router();

router.use(auth, roleMiddleware('headadmin'));

router.get('/:deviceId/history', getPurifierHistory);

export default router;
