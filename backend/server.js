/*************************************************
 *  SERVER ENTRY POINT
 *  Project: Domestic (Superadmin Mode)
 *************************************************/

import dotenv from 'dotenv';
dotenv.config(); // 🔥 MUST be first

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import connectDB from './config/db.js';

// ✅ ROUTES (ES MODULE IMPORTS)
import superAdminAuthRoutes from './routes/superadmin/superAdminAuthRoutes.js';
import superAdminOrganizationRoutes from './routes/superadmin/superAdminOrganizationRoutes.js';
import superAdminAdminRoutes from './routes/superadmin/superAdminAdminRoutes.js';
import superAdminDeviceRoutes from './routes/superadmin/superAdminDeviceRoutes.js';
import superAdminCustomerRoutes from './routes/superadmin/superAdminCustomerRoutes.js';
import superAdminTransactionRoutes from './routes/superadmin/superAdminTransactionRoutes.js';
import superAdminDashboardRoutes from './routes/superadmin/superAdminDashboardRoutes.js';


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
   API ROUTES (SUPERADMIN)
========================= */
app.use('/api/superadmin/auth', superAdminAuthRoutes);
app.use('/api/superadmin/organizations', superAdminOrganizationRoutes);
app.use('/api/superadmin/admins', superAdminAdminRoutes);
app.use('/api/superadmin/devices', superAdminDeviceRoutes);
app.use('/api/superadmin/customers', superAdminCustomerRoutes);
app.use('/api/superadmin/transactions', superAdminTransactionRoutes);
app.use('/api/superadmin/dashboard', superAdminDashboardRoutes);


/* =========================
   HEALTH CHECK
========================= */
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Domestic API running (Superadmin mode)',
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
