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
  gap: 24px;
  padding: 24px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
`;

const Title = styled.h2`
  font-weight: 800;
  color: #1a202c;
  font-size: 28px;
  letter-spacing: -0.5px;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  color: white;
  font-size: 13px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background: ${(p) =>
    p.variant === 'edit'
      ? 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
      : p.variant === 'delete'
      ? 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)'
      : 'linear-gradient(135deg, #059669 0%, #10b981 100%)'};
  box-shadow: 0 4px 12px ${(p) =>
    p.variant === 'edit'
      ? 'rgba(59, 130, 246, 0.3)'
      : p.variant === 'delete'
      ? 'rgba(239, 68, 68, 0.3)'
      : 'rgba(5, 150, 105, 0.3)'};

  &:hover:not(:disabled) {
    box-shadow: 0 6px 20px ${(p) =>
      p.variant === 'edit'
        ? 'rgba(59, 130, 246, 0.4)'
        : p.variant === 'delete'
        ? 'rgba(239, 68, 68, 0.4)'
        : 'rgba(5, 150, 105, 0.4)'};
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
  pointer-events: ${(p) => (p.disabled ? 'none' : 'auto')};
`;

const SearchRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const SearchBox = styled.input`
  padding: 11px 16px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  width: 320px;
  font-size: 13px;
  font-weight: 500;
  color: #1a202c;
  transition: all 0.3s ease;
  background: white;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.35-4.35'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 40px;
  background-size: 18px;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
`;

const Th = styled.th`
  text-align: left;
  padding: 14px 16px;
  background: linear-gradient(90deg, #f8fafc 0%, #f1f5f9 100%);
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-bottom: 2px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 14px 16px;
  border-top: 1px solid #e2e8f0;
  font-size: 13px;
  color: #1a202c;
`;

const Tr = styled.tr`
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
  }

  &:last-child td {
    border-bottom: 1px solid #e2e8f0;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3b82f6;
`;

const RoleBadge = styled.span`
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
  display: inline-block;
  background: ${(p) =>
    p.role === 'headadmin' ? '#fee2e2' : '#e0f2fe'};
  color: ${(p) =>
    p.role === 'headadmin' ? '#991b1b' : '#075985'};
  border: 1px solid ${(p) =>
    p.role === 'headadmin' ? '#fecaca' : '#bae6fd'};
`;

const KycLink = styled.span`
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #1d4ed8;
    background: #eff6ff;
    text-decoration: underline;
  }
`;

const EmptyState = styled.td`
  text-align: center;
  padding: 40px 20px !important;
  color: #94a3b8;
  font-size: 14px;
  font-style: italic;
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
                    <Checkbox
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
                  <EmptyState colSpan="9">
                    📭 No admins found. Create one to get started!
                  </EmptyState>
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
