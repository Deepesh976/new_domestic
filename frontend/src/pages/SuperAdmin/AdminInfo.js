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

  const [admins, setAdmins] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [orgSearch, setOrgSearch] = useState('');
  const [adminSearch, setAdminSearch] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await getAdmins();
      setAdmins(res.data || []);
    } catch {
      alert('Failed to load admins');
    }
  };

  /* =========================
     FILTER LOGIC (SAFE + FIXED)
  ========================= */
  const filteredAdmins = admins.filter((admin) => {
    const orgName =
      admin.organization?.organizationName?.toLowerCase() || '';

    const adminText = `${admin.username || ''} ${admin.email || ''}`
      .toLowerCase();

    return (
      orgName.includes(orgSearch.toLowerCase()) &&
      adminText.includes(adminSearch.toLowerCase())
    );
  });

  /* =========================
     ACTIONS
  ========================= */
  const handleDelete = async () => {
    if (!selectedId) return;
    if (!window.confirm('Delete this admin?')) return;

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
        {/* =========================
            TOP BAR
        ========================= */}
        <TopBar>
          <Title>Admins / Head Admins</Title>

          <Actions>
            <Button onClick={() => navigate('/super-admin/createAdmin')}>
              Create
            </Button>
            <Button
              variant="edit"
              disabled={!selectedId}
              onClick={() =>
                navigate(`/super-admin/edit-admin/${selectedId}`)
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

        {/* =========================
            SEARCH
        ========================= */}
        <SearchRow>
          <SearchBox
            placeholder="Search by organization..."
            value={orgSearch}
            onChange={(e) => setOrgSearch(e.target.value)}
          />

          <SearchBox
            placeholder="Search admin / head admin..."
            value={adminSearch}
            onChange={(e) => setAdminSearch(e.target.value)}
          />
        </SearchRow>

        {/* =========================
            TABLE
        ========================= */}
        <Card>
          <Table>
            <thead>
              <tr>
                <Th></Th>
                <Th>Organization</Th>
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Location</Th>
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
                          selectedId === admin._id ? null : admin._id
                        )
                      }
                    />
                  </Td>

                  <Td>
                    {admin.organization?.organizationName || '-'}
                  </Td>
                  <Td>{admin.username || '-'}</Td>
                  <Td>{admin.email || '-'}</Td>
                  <Td>{admin.phoneNo || '-'}</Td>
                  <Td>{admin.location || '-'}</Td>
                  <Td style={{ textTransform: 'capitalize' }}>
                    {admin.role}
                  </Td>
                </Tr>
              ))}

              {filteredAdmins.length === 0 && (
                <Tr>
                  <Td colSpan="7">No admins found</Td>
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
