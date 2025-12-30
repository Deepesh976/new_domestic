import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi';
import './SuperAdminNavbar.css';

const SuperAdminNavbar = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  const email = localStorage.getItem('email') || 'SuperAdmin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  /* =========================
     CLOSE SIDEBAR ON OUTSIDE CLICK
  ========================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="layout">
      {/* TOP BAR */}
      <header className="topbar">
        <div className="topbar-left">
          <button
            ref={hamburgerRef}
            className="icon-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            <FiMenu size={20} />
          </button>
          <h1 className="brand">Domesticro</h1>
        </div>

        <div className="topbar-right">
          <button
            className="profile-btn"
            onClick={() => setProfileOpen((prev) => !prev)}
          >
            <FiUser size={14} />
            <span>{email.split('@')[0]}</span>
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              <button
                onClick={() => {
                  navigate('/profile');
                  setProfileOpen(false);
                }}
              >
                <FiUser /> Profile
              </button>

              <button className="logout" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN */}
      <div className="main">
        {/* SIDEBAR */}
        <aside
          ref={sidebarRef}
          className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}
        >
          <nav>
            <NavLink end to="/super-admin">📊 Dashboard</NavLink>
            <NavLink to="/super-admin/organizations">🏢 Organizations</NavLink>
            <NavLink to="/super-admin/admins">👤 Admins</NavLink>
            <NavLink to="/super-admin/devices">📱 Devices</NavLink>
            <NavLink to="/super-admin/customers">👥 Customers</NavLink>
            <NavLink to="/super-admin/transactions">💳 Transactions</NavLink>
          </nav>
        </aside>

        {/* CONTENT */}
        <section className="content">
          {children}
        </section>
      </div>
    </div>
  );
};

export default SuperAdminNavbar;
