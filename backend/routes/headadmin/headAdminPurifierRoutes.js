import express from 'express';
import auth from '../../middleware/auth.js';
import roleMiddleware from '../../middleware/roleMiddleware.js';
import {
  getPurifiers,
} from '../../controllers/headadmin/headAdminPurifierController.js';

const router = express.Router();

router.use(auth, roleMiddleware('headadmin'));

router.get('/', getPurifiers);

export default router;
