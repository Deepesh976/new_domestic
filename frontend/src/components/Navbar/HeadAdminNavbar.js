import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

/* =========================
   ANIMATIONS
========================= */
const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const slideOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
`;

/* =========================
   TOP NAVBAR
========================= */
const Navbar = styled.div`
  height: 64px;
  background: linear-gradient(90deg, #0f766e, #14b8a6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  color: white;
  position: fixed; /* ✅ FIX */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 3000; /* ✅ ALWAYS ON TOP */
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Brand = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
`;

const Hamburger = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 26px;
  cursor: pointer;
`;

/* =========================
   PROFILE DROPDOWN
========================= */
const ProfileWrapper = styled.div`
  position: relative;
`;

const ProfileBtn = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  cursor: pointer;
`;

const Dropdown = styled.div`
  position: absolute;
  right: 0;
  top: 48px;
  background: white;
  color: #0f172a;
  min-width: 150px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.12);
  overflow: hidden;
  z-index: 4000; /* above navbar */
`;

const DropdownItem = styled.div`
  padding: 10px 14px;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
  }
`;

/* =========================
   SIDE NAV
========================= */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1500; /* ✅ BELOW NAVBAR */
`;

const SideNav = styled.div`
  position: fixed;
  top: 64px; /* ✅ below navbar */
  left: 0;
  width: 260px;
  height: calc(100vh - 64px);
  background: white;
  padding: 20px;
  animation: ${props => (props.open ? slideIn : slideOut)} 0.3s ease forwards;
  z-index: 2000;
`;

const NavItem = styled.div`
  padding: 12px 10px;
  margin-bottom: 6px;
  border-radius: 8px;
  cursor: pointer;
  color: #0f172a;

  &:hover {
    background: #f0fdfa;
    color: #0f766e;
  }
`;

/* =========================
   COMPONENT
========================= */
const HeadAdminNavbar = () => {
  const [openNav, setOpenNav] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  const goTo = (path) => {
    setOpenNav(false);   // ✅ auto close
    navigate(path);
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* TOP NAVBAR */}
      <Navbar>
        <Left>
          <Hamburger onClick={() => setOpenNav(true)}>☰</Hamburger>
          <Brand>Head Admin</Brand>
        </Left>

        <ProfileWrapper
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <ProfileBtn>HA</ProfileBtn>

          {showDropdown && (
            <Dropdown>
              <DropdownItem onClick={() => goTo('/head-admin/profile')}>
                Profile
              </DropdownItem>
              <DropdownItem onClick={logout}>
                Logout
              </DropdownItem>
            </Dropdown>
          )}
        </ProfileWrapper>
      </Navbar>

      {/* OVERLAY */}
      {openNav && <Overlay onClick={() => setOpenNav(false)} />}

      {/* SIDE NAV */}
      {openNav && (
        <SideNav open={openNav}>
          <NavItem onClick={() => goTo('/head-admin')}>
            Dashboard
          </NavItem>
          <NavItem onClick={() => goTo('/head-admin/admins')}>
            Admins
          </NavItem>
          <NavItem onClick={() => goTo('/head-admin/customers')}>
            Customers
          </NavItem>
          <NavItem onClick={() => goTo('/head-admin/devices')}>
            Devices
          </NavItem>
          <NavItem onClick={() => goTo('/head-admin/transactions')}>
            Transactions
          </NavItem>
        </SideNav>
      )}
    </>
  );
};

export default HeadAdminNavbar;
