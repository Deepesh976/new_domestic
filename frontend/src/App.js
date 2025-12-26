import './utils/axiosConfig';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UnifiedLoginPage from './pages/UnifiedLoginPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

/* =========================
   COMMON
========================= */
import Profile from './pages/Profile';

/* =========================
   SUPER ADMIN PAGES
========================= */
import SuperAdminDashboard from './components/Dashboard/SuperAdminDashboard';
import SuperAdminOrg from './pages/SuperAdmin/SuperAdminOrg';
import CreateOrganization from './pages/SuperAdmin/CreateOrganization';
import EditOrganization from './pages/SuperAdmin/EditOrganization';

import AdminInfo from './pages/SuperAdmin/AdminInfo';
import CreateAdmin from './pages/SuperAdmin/CreateAdmin';
import EditAdmin from './pages/SuperAdmin/EditAdmin';

import Customer from './pages/SuperAdmin/Customer';
import Transaction from './pages/SuperAdmin/Transaction';

import Device from './pages/SuperAdmin/Device';
import AddDevice from './pages/SuperAdmin/AddDevice';

import SuperAdminCustomerInfo from './pages/SuperAdmin/SuperAdminCustomerInfo';

/* =========================
   HEAD ADMIN PAGES
========================= */
import HeadAdminDashboard from './components/Dashboard/HeadAdminDashboard';
import Admins from './pages/Headadmin/Admins';

function App() {
  return (
    <Router>
      <Routes>
        {/* =========================
           PUBLIC ROUTES
        ========================= */}
        <Route path="/" element={<UnifiedLoginPage />} />
        <Route path="/login" element={<UnifiedLoginPage />} />

        {/* =========================
           SUPER ADMIN ROUTES
        ========================= */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/profile"
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ORGANIZATIONS */}
        <Route
          path="/super-admin/org"
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <SuperAdminOrg />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/create-organization"
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <CreateOrganization />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/edit-organization/:organizationId"
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <EditOrganization />
            </ProtectedRoute>
          }
        />

        {/* ADMINS */}
        <Route
          path="/super-admin/adminInfo"
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <AdminInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/createAdmin"
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <CreateAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/edit-admin/:adminId"
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <EditAdmin />
            </ProtectedRoute>
          }
        />

        {/* DEVICES */}
        <Route
          path="/super-admin/device"
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <Device />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/addDevice"
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <AddDevice />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMERS */}
        <Route
          path="/super-admin/customer"
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <Customer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/customerInfo"
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <SuperAdminCustomerInfo />
            </ProtectedRoute>
          }
        />

        {/* TRANSACTIONS */}
        <Route
          path="/super-admin/transaction"
          element={
            <ProtectedRoute allowedRoles={['SUPERADMIN']}>
              <Transaction />
            </ProtectedRoute>
          }
        />

        {/* =========================
           HEAD ADMIN ROUTES
        ========================= */}
        <Route
          path="/head-admin"
          element={
            <ProtectedRoute allowedRoles={['HEADADMIN']}>
              <HeadAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/head-admin/admins"
          element={
            <ProtectedRoute allowedRoles={['HEADADMIN']}>
              <Admins />
            </ProtectedRoute>
          }
        />

        <Route
          path="/head-admin/profile"
          element={
            <ProtectedRoute allowedRoles={['HEADADMIN']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* =========================
           FALLBACK
        ========================= */}
        <Route path="*" element={<UnifiedLoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
