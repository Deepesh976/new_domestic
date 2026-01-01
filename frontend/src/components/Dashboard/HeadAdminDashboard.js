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
} from 'recharts';
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
        <h1 className="head-admin-dashboard-title">Dashboard</h1>

        {/* ================= STATS ================= */}
        <div className="head-admin-dashboard-stats">
          <div className="head-admin-stat-card">
            <div className="head-admin-stat-value">
              {stats.totalCustomers}
            </div>
            <p>Total Customers</p>
          </div>

          <div className="head-admin-stat-card">
            <div className="head-admin-stat-value">
              {stats.totalTechnicians}
            </div>
            <p>Total Technicians</p>
          </div>
        </div>

        {/* ================= ERROR ================= */}
        {error && <p className="chart-empty">{error}</p>}

        {/* ================= CHARTS ================= */}
        <div className="head-admin-dashboard-charts">

          {/* ===== PURIFIER CREATION GROWTH ===== */}
          <div className="head-admin-chart-card">
            <div className="chart-header">
              <h3>Purifier Creation Growth</h3>

              <select
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

            {!hasPurifierData ? (
              <p className="chart-empty">
                No purifier data available for {purifierYear}
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={purifierGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="purifiers"
                    fill="#2563eb"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* ===== TRENDING PLANS (PIE) ===== */}
          <div className="head-admin-chart-card">
            <div className="chart-header">
              <h3>Trending Plans</h3>

              <select
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

            {loading ? (
              <p className="chart-empty">Loading plan data…</p>
            ) : !hasTrendingPlans ? (
              <p className="chart-empty">
                No plan data available for {planYear}
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={trendingPlans}
                    dataKey="count"
                    nameKey="plan"
                    outerRadius={90}
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
    </HeadAdminNavbar>
  );
}
