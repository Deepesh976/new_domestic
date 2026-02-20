import React, { useEffect, useMemo, useState } from 'react';
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
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { MdPeople, MdBusiness, MdTrendingUp, MdCheckCircle } from 'react-icons/md';
import './HeadAdminDashboard.css';

/* =========================
   CONSTANTS
========================= */
const YEARS = [2024, 2025, 2026];
const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626'];

/* =========================
   HELPERS
========================= */
const formatIST = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export default function HeadAdminDashboard() {
  /* =========================
     STATE
  ========================= */
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalTechnicians: 0,
  });

  const [purifierGrowth, setPurifierGrowth] = useState([]);
  const [trendingPlans, setTrendingPlans] = useState([]);

  // ✅ INDEPENDENT YEARS
  const [purifierYear, setPurifierYear] = useState(
    new Date().getFullYear()
  );
  const [planYear, setPlanYear] = useState(
    new Date().getFullYear()
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* =========================
     LOAD DASHBOARD
  ========================= */
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await axios.get('/api/headadmin/dashboard', {
        params: {
          purifierYear,
          planYear,
        },
      });

      console.log('📊 DASHBOARD RESPONSE:', res.data);

      setStats({
        totalCustomers: res.data?.stats?.totalCustomers ?? 0,
        totalTechnicians: res.data?.stats?.totalTechnicians ?? 0,
      });

      setPurifierGrowth(
        Array.isArray(res.data?.purifierGrowth)
          ? res.data.purifierGrowth
          : []
      );

      setTrendingPlans(
        Array.isArray(res.data?.trendingPlans)
          ? res.data.trendingPlans
          : []
      );
    } catch (err) {
      console.error('❌ Dashboard load failed:', err);
      setError('Failed to load dashboard');
      setTrendingPlans([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EFFECT
  ========================= */
  useEffect(() => {
    loadDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purifierYear, planYear]);

  /* =========================
     DERIVED STATE
  ========================= */
  const hasPurifierData = useMemo(
    () => purifierGrowth.some((m) => m.purifiers > 0),
    [purifierGrowth]
  );

  const hasTrendingPlans =
    Array.isArray(trendingPlans) && trendingPlans.length > 0;

  /* =========================
     RENDER
  ========================= */
  return (
    <HeadAdminNavbar>
      <div className="head-admin-dashboard-page">
        {/* ================= HEADER ================= */}
        <div className="dashboard-header">
          <div>
            <h1 className="head-admin-dashboard-title">Dashboard</h1>
            <p className="dashboard-subtitle">Welcome back! Here's an overview of your organization</p>
          </div>
          <div className="header-actions">
            <span className="dashboard-date">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="head-admin-dashboard-stats">
          <div className="head-admin-stat-card stat-customers">
            <div className="stat-card-header">
              <MdPeople className="stat-icon" />
              <span className="stat-badge">Active</span>
            </div>
            <div className="head-admin-stat-value">
              {stats.totalCustomers}
            </div>
            <p className="stat-label">Total Customers</p>
            <div className="stat-footer">Increase of 12% this month</div>
          </div>

          <div className="head-admin-stat-card stat-technicians">
            <div className="stat-card-header">
              <MdBusiness className="stat-icon" />
              <span className="stat-badge">Active</span>
            </div>
            <div className="head-admin-stat-value">
              {stats.totalTechnicians}
            </div>
            <p className="stat-label">Total Technicians</p>
            <div className="stat-footer">Ready to serve</div>
          </div>

          <div className="head-admin-stat-card stat-plans">
            <div className="stat-card-header">
              <MdCheckCircle className="stat-icon" />
              <span className="stat-badge">Updated</span>
            </div>
            <div className="head-admin-stat-value">
              {trendingPlans.length > 0 ? trendingPlans.length : '—'}
            </div>
            <p className="stat-label">Active Plans</p>
            <div className="stat-footer">Across all regions</div>
          </div>

          <div className="head-admin-stat-card stat-growth">
            <div className="stat-card-header">
              <MdTrendingUp className="stat-icon" />
              <span className="stat-badge">Growing</span>
            </div>
            <div className="head-admin-stat-value">
              {purifierGrowth.length > 0
                ? purifierGrowth.reduce((sum, m) => sum + (m.purifiers || 0), 0)
                : '0'}
            </div>
            <p className="stat-label">Total Purifiers</p>
            <div className="stat-footer">Year to date</div>
          </div>
        </div>

        {/* ================= ERROR ================= */}
        {error && <div className="dashboard-error">{error}</div>}

        {/* ================= CHARTS ================= */}
        <div className="head-admin-dashboard-charts">

          {/* ===== PURIFIER CREATION GROWTH ===== */}
          <div className="head-admin-chart-card chart-card-large">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Purifier Creation Growth</h3>
                <p className="chart-subtitle">Monthly purifier installations tracking</p>
              </div>

              <select
                className="year-select"
                value={purifierYear}
                onChange={(e) =>
                  setPurifierYear(Number(e.target.value))
                }
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="chart-content">
              {!hasPurifierData ? (
                <p className="chart-empty">
                  No purifier data available for {purifierYear}
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={purifierGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis allowDecimals={false} stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{
                        background: '#ffffff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar
                      dataKey="purifiers"
                      fill="#3b82f6"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ===== TRENDING PLANS (PIE) ===== */}
          <div className="head-admin-chart-card chart-card-large">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Trending Plans Distribution</h3>
                <p className="chart-subtitle">Plan recharges breakdown by type</p>
              </div>

              <select
                className="year-select"
                value={planYear}
                onChange={(e) =>
                  setPlanYear(Number(e.target.value))
                }
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="chart-content">
              {loading ? (
                <p className="chart-empty">Loading plan data…</p>
              ) : !hasTrendingPlans ? (
                <p className="chart-empty">
                  No plan data available for {planYear}
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={trendingPlans}
                      dataKey="count"
                      nameKey="plan"
                      outerRadius={100}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {trendingPlans.map((_, i) => (
                        <Cell
                          key={i}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    {/* ✅ SAFE TOOLTIP */}
                    <Tooltip
                      formatter={(value, name, props) => {
                        const p = props?.payload || {};
                        return [
                          `${value} recharges`,
                          `${p.plan || 'Plan'}
First: ${formatIST(p.firstUsedOn)}
Last: ${formatIST(p.lastUsedOn)}`,
                        ];
                      }}
                    />

                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

        </div>
      </div>
    </HeadAdminNavbar>
  );
}
