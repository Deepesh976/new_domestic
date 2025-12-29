import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi';
import './SuperAdminNavbar.css';

const SuperAdminNavbar = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem('email') || 'Admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="navbar-page">
      {/* TOP NAVBAR */}
      <div className="navbar-top">
        <div className="navbar-left">
          <button
            className="navbar-hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Toggle sidebar"
          >
            <FiMenu size={22} />
          </button>
        </div>

        <div className="navbar-center">
          <h1 className="navbar-title">Domesticro</h1>
        </div>

        <div className="navbar-right">
          <button
            className="navbar-profile-btn"
            onClick={() => setProfileOpen(!profileOpen)}
            title="Open profile menu"
          >
            <div className="profile-avatar-icon">
              <FiUser size={14} />
            </div>
            <span>{email.split('@')[0]}</span>
          </button>

          {profileOpen && (
            <div className="navbar-dropdown">
              <button
                className="dropdown-item"
                onClick={() => {
                  navigate('/super-admin/profile');
                  setProfileOpen(false);
                }}
              >
                <FiUser className="dropdown-icon" size={14} />
                <span>Profile</span>
              </button>
              <button
                className="dropdown-item logout"
                onClick={handleLogout}
              >
                <FiLogOut className="dropdown-icon" size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BODY */}
      <div className="navbar-body">
        {/* SIDEBAR */}
        <div className={`navbar-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo">D</div>
            <h2 className="sidebar-title">Domesticro</h2>
          </div>

          <nav className="sidebar-menu">
            <li className="sidebar-menu-item">
              <NavLink
                to="/super-admin"
                end
                className={({ isActive }) =>
                  isActive
                    ? 'sidebar-menu-link active'
                    : 'sidebar-menu-link'
                }
              >
                <span className="sidebar-menu-icon">📊</span>
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li className="sidebar-menu-item">
              <NavLink
                to="/super-admin/org"
                className={({ isActive }) =>
                  isActive
                    ? 'sidebar-menu-link active'
                    : 'sidebar-menu-link'
                }
              >
                <span className="sidebar-menu-icon">🏢</span>
                <span>Organizations</span>
              </NavLink>
            </li>

            <li className="sidebar-menu-item">
              <NavLink
                to="/super-admin/adminInfo"
                className={({ isActive }) =>
                  isActive
                    ? 'sidebar-menu-link active'
                    : 'sidebar-menu-link'
                }
              >
                <span className="sidebar-menu-icon">👤</span>
                <span>Admins</span>
              </NavLink>
            </li>

            <li className="sidebar-menu-item">
              <NavLink
                to="/super-admin/devices"
                className={({ isActive }) =>
                  isActive
                    ? 'sidebar-menu-link active'
                    : 'sidebar-menu-link'
                }
              >
                <span className="sidebar-menu-icon">📱</span>
                <span>Devices</span>
              </NavLink>
            </li>

            <li className="sidebar-menu-item">
              <NavLink
                to="/super-admin/customer"
                className={({ isActive }) =>
                  isActive
                    ? 'sidebar-menu-link active'
                    : 'sidebar-menu-link'
                }
              >
                <span className="sidebar-menu-icon">👥</span>
                <span>Customers</span>
              </NavLink>
            </li>

            <li className="sidebar-menu-item">
              <NavLink
                to="/super-admin/transaction"
                className={({ isActive }) =>
                  isActive
                    ? 'sidebar-menu-link active'
                    : 'sidebar-menu-link'
                }
              >
                <span className="sidebar-menu-icon">💳</span>
                <span>Transactions</span>
              </NavLink>
            </li>
          </nav>
        </div>

        {/* CONTENT */}
        <div className="navbar-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminNavbar;
