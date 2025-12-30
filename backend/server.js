/*************************************************
 *  SERVER ENTRY POINT
 *  Project: Domestic
 *************************************************/

import dotenv from 'dotenv';
dotenv.config(); // 🔥 MUST be first

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './config/db.js';

/* =========================
   ROUTES – SUPER ADMIN
========================= */
import superAdminAuthRoutes from './routes/superadmin/superAdminAuthRoutes.js';
import superAdminOrganizationRoutes from './routes/superadmin/superAdminOrganizationRoutes.js';
import superAdminAdminRoutes from './routes/superadmin/superAdminAdminRoutes.js';
import superAdminDeviceRoutes from './routes/superadmin/superAdminDeviceRoutes.js';
import superAdminCustomerRoutes from './routes/superadmin/superAdminCustomerRoutes.js';
import superAdminTransactionRoutes from './routes/superadmin/superAdminTransactionRoutes.js';
import superAdminDashboardRoutes from './routes/superadmin/superAdminDashboardRoutes.js';

/* =========================
   ROUTES – HEAD ADMIN
========================= */
import headAdminAuthRoutes from './routes/headadmin/headAdminAuthRoutes.js';
import headAdminCustomerRoutes from './routes/headadmin/headAdminCustomerRoutes.js';
import headAdminPurifierRoutes from './routes/headadmin/headAdminPurifierRoutes.js';
import headAdminPurifierHistoryRoutes from './routes/headadmin/headAdminPurifierHistoryRoutes.js';
import headAdminTransactionRoutes from './routes/headadmin/headAdminTransactionRoutes.js';
import headAdminDashboardRoutes from './routes/headadmin/headAdminDashboardRoutes.js';
import headAdminAdminRoutes from './routes/headadmin/headAdminAdminRoutes.js';
import headAdminPlanRoutes from './routes/headadmin/headAdminPlanRoutes.js';
import headAdminRechargedPlanRoutes from './routes/headadmin/headAdminRechargedPlanRoutes.js';
import headAdminSupportRoutes from './routes/headadmin/headAdminSupportRoutes.js';
import headAdminTechnicianRoutes from './routes/headadmin/headAdminTechnicianRoutes.js';
import headAdminInstallationOrderRoutes from './routes/headadmin/headAdminInstallationOrderRoutes.js';
import headAdminServiceRequestRoutes from './routes/headadmin/headAdminServiceRequestRoutes.js';

const app = express();

/* =========================
   BASIC VALIDATIONS
========================= */
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET missing in environment variables');
  process.exit(1);
}

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

/* =========================
   DATABASE
========================= */
connectDB();

/* =========================
   API ROUTES – SUPER ADMIN
========================= */
app.use('/api/superadmin/auth', superAdminAuthRoutes);
app.use('/api/superadmin/organizations', superAdminOrganizationRoutes);
app.use('/api/superadmin/admins', superAdminAdminRoutes);
app.use('/api/superadmin/devices', superAdminDeviceRoutes);
app.use('/api/superadmin/customers', superAdminCustomerRoutes);
app.use('/api/superadmin/transactions', superAdminTransactionRoutes);
app.use('/api/superadmin/dashboard', superAdminDashboardRoutes);

/* =========================
   API ROUTES – HEAD ADMIN
========================= */
app.use('/api/headadmin/auth', headAdminAuthRoutes);
app.use('/api/headadmin/customers', headAdminCustomerRoutes);
app.use('/api/headadmin/admins', headAdminAdminRoutes);
app.use('/api/headadmin/purifiers', headAdminPurifierRoutes);
app.use('/api/headadmin/purifiers', headAdminPurifierHistoryRoutes);
app.use('/api/headadmin/transactions', headAdminTransactionRoutes);
app.use('/api/headadmin/dashboard', headAdminDashboardRoutes);
app.use('/api/headadmin/plans', headAdminPlanRoutes);
app.use('/api/headadmin/recharged-plans', headAdminRechargedPlanRoutes);
app.use('/api/headadmin/support', headAdminSupportRoutes);
app.use('/api/headadmin/technicians', headAdminTechnicianRoutes);
app.use('/api/headadmin/installations', headAdminInstallationOrderRoutes);
app.use('/api/headadmin/service-requests', headAdminServiceRequestRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Domestic API running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error('🔥 Global Error:', err);

  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT} | Mode: ${
      process.env.NODE_ENV || 'development'
    }`
  );
});
