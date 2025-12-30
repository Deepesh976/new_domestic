import './utils/axiosConfig';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UnifiedLoginPage from './pages/UnifiedLoginPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

/* COMMON */
import Profile from './pages/Profile';

/* SUPER ADMIN */
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

/* HEAD ADMIN */
import HeadAdminDashboard from './components/Dashboard/HeadAdminDashboard';
import HeadAdminCustomers from './pages/HeadAdmin/Customers';
import HeadAdminAdmins from './pages/HeadAdmin/Admins';
import HeadAdminCreateAdmin from './pages/HeadAdmin/CreateAdmin';
import HeadAdminEditAdmin from './pages/HeadAdmin/EditAdmin';
import HeadAdminPurifiers from './pages/HeadAdmin/Purifiers';
import HeadAdminPurifierHistory from './pages/HeadAdmin/PurifierHistory';
import HeadAdminAnalysis from './pages/HeadAdmin/Analysis';
import HeadAdminRechargedPlan from './pages/HeadAdmin/RechargedPlan';
import HeadAdminTransactions from './pages/HeadAdmin/Transactions';
import HeadAdminPlans from './pages/HeadAdmin/Plan';
import HeadAdminCreatePlan from './pages/HeadAdmin/CreatePlan';
import HeadAdminEditPlan from './pages/HeadAdmin/EditPlan';
import HeadAdminOrders from './pages/HeadAdmin/Order';
import HeadAdminTechnicians from './pages/HeadAdmin/Technician';
import HeadAdminInstallationOrder from './pages/HeadAdmin/InstallationOrder';
import HeadAdminServiceRequest from './pages/HeadAdmin/ServiceRequest';
import HeadAdminSupport from './pages/HeadAdmin/Support';

function App() {
  return (
    <Router>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<UnifiedLoginPage />} />

        {/* SUPER ADMIN */}
        <Route path="/super-admin" element={<ProtectedRoute allowedRoles={['superadmin']}><SuperAdminDashboard /></ProtectedRoute>} />
        <Route path="/super-admin/organizations" element={<ProtectedRoute allowedRoles={['superadmin']}><SuperAdminOrg /></ProtectedRoute>} />
        <Route path="/super-admin/organizations/create" element={<ProtectedRoute allowedRoles={['superadmin']}><CreateOrganization /></ProtectedRoute>} />
        <Route path="/super-admin/organizations/:id/edit" element={<ProtectedRoute allowedRoles={['superadmin']}><EditOrganization /></ProtectedRoute>} />
        <Route path="/super-admin/admins" element={<ProtectedRoute allowedRoles={['superadmin']}><AdminInfo /></ProtectedRoute>} />
        <Route path="/super-admin/admins/create" element={<ProtectedRoute allowedRoles={['superadmin']}><CreateAdmin /></ProtectedRoute>} />
        <Route path="/super-admin/admins/:id/edit" element={<ProtectedRoute allowedRoles={['superadmin']}><EditAdmin /></ProtectedRoute>} />
        <Route path="/super-admin/customers" element={<ProtectedRoute allowedRoles={['superadmin']}><Customer /></ProtectedRoute>} />
        <Route path="/super-admin/customers/:id" element={<ProtectedRoute allowedRoles={['superadmin']}><SuperAdminCustomerInfo /></ProtectedRoute>} />
        <Route path="/super-admin/devices" element={<ProtectedRoute allowedRoles={['superadmin']}><Device /></ProtectedRoute>} />
        <Route path="/super-admin/devices/add" element={<ProtectedRoute allowedRoles={['superadmin']}><AddDevice /></ProtectedRoute>} />
        <Route path="/super-admin/transactions" element={<ProtectedRoute allowedRoles={['superadmin']}><Transaction /></ProtectedRoute>} />

        {/* HEAD ADMIN */}
        <Route path="/head-admin" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminDashboard /></ProtectedRoute>} />
        <Route path="/head-admin/customers" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminCustomers /></ProtectedRoute>} />
        <Route path="/head-admin/admins" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminAdmins /></ProtectedRoute>} />
        <Route path="/head-admin/admins/create" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminCreateAdmin /></ProtectedRoute>} />
        <Route path="/head-admin/admins/:id/edit" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminEditAdmin /></ProtectedRoute>} />
        <Route path="/head-admin/purifiers" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminPurifiers /></ProtectedRoute>} />
        <Route path="/head-admin/purifiers/:deviceId/history" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminPurifierHistory /></ProtectedRoute>} />
        <Route path="/head-admin/analysis" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminAnalysis /></ProtectedRoute>} />
        <Route path="/head-admin/recharged-plans" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminRechargedPlan /></ProtectedRoute>} />
        <Route path="/head-admin/transactions" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminTransactions /></ProtectedRoute>} />
        <Route path="/head-admin/plans" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminPlans /></ProtectedRoute>} />
        <Route path="/head-admin/plans/create" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminCreatePlan /></ProtectedRoute>} />
        <Route path="/head-admin/plans/:planId/edit" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminEditPlan /></ProtectedRoute>} />
        <Route path="/head-admin/orders" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminOrders /></ProtectedRoute>} />
        <Route path="/head-admin/technicians" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminTechnicians /></ProtectedRoute>} />
        <Route path="/head-admin/installations" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminInstallationOrder /></ProtectedRoute>} />
        <Route path="/head-admin/support" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminSupport /></ProtectedRoute>} />
        <Route path="/head-admin/service-requests" element={<ProtectedRoute allowedRoles={['headadmin']}><HeadAdminServiceRequest /></ProtectedRoute>} />

        {/* COMMON */}
        <Route path="/profile" element={<ProtectedRoute allowedRoles={['superadmin','headadmin']}><Profile /></ProtectedRoute>} />

        {/* FALLBACK */}
        <Route path="*" element={<UnifiedLoginPage />} />

      </Routes>
    </Router>
  );
}

export default App;
