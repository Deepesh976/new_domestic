import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  getAdmins,
  deleteAdmin,
} from '../../services/superAdminService';
import SuperAdminNavbar from '../../components/Navbar/SuperAdminNavbar';

/* =========================
   STYLES
========================= */
const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-weight: 700;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  color: white;
  background: ${(p) =>
    p.variant === 'edit'
      ? '#2563eb'
      : p.variant === 'delete'
      ? '#dc2626'
      : '#059669'};
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
  pointer-events: ${(p) => (p.disabled ? 'none' : 'auto')};
`;

const SearchRow = styled.div`
  display: flex;
  gap: 16px;
`;

const SearchBox = styled.input`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  width: 280px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background: #f8fafc;
  font-size: 0.85rem;
  color: #475569;
`;

const Td = styled.td`
  padding: 12px;
  border-top: 1px solid #e5e7eb;
  font-size: 0.9rem;
`;

const Tr = styled.tr`
  &:hover {
    background: #f1f5f9;
  }
`;

/* =========================
   COMPONENT
========================= */
const AdminInfo = () => {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]); // ✅ always array
  const [selectedId, setSelectedId] = useState(null);

  const [orgSearch, setOrgSearch] = useState('');
  const [adminSearch, setAdminSearch] = useState('');

  /* =========================
     LOAD ADMINS
  ========================= */
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await getAdmins();

      // ✅ BACKEND RETURNS { admins, headadmins }
      const adminsList = res.data?.admins || [];
      const headAdminsList = res.data?.headadmins || [];

      setAdmins([...adminsList, ...headAdminsList]);
    } catch (err) {
      console.error(err);
      alert('Failed to load admins');
      setAdmins([]);
    }
  };

  /* =========================
     FILTER LOGIC
  ========================= */
  const filteredAdmins = admins.filter((admin) => {
    const orgName =
      admin.organization?.org_name?.toLowerCase() || '';
    const orgId = admin.org_id?.toLowerCase() || '';

    const adminText = `
      ${admin.user_name?.first_name || ''}
      ${admin.user_name?.last_name || ''}
      ${admin.email || ''}
      ${admin.role || ''}
    `.toLowerCase();

    return (
      (orgName.includes(orgSearch.toLowerCase()) ||
        orgId.includes(orgSearch.toLowerCase())) &&
      adminText.includes(adminSearch.toLowerCase())
    );
  });

  /* =========================
     ACTIONS
  ========================= */
  const handleDelete = async () => {
    if (!selectedId) return;
    if (!window.confirm('Delete this user?')) return;

    try {
      await deleteAdmin(selectedId);
      setSelectedId(null);
      fetchAdmins();
    } catch {
      alert('Failed to delete admin');
    }
  };

  return (
    <SuperAdminNavbar>
      <Page>
        {/* ================= TOP BAR ================= */}
        <TopBar>
          <Title>Admins / Head Admins</Title>

          <Actions>
            <Button onClick={() => navigate('/superadmin/admins/create')}>
              Create
            </Button>

            <Button
              variant="edit"
              disabled={!selectedId}
              onClick={() =>
                navigate(`/superadmin/admins/${selectedId}/edit`)
              }
            >
              Edit
            </Button>

            <Button
              variant="delete"
              disabled={!selectedId}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </Actions>
        </TopBar>

        {/* ================= SEARCH ================= */}
        <SearchRow>
          <SearchBox
            placeholder="Search by organization name / org ID..."
            value={orgSearch}
            onChange={(e) => setOrgSearch(e.target.value)}
          />

          <SearchBox
            placeholder="Search admin / head admin..."
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
          />
        </SearchRow>

        {/* ================= TABLE ================= */}
        <Card>
          <Table>
            <thead>
              <tr>
                <Th></Th>
                <Th>Org ID</Th>
                <Th>Organization</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>City</Th>
                <Th>Role</Th>
              </tr>
            </thead>

            <tbody>
              {filteredAdmins.map((admin) => (
                <Tr key={admin._id}>
                  <Td>
                    <input
                      type="checkbox"
                      checked={selectedId === admin._id}
                      onChange={() =>
                        setSelectedId(
                          selectedId === admin._id
                            ? null
                            : admin._id
                        )
                      }
                    />
                  </Td>

                  <Td>{admin.org_id || '-'}</Td>
                  <Td>{admin.organization?.org_name || '-'}</Td>
                  <Td>
                    {admin.user_name?.first_name}{' '}
                    {admin.user_name?.last_name}
                  </Td>
                  <Td>{admin.email || '-'}</Td>
                  <Td>{admin.phone_number || '-'}</Td>
                  <Td>{admin.address?.city || '-'}</Td>
                  <Td style={{ textTransform: 'capitalize' }}>
                    {admin.role}
                  </Td>
                </Tr>
              ))}

              {filteredAdmins.length === 0 && (
                <Tr>
                  <Td colSpan="8">No admins found</Td>
                </Tr>
              )}
            </tbody>
          </Table>
        </Card>
      </Page>
    </SuperAdminNavbar>
  );
};

export default AdminInfo;
