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

  const email = localStorage.getItem('email') || 'Admin';

  /* Close sidebar on route change (mobile UX fix) */
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

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
          <NavItem to="/head-admin" icon={<MdDashboard />} label="Dashboard" />
          <NavItem to="/head-admin/customers" icon={<MdPeople />} label="Customers" />
          <NavItem to="/head-admin/admins" icon={<MdAdminPanelSettings />} label="Admins" />
          <NavItem to="/head-admin/purifiers" icon={<MdDevices />} label="Purifiers" />
          <NavItem to="/head-admin/transactions" icon={<MdPayments />} label="Transactions" />
          <NavItem to="/head-admin/plans" icon={<MdListAlt />} label="Plans" />
          <NavItem to="/head-admin/orders" icon={<MdListAlt />} label="Orders" />
          <NavItem to="/head-admin/technicians" icon={<MdEngineering />} label="Technicians" />
          <NavItem to="/head-admin/installations" icon={<MdEngineering />} label="Installations" />
          <NavItem to="/head-admin/service-requests" icon={<MdSupportAgent />} label="Service Requests" />
          <NavItem to="/head-admin/support" icon={<MdSupportAgent />} label="Support" />
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
