   import express from 'express';
   import {
   getTechnicians,
   createTechnician,
   updateTechnician,
   } from '../../controllers/headadmin/headAdminTechnicianController.js';

   import authMiddleware from '../../middleware/auth.js';

   const router = express.Router();

   /* =========================
      GET TECHNICIANS
   ========================= */
   router.get('/', authMiddleware, getTechnicians);

   /* =========================
      CREATE TECHNICIAN
   ========================= */
   router.post('/', authMiddleware, createTechnician);

   /* =========================
      UPDATE TECHNICIAN
   ========================= */
   router.put('/:id', authMiddleware, updateTechnician);

   export default router;
