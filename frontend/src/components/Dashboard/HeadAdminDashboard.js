import React from 'react';
import styled from 'styled-components';
import HeadAdminNavbar from '../Navbar/HeadAdminNavbar';

const Page = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 24px;
`;

const HeadAdminDashboard = () => {
  return (
    <Page>
      <HeadAdminNavbar />

      <Content>
        <h1>Organization Dashboard</h1>
        <p>Welcome Head Admin 👋</p>
      </Content>
    </Page>
  );
};

export default HeadAdminDashboard;
