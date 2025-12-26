import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../../utils/axiosConfig';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';

/* =========================
   STYLES
========================= */
const Page = styled.div`
  background: #f8fafc;
  min-height: 100vh;
`;

const Container = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  color: #0f172a;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: white;
  background: ${(p) => p.variant || '#0f766e'};
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0,0,0,0.06);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 14px;
  background: #f1f5f9;
  text-align: left;
  font-weight: 600;
  color: #334155;
`;

const Td = styled.td`
  padding: 14px;
  border-bottom: 1px solid #e2e8f0;
  color: #0f172a;
`;

const Checkbox = styled.input``;

/* =========================
   COMPONENT
========================= */
const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get('/api/head-admin/admins');
        setAdmins(res.data);
      } catch (err) {
        console.error('Failed to fetch admins', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  return (
    <Page>
      <HeadAdminNavbar />

      <Container>
        <Header>
          <Title>ADMINS</Title>
          <Actions>
            <Button>CREATE</Button>
            <Button variant="#2563eb">EDIT</Button>
            <Button variant="#dc2626">DELETE</Button>
          </Actions>
        </Header>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th><Checkbox type="checkbox" /></Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Location</Th>
                  <Th>Role</Th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id}>
                    <Td><Checkbox type="checkbox" /></Td>
                    <Td>{admin.name}</Td>
                    <Td>{admin.email}</Td>
                    <Td>{admin.phone}</Td>
                    <Td>{admin.location}</Td>
                    <Td>{admin.role}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        )}
      </Container>
    </Page>
  );
};

export default Admins;
