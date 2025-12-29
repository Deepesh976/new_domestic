import './utils/axiosConfig';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UnifiedLoginPage from './pages/UnifiedLoginPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

/* =========================
   COMMON
========================= */
import Profile from './pages/Profile';

/* =========================
   SUPER ADMIN
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
   HEAD ADMIN
========================= */
import HeadAdminDashboard from './components/Dashboard/HeadAdminDashboard';
import HeadAdminCustomers from './pages/HeadAdmin/Customers';
import HeadAdminAdmins from './pages/HeadAdmin/Admins';
import HeadAdminCreateAdmin from './pages/HeadAdmin/CreateAdmin';
import HeadAdminEditAdmin from './pages/HeadAdmin/EditAdmin';
import HeadAdminPurifiers from './pages/HeadAdmin/Purifiers';
import HeadAdminAnalysis from './pages/HeadAdmin/Analysis';
import HeadAdminRechargedPlan from './pages/HeadAdmin/RechargedPlan';
import HeadAdminTransactions from './pages/HeadAdmin/Transactions';
import HeadAdminPurifierHistory from './pages/HeadAdmin/PurifierHistory';
import HeadAdminPlans from './pages/HeadAdmin/Plan';
import HeadAdminCreatePlan from './pages/HeadAdmin/CreatePlan';
import HeadAdminEditPlan from './pages/HeadAdmin/EditPlan';

function App() {
  return (
    <Router>
      <Routes>

        <Route
          path="/head-admin/purifiers/:deviceId/history"
          element={
            <ProtectedRoute allowedRoles={['headadmin']}>
              <HeadAdminPurifierHistory />
            </ProtectedRoute>
          }
        />

        {/* =========================
           HEAD ADMIN – PLANS (FINAL)
        ========================= */}
        <Route
          path="/head-admin/plans"
          element={
            <ProtectedRoute allowedRoles={['headadmin']}>
              <HeadAdminPlans />
            </ProtectedRoute>
          }
        />

        <Route
          path="/head-admin/plans/create"
          element={
            <ProtectedRoute allowedRoles={['headadmin']}>
              <HeadAdminCreatePlan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/head-admin/plans/:planId/edit"
          element={
            <ProtectedRoute allowedRoles={['headadmin']}>
              <HeadAdminEditPlan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/head-admin/transactions"
          element={
            <ProtectedRoute allowedRoles={['headadmin']}>
              <HeadAdminTransactions />
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
