import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink, useNavigate } from 'react-router-dom';

/* =========================
   STYLES
========================= */
const Page = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
`;

const Navbar = styled.div`
  height: 64px;
  background: #0f172a;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 16px;
`;

const Left = styled.div`
  width: 200px;
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
  font-weight: 700;
`;

const Right = styled.div`
  width: 200px;
  display: flex;
  justify-content: flex-end;
  position: relative;
`;

const Hamburger = styled.button`
  font-size: 1.4rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
`;

const ProfileBtn = styled.button`
  background: #1e293b;
  border: none;
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  cursor: pointer;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 52px;
  right: 0;
  background: white;
  color: #0f172a;
  border-radius: 8px;
  width: 160px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.15);
`;

const DropItem = styled.div`
  padding: 10px 14px;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
  }

  &.logout {
    color: #dc2626;
    font-weight: 600;
  }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 240px;
  background: #020617;
  color: #e5e7eb;
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.25s ease;
`;

const MenuItem = styled(NavLink)`
  display: block;
  padding: 12px 24px;
  color: #cbd5f5;
  text-decoration: none;

  &.active {
    background: #1e293b;
    color: white;
    font-weight: 600;
  }

  &:hover {
    background: #1e293b;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
`;

/* =========================
   COMPONENT
========================= */
const SuperAdminNavbar = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Page>
      {/* TOP NAVBAR */}
      <Navbar>
        <Left>
          <Hamburger onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </Hamburger>
        </Left>

        <Center>SuperAdmin Panel</Center>

        <Right>
          <ProfileBtn onClick={() => setProfileOpen(!profileOpen)}>
            {localStorage.getItem('email')}
          </ProfileBtn>

          {profileOpen && (
            <Dropdown>
              <DropItem onClick={() => navigate('/super-admin/profile')}>
                Profile
              </DropItem>
              <DropItem className="logout" onClick={logout}>
                Logout
              </DropItem>
            </Dropdown>
          )}
        </Right>
      </Navbar>

      {/* BODY */}
      <Body>
        <Sidebar open={sidebarOpen}>
          <MenuItem to="/super-admin" end>Dashboard</MenuItem>
          <MenuItem to="/super-admin/org">Organizations</MenuItem>
          <MenuItem to="/super-admin/adminInfo">Admins</MenuItem>
          <MenuItem to="/super-admin/device">Devices</MenuItem>
          <MenuItem to="/super-admin/customer">Customers</MenuItem>
          <MenuItem to="/super-admin/transaction">Transactions</MenuItem>
        </Sidebar>

        <Content>
          {children} {/* 🔥 PAGE CONTENT GOES HERE */}
        </Content>
      </Body>
    </Page>
  );
};

export default SuperAdminNavbar;
