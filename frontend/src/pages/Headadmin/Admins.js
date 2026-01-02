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
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 14px;
  background: #f8fafc;
  font-size: 0.7rem;
  text-align: left;
  color: #475569;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 14px;
  font-size: 0.8rem;
  border-top: 1px solid #e5e7eb;
  white-space: nowrap;
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

const KycBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
  background: #f59e0b;
`;

const KycLink = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
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
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH ADMINS
  ========================= */
  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/headadmin/admins');
      setAdmins(res.data.admins || []);
    } catch (error) {
      console.error(error);
      alert('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  /* =========================
     DELETE ADMIN
  ========================= */
  const deleteAdmin = async (admin) => {
    if (!window.confirm('Delete this admin?')) return;

    try {
      await axios.delete(`/api/headadmin/admins/${admin._id}`);
      fetchAdmins();
    } catch (error) {
      console.error(error);
      alert('Failed to delete admin');
    }
  };

  /* =========================
     HELPERS
  ========================= */
  const formatAddress = (a) =>
    [
      a.flat_no,
      a.area,
      a.city,
      a.state,
      a.country,
      a.postal_code && `- ${a.postal_code}`,
    ]
      .filter(Boolean)
      .join(', ');

  return (
    <HeadAdminNavbar>
      <Page>
        <Header>
          <Title>Organization Admins</Title>

          <AddButton
            onClick={() => navigate('/headadmin/admins/create')}
          >
            + Create Admin
          </AddButton>
        </Header>

        {loading ? (
          <Empty>Loading admins...</Empty>
        ) : admins.length === 0 ? (
          <Empty>No admins found</Empty>
        ) : (
          <Card>
            <Table>
              <thead>
                <tr>
                  <Th>Username</Th>
                  <Th>Email</Th>
                  <Th>Role</Th>
                  <Th>Phone</Th>
                  <Th>Address</Th>
                  <Th>KYC</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>

              <tbody>
                {admins.map((a) => {
                  const hasKycImage = !!a.kyc_details?.kyc_image;

                  return (
                    <Row key={a._id}>
                      <Td>{a.username}</Td>
                      <Td>{a.email}</Td>

                      <Td>
                        <Badge role={a.role}>{a.role}</Badge>
                      </Td>

                      <Td>{a.phone_number || '—'}</Td>

                      <Td>{formatAddress(a) || '—'}</Td>

                      {/* ✅ FINAL KYC LOGIC */}
                      <Td>
                        {hasKycImage ? (
                          <KycLink
                            onClick={() =>
                              navigate(
                                `/headadmin/admins/${a._id}/kyc`
                              )
                            }
                          >
                            View KYC
                          </KycLink>
                        ) : (
                          <KycBadge>pending</KycBadge>
                        )}
                      </Td>

                      <Td>
                        <ActionGroup>
                          <ActionBtn
                            className="edit"
                            onClick={() =>
                              navigate(
                                `/headadmin/admins/${a._id}/edit`
                              )
                            }
                          >
                            Edit
                          </ActionBtn>

                          <ActionBtn
                            className="delete"
                            onClick={() => deleteAdmin(a)}
                          >
                            Delete
                          </ActionBtn>
                        </ActionGroup>
                      </Td>
                    </Row>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        )}
      </Page>
    </HeadAdminNavbar>
  );
}
