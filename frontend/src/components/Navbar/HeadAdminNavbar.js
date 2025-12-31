import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiUser, FiLogOut } from 'react-icons/fi';
import {
  MdDashboard,
  MdPeople,
  MdAdminPanelSettings,
  MdDevices,
  MdPayments,
  MdListAlt,
  MdEngineering,
  MdSupportAgent,
} from 'react-icons/md';
import './HeadAdminNavbar.css';

export default function HeadAdminNavbar({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem('role'); // headadmin | admin
  const email = localStorage.getItem('email') || 'User';
  const isHeadAdmin = role === 'headadmin';

  /* =========================
     CLOSE MENUS ON ROUTE CHANGE
  ========================= */
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  /* =========================
     LOGOUT
  ========================= */
  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="layout">
      {/* ================= TOP BAR ================= */}
      <header className="topbar">
        <button
          className="hamburger"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <FiMenu size={22} />
        </button>

        <h1 className="brand">Domesticro</h1>

        <div className="profile">
          <button
            className="profile-btn"
            onClick={() => setProfileOpen((v) => !v)}
          >
            <FiUser />
            <span>{email.split('@')[0]}</span>
          </button>

          {profileOpen && (
            <div className="profile-menu">
              <button onClick={() => navigate('/profile')}>
                <FiUser /> Profile
              </button>
              <button className="logout" onClick={logout}>
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ================= OVERLAY (MOBILE) ================= */}
      {menuOpen && (
        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <nav className="menu">
          <NavItem
            to="/headadmin"
            icon={<MdDashboard />}
            label="Dashboard"
          />

          <NavItem
            to="/headadmin/customers"
            icon={<MdPeople />}
            label="Customers"
          />

          {/* HEADADMIN ONLY */}
          {isHeadAdmin && (
            <NavItem
              to="/headadmin/admins"
              icon={<MdAdminPanelSettings />}
              label="Admins"
            />
          )}

          <NavItem
            to="/headadmin/purifiers"
            icon={<MdDevices />}
            label="Purifiers"
          />

          <NavItem
            to="/headadmin/transactions"
            icon={<MdPayments />}
            label="Transactions"
          />
          
            <NavItem
              to="/headadmin/plans"
              icon={<MdListAlt />}
              label="Plans"
            />

          <NavItem
            to="/headadmin/technicians"
            icon={<MdEngineering />}
            label="Technicians"
          />

          <NavItem
            to="/headadmin/installations"
            icon={<MdEngineering />}
            label="Installations"
          />

          <NavItem
            to="/headadmin/service-requests"
            icon={<MdSupportAgent />}
            label="Service Requests"
          />

          <NavItem
            to="/headadmin/support"
            icon={<MdSupportAgent />}
            label="Support"
          />
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="content">{children}</main>
    </div>
  );
}

/* ================= MENU ITEM ================= */
const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      isActive ? 'menu-item active' : 'menu-item'
    }
  >
    <span className="icon">{icon}</span>
    <span>{label}</span>
  </NavLink>
);
