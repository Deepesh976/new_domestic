import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import {
  getServiceRequests,
  getAvailableServiceTechnicians,
  assignServiceTechnician,
  updateServiceRequestStatus,
} from '../../services/headAdminService';

/* =========================
   LAYOUT
========================= */

const Page = styled.div`
  background: #f8fafc;
`;

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 16px 24px 40px;
`;

const Header = styled.div`
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-weight: 800;
  color: #0f172a;
`;

/* =========================
   FILTERS
========================= */

const Filters = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const Input = styled.input`
  padding: 8px 12px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  width: 280px;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  font-size: 13px;
`;

/* =========================
   TABLE
========================= */

const TableWrapper = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px;
  background: #f8fafc;
  font-size: 12px;
  text-transform: uppercase;
  color: #475569;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 12px;
  font-size: 13px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
`;

const Badge = styled.span`
  margin-left: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: #dbeafe;
  color: #1e3a8a;
`;

/* =========================
   HELPERS
========================= */

const formatLocation = (loc = {}) =>
  [
    loc.street,
    loc.area,
    loc.city,
    loc.state,
    loc.country,
    loc.postal_code,
  ]
    .filter(Boolean)
    .join(', ') || '—';

/* =========================
   COMPONENT
========================= */

export default function ServiceRequest() {
  const [requests, setRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD DATA
  ========================= */

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await getServiceRequests({ search, status });
      setRequests(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  const loadTechnicians = async () => {
    const res = await getAvailableServiceTechnicians();
    setTechnicians(res.data || []);
  };

  useEffect(() => {
    loadRequests();
    loadTechnicians();
  }, [status]);

  /* =========================
     ACTIONS
  ========================= */

  const handleAssign = async (requestId, techId) => {
    if (!techId) return;
    if (!window.confirm('Assign this technician?')) return;

    await assignServiceTechnician(requestId, techId);
    loadRequests();
    loadTechnicians();
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;

    await updateServiceRequestStatus(id, newStatus);
    loadRequests();
    loadTechnicians();
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <HeadAdminNavbar>
      <Page>
        <Container>
          <Header>
            <Title>Service Requests</Title>
          </Header>

          <Filters>
            <Input
              placeholder="Search Device / User"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadRequests()}
            />

            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="closed">Closed</option>
            </Select>
          </Filters>

          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>#</Th>
                  <Th>User</Th>
                  <Th>Device</Th>
                  <Th>Service Type</Th>
                  <Th>Location</Th>
                  <Th>Status</Th>
                  <Th>Technician</Th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <Td colSpan="7">Loading...</Td>
                  </tr>
                )}

                {!loading &&
                  requests.map((r, i) => (
                    <tr key={r._id}>
                      <Td>{i + 1}</Td>
                      <Td>{r.user_name || '—'}</Td>
                      <Td>{r.device_id}</Td>
                      <Td>{r.request_type}</Td>
                      <Td>{formatLocation(r.location)}</Td>

                      <Td>
                        <Select
                          value={r.status}
                          onChange={(e) =>
                            handleStatusChange(r._id, e.target.value)
                          }
                        >
                          <option value="open">Open</option>
                          <option value="assigned">Assigned</option>
                          <option value="closed">Closed</option>
                        </Select>
                      </Td>

                      <Td>
                        {r.assigned_technician_name ? (
                          <>
                            {r.assigned_technician_name}
                            <Badge>Assigned</Badge>
                          </>
                        ) : (
                          <Select
                            onChange={(e) =>
                              handleAssign(r._id, e.target.value)
                            }
                          >
                            <option value="">Assign Technician</option>
                            {technicians.map((t) => (
                              <option key={t._id} value={t._id}>
                                {t.user_name?.first_name}{' '}
                                {t.user_name?.last_name}
                              </option>
                            ))}
                          </Select>
                        )}
                      </Td>
                    </tr>
                  ))}

                {!loading && requests.length === 0 && (
                  <tr>
                    <Td colSpan="7">No service requests found</Td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>
        </Container>
      </Page>
    </HeadAdminNavbar>
  );
}
