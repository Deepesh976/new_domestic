import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi';
import './HeadAdminNavbar.css';

export default function HeadAdminNavbar({ children }) {
  const [menuOpen, setMenuOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem('email') || 'Admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const closeSidebar = () => {
    setMenuOpen(false);
  };

  return (
    <div className="head-admin-layout">
      {/* =========================
         TOP NAVBAR
      ========================= */}
      <header className="head-admin-navbar">
        <div className="head-admin-navbar-left">
          <button
            className="head-admin-hamburger"
            type="button"
            title="Toggle sidebar"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <FiMenu size={22} />
          </button>
        </div>

        <div className="head-admin-navbar-center">
          <h1 className="head-admin-navbar-title">Domesticro</h1>
        </div>

        <div className="head-admin-navbar-right">
          <button
            className="head-admin-profile-btn"
            type="button"
            onClick={() => setProfileOpen((prev) => !prev)}
          >
            <div className="head-admin-profile-icon">
              <FiUser size={14} />
            </div>
            <span>{email.split('@')[0]}</span>
          </button>

          {profileOpen && (
            <div className="head-admin-dropdown">
              <button
                type="button"
                className="head-admin-dropdown-item"
                onClick={() => {
                  navigate('/head-admin/profile');
                  setProfileOpen(false);
                }}
              >
                <FiUser size={14} />
                <span>Profile</span>
              </button>

              <button
                type="button"
                className="head-admin-dropdown-item logout"
                onClick={handleLogout}
              >
                <FiLogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* =========================
         BODY
      ========================= */}
      <div className="head-admin-body">
        {/* SIDEBAR */}
        <aside
          className={`head-admin-sidebar ${
            menuOpen ? 'open' : 'closed'
          }`}
        >
          <div className="head-admin-sidebar-header">
            <div className="head-admin-sidebar-logo">D</div>
            <h2 className="head-admin-sidebar-title">Domesticro</h2>
          </div>

          <ul className="head-admin-sidebar-menu">
            <li className="head-admin-sidebar-menu-item">
              <NavLink
                to="/head-admin"
                end
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive
                    ? 'head-admin-sidebar-menu-link active'
                    : 'head-admin-sidebar-menu-link'
                }
              >
                <span className="head-admin-sidebar-menu-icon">📊</span>
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li className="head-admin-sidebar-menu-item">
              <NavLink
                to="/head-admin/customers"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive
                    ? 'head-admin-sidebar-menu-link active'
                    : 'head-admin-sidebar-menu-link'
                }
              >
                <span className="head-admin-sidebar-menu-icon">👤</span>
                <span>Customers</span>
              </NavLink>
            </li>

            <li className="head-admin-sidebar-menu-item">
              <NavLink
                to="/head-admin/admins"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive
                    ? 'head-admin-sidebar-menu-link active'
                    : 'head-admin-sidebar-menu-link'
                }
              >
                <span className="head-admin-sidebar-menu-icon">🧑‍💼</span>
                <span>Admins</span>
              </NavLink>
            </li>

            <li className="head-admin-sidebar-menu-item">
              <NavLink
                to="/head-admin/purifiers"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive
                    ? 'head-admin-sidebar-menu-link active'
                    : 'head-admin-sidebar-menu-link'
                }
              >
                <span className="head-admin-sidebar-menu-icon">📱</span>
                <span>Purifiers</span>
              </NavLink>
            </li>

            <li className="head-admin-sidebar-menu-item">
              <NavLink
                to="/head-admin/transactions"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive
                    ? 'head-admin-sidebar-menu-link active'
                    : 'head-admin-sidebar-menu-link'
                }
              >
                <span className="head-admin-sidebar-menu-icon">💳</span>
                <span>Transactions</span>
              </NavLink>
            </li>


            <li className="head-admin-sidebar-menu-item">
              <NavLink
                to="/head-admin/plans"
                onClick={closeSidebar}
                className={({ isActive }) =>
                  isActive
                    ? 'head-admin-sidebar-menu-link active'
                    : 'head-admin-sidebar-menu-link'
                }
              >
                <span className="head-admin-sidebar-menu-icon">💳</span>
                <span>Plans</span>
              </NavLink>
            </li>
          </ul>
        </aside>

        {/* CONTENT */}
        <main className="head-admin-content">
          {children}
        </main>
      </div>
    </div>
  );
}
