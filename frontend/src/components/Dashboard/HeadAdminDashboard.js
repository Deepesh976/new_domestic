import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import HeadAdminNavbar from '../Navbar/HeadAdminNavbar';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import './HeadAdminDashboard.css';

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626'];
const YEARS = [2024, 2025, 2026];
const MONTHS = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec'
];

export default function HeadAdminDashboard() {
  const [stats, setStats] = useState({ customers: 0, devices: 0 });
  const [customerGrowth, setCustomerGrowth] = useState([]);
  const [trendingPlans, setTrendingPlans] = useState([]);

  const [year, setYear] = useState(new Date().getFullYear());
  const [planYear, setPlanYear] = useState(new Date().getFullYear());
  const [planMonth, setPlanMonth] = useState('');

  const loadDashboard = async () => {
    const res = await axios.get('/api/headadmin/dashboard', {
      params: { year, month: planMonth, year: planYear },
    });

    setStats({
      customers: res.data.customers,
      devices: res.data.devices,
    });
    setCustomerGrowth(res.data.customerGrowth || []);
    setTrendingPlans(res.data.trendingPlans || []);
  };

  useEffect(() => {
    loadDashboard();
  }, [year, planYear, planMonth]);

  return (
    <HeadAdminNavbar>
      <div className="head-admin-dashboard-page">
        <h1 className="head-admin-dashboard-title">Dashboard</h1>

        {/* STATS */}
        <div className="head-admin-dashboard-stats">
          <div className="head-admin-stat-card">
            <div className="head-admin-stat-value">{stats.customers}</div>
            <p>Total Customers</p>
          </div>
          <div className="head-admin-stat-card">
            <div className="head-admin-stat-value">{stats.devices}</div>
            <p>Active Devices</p>
          </div>
        </div>

        {/* CHARTS */}
        <div className="head-admin-dashboard-charts">

          {/* CUSTOMER GROWTH */}
          <div className="head-admin-chart-card">
            <div className="chart-header">
              <h3>Customer Growth</h3>
              <select value={year} onChange={(e) => setYear(e.target.value)}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={customerGrowth}>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="customers" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* TRENDING PLANS */}
          <div className="head-admin-chart-card">
            <div className="chart-header">
              <h3>Trending Plans</h3>
              <div>
                <select onChange={(e) => setPlanMonth(e.target.value)}>
                  <option value="">All Months</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>

                <select onChange={(e) => setPlanYear(e.target.value)}>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {trendingPlans.length === 0 ? (
              <p className="empty-text">No plan data available</p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={trendingPlans}
                    dataKey="count"
                    nameKey="plan"
                    outerRadius={90}
                    label
                  >
                    {trendingPlans.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </HeadAdminNavbar>
  );
}
