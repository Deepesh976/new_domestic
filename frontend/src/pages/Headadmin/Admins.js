import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import styled from 'styled-components';

/* =========================
   STYLES
========================= */
const Page = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-weight: 700;
  font-size: 1.4rem;
`;

const AddButton = styled.button`
  padding: 10px 18px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 14px;
  background: #f8fafc;
  font-size: 0.75rem;
  text-align: left;
  color: #475569;
`;

const Td = styled.td`
  padding: 14px;
  font-size: 0.85rem;
  border-top: 1px solid #e5e7eb;
`;

const Row = styled.tr`
  &:hover {
    background: #f9fafb;
  }
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  background: ${(p) =>
    p.role === 'headadmin' ? '#7c3aed' : '#2563eb'};
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionBtn = styled.button`
  padding: 6px 12px;
  font-size: 0.75rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  color: white;

  &.edit {
    background: #16a34a;
  }

  &.delete {
    background: #dc2626;
  }

  &:hover {
    opacity: 0.9;
  }
`;

const Empty = styled.div`
  padding: 40px;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
`;

/* =========================
   COMPONENT
========================= */
export default function Admins() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH USERS
  ========================= */
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/headadmin/admins');
      setUsers(res.data.admins || []);
    } catch (error) {
      console.error(error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  /* =========================
     DELETE USER
  ========================= */
  const deleteUser = async (u) => {
    if (u.role === 'headadmin') {
      alert('Head Admin cannot be deleted');
      return;
    }

    if (!window.confirm('Delete this admin?')) return;

    try {
      await axios.delete(`/api/headadmin/admins/${u._id}`);
      fetchAdmins();
    } catch (error) {
      console.error(error);
      alert('Failed to delete admin');
    }
  };

  return (
    <HeadAdminNavbar>
      <Page>
        <Header>
          <Title>Organization Users</Title>

          {/* ✅ FIXED ROUTE */}
          <AddButton
            onClick={() =>
              navigate('/headadmin/admins/create')
            }
          >
            + Create Admin
          </AddButton>
        </Header>

        {loading ? (
          <Empty>Loading users...</Empty>
        ) : users.length === 0 ? (
          <Empty>No users found for this organization</Empty>
        ) : (
          <Card>
            <Table>
              <thead>
                <tr>
                  <Th>Username</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Phone</Th>
                  <Th>Location</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <Row key={u._id}>
                    <Td>{u.username}</Td>
                    <Td>{u.email}</Td>
                    <Td>
                      <Badge role={u.role}>{u.role}</Badge>
                    </Td>
                    <Td>{u.phoneNo || '—'}</Td>
                    <Td>{u.location || '—'}</Td>
                    <Td>
                      {u.role === 'admin' ? (
                        <ActionGroup>
                          {/* ✅ FIXED ROUTE */}
                          <ActionBtn
                            className="edit"
                            onClick={() =>
navigate(`/headadmin/admins/${u._id}/edit`)
                            }
                          >
                            Edit
                          </ActionBtn>

                          <ActionBtn
                            className="delete"
                            onClick={() => deleteUser(u)}
                          >
                            Delete
                          </ActionBtn>
                        </ActionGroup>
                      ) : (
                        '—'
                      )}
                    </Td>
                  </Row>
                ))}
              </tbody>
            </Table>
          </Card>
        )}
      </Page>
    </HeadAdminNavbar>
  );
}
