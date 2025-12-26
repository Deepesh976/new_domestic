import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  getOrganizations,
  deleteOrganization,
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

const SearchBox = styled.input`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  width: 300px;
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
`;

const Tr = styled.tr`
  &:hover {
    background: #f1f5f9;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
`;

/* ✅ FIX: use $active so React doesn’t forward it to DOM */
const PageBtn = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: ${(p) => (p.$active ? '#2563eb' : 'white')};
  color: ${(p) => (p.$active ? 'white' : '#0f172a')};
  cursor: pointer;
`;

/* =========================
   COMPONENT
========================= */
const SuperAdminOrg = () => {
  const navigate = useNavigate();

  const [orgs, setOrgs] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);

  const pageSize = 5;

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      const res = await getOrganizations();
      setOrgs(res.data || []);
    } catch {
      alert('Failed to load organizations');
    }
  };

  /* =========================
     FILTER + PAGINATION
  ========================= */
  const filtered = orgs.filter((org) =>
    `${org.organizationName} ${org.emailId} ${org.state || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = filtered.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  /* =========================
     ACTIONS
  ========================= */
  const handleDelete = async () => {
    if (!selectedId) return;
    if (!window.confirm('Delete this organization?')) return;

    try {
      await deleteOrganization(selectedId);
      setSelectedId(null);
      fetchOrganizations();
    } catch {
      alert('Failed to delete organization');
    }
  };

  return (
    <SuperAdminNavbar>
      <Page>
        {/* TOP BAR */}
        <TopBar>
          <Title>Organizations</Title>

          <Actions>
            <Button onClick={() => navigate('/super-admin/create-organization')}>
              Create
            </Button>

            <Button
              variant="edit"
              disabled={!selectedId}
              onClick={() =>
                navigate(`/super-admin/edit-organization/${selectedId}`)
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

        {/* SEARCH */}
        <SearchBox
          placeholder="Search organization..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {/* TABLE */}
        <Card>
          <Table>
            <thead>
              <tr>
                <Th></Th>
                <Th>Organization Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>State</Th>
              </tr>
            </thead>

            <tbody>
              {paginated.map((org) => (
                <Tr key={org._id}>
                  <Td>
                    <input
                      type="checkbox"
                      checked={selectedId === org._id}
                      onChange={() =>
                        setSelectedId(
                          selectedId === org._id ? null : org._id
                        )
                      }
                    />
                  </Td>

                  <Td>{org.organizationName}</Td>
                  <Td>{org.emailId}</Td>
                  <Td>{org.phoneNumber || '-'}</Td>
                  <Td>{org.state || '-'}</Td>
                </Tr>
              ))}

              {paginated.length === 0 && (
                <Tr>
                  <Td colSpan="5">No organizations found</Td>
                </Tr>
              )}
            </tbody>
          </Table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <Pagination>
              {Array.from({ length: totalPages }).map((_, i) => (
                <PageBtn
                  key={i}
                  $active={page === i + 1}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </PageBtn>
              ))}
            </Pagination>
          )}
        </Card>
      </Page>
    </SuperAdminNavbar>
  );
};

export default SuperAdminOrg;
