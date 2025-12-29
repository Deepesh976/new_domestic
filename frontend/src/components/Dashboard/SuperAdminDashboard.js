import React, { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import axios from '../../utils/axiosConfig';
import SuperAdminNavbar from '../../components/Navbar/SuperAdminNavbar';
import './SuperAdminDashboard.css';

const MONTHS = [
  '',
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const SuperAdminDashboard = () => {
  const currentYear = new Date().getFullYear();

  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [loading, setLoading] = useState(false);
  const [orgLoading, setOrgLoading] = useState(true);
  const [orgError, setOrgError] = useState('');

  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalCustomers: 0,
    customerGrowth: [],
    revenue: [],
  });

  /* =========================
     LOAD ORGANIZATIONS
  ========================= */
  useEffect(() => {
    setOrgLoading(true);
    setOrgError('');

    axios
      .get('/api/superadmin/organizations')
      .then((res) => {
        const orgs = Array.isArray(res.data) ? res.data : [];
        setOrganizations(orgs);

        if (orgs.length > 0) {
          setSelectedOrg(orgs[0]._id);
        }
      })
      .catch((err) => {
        setOrgError(
          err.response?.data?.message || 'Failed to load organizations'
        );
      })
      .finally(() => setOrgLoading(false));
  }, []);

  /* =========================
     LOAD DASHBOARD DATA
  ========================= */
  useEffect(() => {
    if (!selectedOrg) return;

    setLoading(true);

    axios
      .get('/api/superadmin/dashboard/summary', {
        params: {
          organizationId: selectedOrg,
          year: selectedYear,
        },
      })
      .then((res) => {
        setStats({
          totalAdmins:
            (res.data.stats?.totalAdmins || 0) +
            (res.data.stats?.totalHeadAdmins || 0),
          totalCustomers: res.data.stats?.totalCustomers || 0,
          customerGrowth: res.data.customerGrowth || [],
          revenue: res.data.revenueGrowth || [],
        });
      })
      .finally(() => setLoading(false));
  }, [selectedOrg, selectedYear]);

  /* =========================
     SELECTED ORG NAME (FIXED)
  ========================= */
  const selectedOrgName = useMemo(() => {
    const org = organizations.find((o) => o._id === selectedOrg);
    return org?.org_name || '';
  }, [selectedOrg, organizations]);

  /* =========================
     CUSTOMER CHART DATA
  ========================= */
  const customerChartData = useMemo(() => {
    const map = {};
    stats.customerGrowth.forEach((i) => {
      map[i._id.month] = i.count;
    });

    return Array.from({ length: 12 }, (_, i) => ({
      month: MONTHS[i + 1],
      customers: map[i + 1] || 0,
    }));
  }, [stats.customerGrowth]);

  /* =========================
     REVENUE CHART DATA
  ========================= */
  const revenueChartData = useMemo(() => {
    const map = {};
    stats.revenue.forEach((i) => {
      map[i._id.month] = i.total;
    });

    return Array.from({ length: 12 }, (_, i) => ({
      month: MONTHS[i + 1],
      revenue: map[i + 1] || 0,
    }));
  }, [stats.revenue]);

  return (
    <SuperAdminNavbar>
      <div className="dashboard-page">
        {/* HEADER */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Dashboard</h1>
            {selectedOrgName && (
              <p className="dashboard-subtitle">
                📊 {selectedOrgName}
              </p>
            )}
          </div>

          {/* FILTERS */}
          <div className="dashboard-filters">
            {orgLoading ? (
              <select className="dashboard-select" disabled>
                <option>Loading organizations...</option>
              </select>
            ) : (
              <>
                <select
                  className="dashboard-select"
                  value={selectedOrg}
                  onChange={(e) => setSelectedOrg(e.target.value)}
                >
                  <option value="">Select Organization</option>
                  {organizations.map((org) => (
                    <option key={org._id} value={org._id}>
                      {org.org_name} ({org.org_id})
                    </option>
                  ))}
                </select>

                <select
                  className="dashboard-select"
                  value={selectedYear}
                  onChange={(e) =>
                    setSelectedYear(Number(e.target.value))
                  }
                >
                  {[currentYear, currentYear - 1, currentYear - 2].map(
                    (y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    )
                  )}
                </select>
              </>
            )}
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="dashboard-loading">Loading...</div>
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-value">{stats.totalAdmins}</div>
                <p>Total Admins & Head Admins</p>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.totalCustomers}</div>
                <p>Total Customers</p>
              </div>
            </div>

            <div className="dashboard-charts">
              <div className="chart-card">
                <h3>Customer Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={customerChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="customers" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      dataKey="revenue"
                      stroke="#16a34a"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </SuperAdminNavbar>
  );
};

export default SuperAdminDashboard;
