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
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/profile"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* ORGANIZATIONS */}
        <Route
          path="/super-admin/org"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminOrg />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/create-organization"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <CreateOrganization />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/edit-organization/:organizationId"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <EditOrganization />
            </ProtectedRoute>
          }
        />

        {/* ADMINS */}
        <Route
          path="/super-admin/adminInfo"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <AdminInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/createAdmin"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <CreateAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/edit-admin/:adminId"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <EditAdmin />
            </ProtectedRoute>
          }
        />

        {/* DEVICES */}
        <Route
          path="/super-admin/device"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <Device />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/addDevice"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <AddDevice />
            </ProtectedRoute>
          }
        />

        {/* CUSTOMERS */}
        <Route
          path="/super-admin/customer"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <Customer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/super-admin/customerInfo"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminCustomerInfo />
            </ProtectedRoute>
          }
        />

        {/* TRANSACTIONS */}
        <Route
          path="/super-admin/transaction"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <Transaction />
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
