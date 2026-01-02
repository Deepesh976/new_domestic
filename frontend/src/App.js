import './utils/axiosConfig';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UnifiedLoginPage from './pages/UnifiedLoginPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

/* ================= COMMON ================= */
import Profile from './pages/Profile';
import ResetPassword from './pages/ResetPassword';

/* ================= SUPER ADMIN ================= */
import SuperAdminDashboard from './components/Dashboard/SuperAdminDashboard';
import SuperAdminOrg from './pages/SuperAdmin/SuperAdminOrg';
import CreateOrganization from './pages/SuperAdmin/CreateOrganization';
import EditOrganization from './pages/SuperAdmin/EditOrganization';

import AdminInfo from './pages/SuperAdmin/AdminInfo';
import CreateAdmin from './pages/SuperAdmin/CreateAdmin';
import EditAdmin from './pages/SuperAdmin/EditAdmin';
import SuperAdminAdminKycView from './pages/SuperAdmin/AdminKycView';

import Customer from './pages/SuperAdmin/Customer';
import SuperAdminCustomerInfo from './pages/SuperAdmin/SuperAdminCustomerInfo';

import Device from './pages/SuperAdmin/Device';
import AddDevice from './pages/SuperAdmin/AddDevice';
import Transaction from './pages/SuperAdmin/Transaction';

/* ================= HEAD ADMIN / ADMIN ================= */
import HeadAdminDashboard from './components/Dashboard/HeadAdminDashboard';
import HeadAdminCustomers from './pages/HeadAdmin/Customers';
import CustomerKycView from './pages/HeadAdmin/CustomerKycView';

import HeadAdminAdmins from './pages/HeadAdmin/Admins';
import HeadAdminCreateAdmin from './pages/HeadAdmin/CreateAdmin';
import HeadAdminEditAdmin from './pages/HeadAdmin/EditAdmin';
import HeadAdminAdminKycView from './pages/HeadAdmin/AdminKycView';

import HeadAdminPurifiers from './pages/HeadAdmin/Purifiers';
import HeadAdminPurifierHistory from './pages/HeadAdmin/PurifierHistory';
import HeadAdminRechargedPlan from './pages/HeadAdmin/RechargedPlan';

import HeadAdminAnalysis from './pages/HeadAdmin/Analysis';
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

        {/* ================= AUTH ================= */}
        <Route path="/" element={<UnifiedLoginPage />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= SUPER ADMIN ================= */}
        <Route
          path="/superadmin"
          element={<ProtectedRoute allowedRoles={['superadmin']} />}
        >
          <Route index element={<SuperAdminDashboard />} />

          <Route path="organizations" element={<SuperAdminOrg />} />
          <Route path="organizations/create" element={<CreateOrganization />} />
          <Route path="organizations/:id/edit" element={<EditOrganization />} />

          <Route path="admins" element={<AdminInfo />} />
          <Route path="admins/create" element={<CreateAdmin />} />
          <Route path="admins/:id/edit" element={<EditAdmin />} />
          <Route path="admins/:id/kyc" element={<SuperAdminAdminKycView />} />

          <Route path="customers" element={<Customer />} />
          <Route path="customers/:id" element={<SuperAdminCustomerInfo />} />

          <Route path="devices" element={<Device />} />
          <Route path="devices/add" element={<AddDevice />} />

          <Route path="transactions" element={<Transaction />} />
        </Route>

        {/* ================= HEAD ADMIN ================= */}
        <Route
          path="/headadmin"
          element={<ProtectedRoute allowedRoles={['headadmin', 'admin']} />}
        >
          <Route index element={<HeadAdminDashboard />} />

          <Route path="customers" element={<HeadAdminCustomers />} />
          <Route path="customers/:id/kyc" element={<CustomerKycView />} />

          <Route path="admins" element={<HeadAdminAdmins />} />
          <Route path="admins/create" element={<HeadAdminCreateAdmin />} />
          <Route path="admins/:adminId/edit" element={<HeadAdminEditAdmin />} />
          <Route path="admins/:adminId/kyc" element={<HeadAdminAdminKycView />} />

          <Route path="purifiers" element={<HeadAdminPurifiers />} />
          <Route path="purifiers/:deviceId/history" element={<HeadAdminPurifierHistory />} />
          <Route path="purifiers/:deviceId/recharged-plan" element={<HeadAdminRechargedPlan />} />

          <Route path="plans" element={<HeadAdminPlans />} />
          <Route path="plans/create" element={<HeadAdminCreatePlan />} />
          <Route path="plans/:planId/edit" element={<HeadAdminEditPlan />} />

          <Route path="transactions" element={<HeadAdminTransactions />} />

          <Route path="orders" element={<HeadAdminOrders />} />
          <Route path="technicians" element={<HeadAdminTechnicians />} />
          <Route path="installations" element={<HeadAdminInstallationOrder />} />
          <Route path="service-requests" element={<HeadAdminServiceRequest />} />
          <Route path="support" element={<HeadAdminSupport />} />

          <Route path="analysis" element={<HeadAdminAnalysis />} />
        </Route>

        {/* ================= PROFILE ================= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'headadmin', 'admin']} />
          }
        >
          <Route index element={<Profile />} />
        </Route>

        <Route path="*" element={<UnifiedLoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
