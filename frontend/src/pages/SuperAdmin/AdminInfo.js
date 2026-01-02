import React, { useEffect, useState, useMemo } from 'react';
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
  flex-wrap: wrap;
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
  font-size: 0.8rem;
  color: #475569;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px;
  border-top: 1px solid #e5e7eb;
  font-size: 0.85rem;
  color: #0f172a;
`;

const Tr = styled.tr`
  &:hover {
    background: #f1f5f9;
  }
`;

const RoleBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  background: ${(p) =>
    p.role === 'headadmin' ? '#fee2e2' : '#e0f2fe'};
  color: ${(p) =>
    p.role === 'headadmin' ? '#991b1b' : '#075985'};
`;

const KycLink = styled.span`
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #1d4ed8;
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

  /* =========================
     LOAD ADMINS
  ========================= */
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await getAdmins();
      setAdmins(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load admins:', err);
      setAdmins([]);
    }
  };

  /* =========================
     FILTERING
  ========================= */
  const filteredAdmins = useMemo(() => {
    return admins.filter((admin) => {
      const orgText = `
        ${admin.organization?.org_name || ''}
        ${admin.org_id || ''}
      `.toLowerCase();

      const adminText = `
        ${admin.username || ''}
        ${admin.email || ''}
        ${admin.phone_number || ''}
        ${admin.role || ''}
      `.toLowerCase();

      return (
        orgText.includes(orgSearch.toLowerCase()) &&
        adminText.includes(adminSearch.toLowerCase())
      );
    });
  }, [admins, orgSearch, adminSearch]);

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
        {/* ================= TOP BAR ================= */}
        <TopBar>
          <Title>Admins / Head Admins</Title>

          <Actions>
            <Button
              onClick={() => navigate('/superadmin/admins/create')}
            >
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
            placeholder="Search by org name / org ID"
            value={orgSearch}
            onChange={(e) => setOrgSearch(e.target.value)}
          />

          <SearchBox
            placeholder="Search by name / email / phone / role"
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
                <Th>Username</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Address</Th>
                <Th>Role</Th>
                <Th>KYC</Th>
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
                  <Td>{admin.username || '-'}</Td>
                  <Td>{admin.email || '-'}</Td>
                  <Td>{admin.phone_number || '-'}</Td>
                  <Td>
  {[
    admin.flat_no,
    admin.area,
    admin.city,
    admin.state,
    admin.country &&
      `${admin.country}${admin.postal_code ? ' - ' + admin.postal_code : ''}`,
  ]
    .filter(Boolean)
    .join(', ') || '-'}
</Td>


                  <Td>
                    <RoleBadge role={admin.role}>
                      {admin.role}
                    </RoleBadge>
                  </Td>

                  {/* ✅ KYC LOGIC */}
                  <Td>
                    {admin.kyc_details?.kyc_image ? (
                      <KycLink
                        onClick={() =>
                          navigate(
                            `/superadmin/admins/${admin._id}/kyc`
                          )
                        }
                      >
                        Click Me
                      </KycLink>
                    ) : (
                      <span style={{ color: '#64748b' }}>
                        Pending
                      </span>
                    )}
                  </Td>
                </Tr>
              ))}

              {filteredAdmins.length === 0 && (
                <Tr>
                  <Td colSpan="9">No admins found</Td>
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
