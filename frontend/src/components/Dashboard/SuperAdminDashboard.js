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
  Legend,
} from 'recharts';
import axios from '../../utils/axiosConfig';
import SuperAdminNavbar from '../../components/Navbar/SuperAdminNavbar';
import './SuperAdminDashboard.css';

/* =========================
   CONSTANTS
========================= */
const MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
];

const YEARS = [2024, 2025, 2026];

/* =========================
   COMPONENT
========================= */
const SuperAdminDashboard = () => {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    totalAdmins: 0,
    totalDevices: 0,
  });

  const [deviceGrowth, setDeviceGrowth] = useState([]);
  const [revenueGrowth, setRevenueGrowth] = useState([]);

  /* =========================
     LOAD ORGANIZATIONS
  ========================= */
  useEffect(() => {
    axios
      .get('/api/superadmin/organizations')
      .then((res) => {
        const orgs = Array.isArray(res.data) ? res.data : [];
        setOrganizations(orgs);
        if (orgs.length > 0) {
          setSelectedOrg(orgs[0]._id);
        }
      })
      .catch(() => setOrganizations([]));
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
          year,
        },
      })
      .then((res) => {
        setStats(res.data?.stats || { totalAdmins: 0, totalDevices: 0 });
        setDeviceGrowth(
          Array.isArray(res.data?.deviceGrowth)
            ? res.data.deviceGrowth
            : []
        );
        setRevenueGrowth(
          Array.isArray(res.data?.revenueGrowth)
            ? res.data.revenueGrowth
            : []
        );
      })
      .finally(() => setLoading(false));
  }, [selectedOrg, year]);

  /* =========================
     NORMALIZE DEVICE DATA
     Month-wise device creation
  ========================= */
  const deviceChartData = useMemo(() => {
    const base = MONTHS.map((m) => ({
      month: m,
      devices: 0,
    }));

    deviceGrowth.forEach((item) => {
      if (!item || typeof item.month !== 'number') return;

      const index = item.month - 1;
      if (index >= 0 && index < 12) {
        base[index].devices = item.count || 0;
      }
    });

    return base;
  }, [deviceGrowth]);

  /* =========================
     NORMALIZE REVENUE DATA
  ========================= */
  const revenueChartData = useMemo(() => {
    const base = MONTHS.map((m) => ({
      month: m,
      revenue: 0,
    }));

    revenueGrowth.forEach((item) => {
      if (!item || typeof item.month !== 'number') return;

      const index = item.month - 1;
      if (index >= 0 && index < 12) {
        base[index].revenue = item.total || 0;
      }
    });

    return base;
  }, [revenueGrowth]);

  /* =========================
     RENDER
  ========================= */
  return (
    <SuperAdminNavbar>
      <div className="dashboard-page">

        {/* HEADER */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>

          <div className="dashboard-filters">
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
            >
              {organizations.map((org) => (
                <option key={org._id} value={org._id}>
                  {org.org_name}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p className="dashboard-loading">Loading...</p>
        ) : (
          <>
            {/* STATS */}
            <div className="dashboard-stats">
              <div className="stat-card">
                <div className="stat-value">{stats.totalAdmins}</div>
                <p>Total Admins</p>
              </div>
              <div className="stat-card">
                <div className="stat-value">{stats.totalDevices}</div>
                <p>Total Devices</p>
              </div>
            </div>

            {/* CHARTS */}
            <div className="dashboard-charts">

              {/* DEVICE GROWTH */}
              <div className="chart-card">
                <h3>Device Creation (Monthly)</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={deviceChartData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="month"
                      label={{
                        value: 'Month',
                        position: 'insideBottom',
                        offset: -8,
                      }}
                    />

                    <YAxis
                      allowDecimals={false}
                      domain={[0, (dataMax) => Math.max(dataMax, 5)]}
                      tickCount={6}
                      label={{
                        value: 'Devices',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                    />

                    <Tooltip />
                    <Legend />

                    <Bar
                      dataKey="devices"
                      name="Devices Created"
                      fill="#2563eb"
                      barSize={40}
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* REVENUE */}
              <div className="chart-card">
                <h3>Revenue</h3>

                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={revenueChartData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      dataKey="month"
                      label={{
                        value: 'Month',
                        position: 'insideBottom',
                        offset: -8,
                      }}
                    />

                    <YAxis
                      domain={[0, (dataMax) => Math.max(dataMax, 200)]}
                      label={{
                        value: 'Revenue (₹)',
                        angle: -90,
                        position: 'insideLeft',
                      }}
                    />

                    <Tooltip />
                    <Legend />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
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
