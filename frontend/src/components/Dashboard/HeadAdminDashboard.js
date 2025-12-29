import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import HeadAdminNavbar from '../Navbar/HeadAdminNavbar';
import './HeadAdminDashboard.css';

const HeadAdminDashboard = () => {
  const [data, setData] = useState({
    customers: 0,
    devices: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get('/api/headadmin/dashboard')
      .then((res) => {
        setData({
          customers: res.data.customers || 0,
          devices: res.data.devices || 0,
          revenue: res.data.revenue || 0,
        });
      })
      .catch((err) => {
        console.error('Dashboard API error:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <HeadAdminNavbar>
      <div className="head-admin-dashboard-page">
        <div>
          <h1 className="head-admin-dashboard-title">Dashboard</h1>
          <p className="head-admin-dashboard-subtitle">
            Organization Overview
          </p>
        </div>

        {loading ? (
          <div className="head-admin-dashboard-loading">
            <span className="head-admin-loading-spinner"></span>
            <span>Loading dashboard data...</span>
          </div>
        ) : (
          <div className="head-admin-dashboard-stats">
            <div className="head-admin-stat-card">
              <div className="head-admin-stat-icon">👥</div>
              <div className="head-admin-stat-value">{data.customers}</div>
              <p className="head-admin-stat-label">Total Customers</p>
            </div>

            <div className="head-admin-stat-card">
              <div className="head-admin-stat-icon">📱</div>
              <div className="head-admin-stat-value">{data.devices}</div>
              <p className="head-admin-stat-label">Active Devices</p>
            </div>

            <div className="head-admin-stat-card">
              <div className="head-admin-stat-icon">💰</div>
              <div className="head-admin-stat-value">
                ₹ {new Intl.NumberFormat('en-IN').format(data.revenue)}
              </div>
              <p className="head-admin-stat-label">Total Revenue</p>
            </div>
          </div>
        )}
      </div>
    </HeadAdminNavbar>
  );
};

export default HeadAdminDashboard;
