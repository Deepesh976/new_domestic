import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import {
  getServiceRequests,
  getAvailableServiceTechnicians,
  assignServiceTechnician,
  updateServiceRequestStatus,
} from '../../services/headAdminService';
import ServiceRequestDetail from './ServiceRequestDetail';
import { useNavigate } from 'react-router-dom';

/* =========================
   PAGE LAYOUT
========================= */

const Page = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
`;

const Container = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  padding: 32px 24px 40px;
`;

const HeaderSection = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 8px;
`;

const PageDescription = styled.p`
  font-size: 14px;
  color: #64748b;
`;

/* =========================
   STATS CARDS
========================= */

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
  }
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 900;
  color: ${(p) => p.color || '#0f172a'};
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${(p) => p.bgColor || '#f1f5f9'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 12px;
`;

/* =========================
   FILTERS
========================= */

const ControlsSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 10px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
`;

/* =========================
   TABLE
========================= */

const TableWrapper = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 16px;
  background: #f8fafc;
  font-size: 12px;
  font-weight: 700;
  text-align: left;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
`;

const Td = styled.td`
  padding: 16px;
  font-size: 14px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  color: #334155;
`;

const TableRow = styled.tr`
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
  }

  &:last-child ${Td} {
    border-bottom: none;
  }
`;

/* =========================
   USER & DEVICE INFO
========================= */

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: #0f172a;
`;

const SecondaryText = styled.div`
  font-size: 12px;
  color: #94a3b8;
`;

const LocationText = styled.div`
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
`;

/* =========================
   STATUS BADGES
========================= */

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: ${(p) =>
    p.status === 'open' ? '#fee2e2' :
    p.status === 'closed' ? '#d1fae5' :
    '#f3f4f6'};
  color: ${(p) =>
    p.status === 'open' ? '#b91c1c' :
    p.status === 'closed' ? '#047857' :
    '#6b7280'};
`;

const StatusDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: ${(p) => (p.pulse ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'none')};

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

const ServiceTypeBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: #dbeafe;
  color: #0c4a6e;
`;

/* =========================
   INPUTS & BUTTONS
========================= */

const SelectControl = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 13px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  &:disabled {
    background: #f1f5f9;
    cursor: not-allowed;
    color: #94a3b8;
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TechnicianBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: #d1fae5;
  color: #047857;
`;

const Muted = styled.div`
  font-size: 12px;
  color: #94a3b8;
`;

const EmptyState = styled.div`
  padding: 60px 24px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0;
`;

/* =========================
   MODAL
========================= */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 28px;
  width: 480px;
  max-width: 95%;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
  animation: scaleUp 0.2s ease-in-out;

  @keyframes scaleUp {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 18px;
  color: #0f172a;
`;

const DetailRow = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
  color: #334155;

  span {
    font-weight: 600;
    color: #0f172a;
  }
`;

const CloseButton = styled.button`
  margin-top: 18px;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  background: #2563eb;
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;

/* =========================
   HELPERS
========================= */

const formatLocation = (loc) =>
  loc
    ? [
        loc.street,
        loc.area,
        loc.city,
        loc.state,
        loc.country,
        loc.postal_code,
      ]
        .filter(Boolean)
        .join(', ') || '—'
    : '—';

/* =========================
   COMPONENT
========================= */

export default function ServiceRequest() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [allRequests, setAllRequests] = useState([]);
  // const [selectedRequest, setSelectedRequest] = useState(null);

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

  const loadAllRequests = async () => {
    try {
      const res = await getServiceRequests({});
      setAllRequests(res.data || []);
    } catch (error) {
      console.error('Failed to load all requests for stats', error);
    }
  };

  const loadTechnicians = async () => {
    const res = await getAvailableServiceTechnicians();
    setTechnicians(res.data || []);
  };

  useEffect(() => {
    loadRequests();
    loadAllRequests();
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
    loadAllRequests();
    loadTechnicians();
  };

  const handleStatusChange = async (id, newStatus) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;

    await updateServiceRequestStatus(id, newStatus);
    loadRequests();
    loadAllRequests();
    loadTechnicians();
  };

  // Calculate stats
  const stats = {
    total: allRequests.length,
    open: allRequests.filter((r) => r.status === 'open').length,
    closed: allRequests.filter((r) => r.status === 'closed').length,
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <HeadAdminNavbar>
      <Page>
        <Container>
          <HeaderSection>
            <PageTitle>Service Requests</PageTitle>
            <PageDescription>
              Manage service requests and assign technicians for resolution
            </PageDescription>
          </HeaderSection>

          {/* Stats Cards */}
          <StatsGrid>
            <StatCard>
              <StatIcon bgColor="#dbeafe">🔧</StatIcon>
              <StatLabel>Total Requests</StatLabel>
              <StatValue color="#2563eb">{stats.total}</StatValue>
            </StatCard>

            <StatCard>
              <StatIcon bgColor="#fee2e2">📋</StatIcon>
              <StatLabel>Open</StatLabel>
              <StatValue color="#dc2626">{stats.open}</StatValue>
            </StatCard>

            <StatCard>
              <StatIcon bgColor="#d1fae5">✓</StatIcon>
              <StatLabel>Closed</StatLabel>
              <StatValue color="#059669">{stats.closed}</StatValue>
            </StatCard>
          </StatsGrid>

          {/* Search & Filters */}
          <ControlsSection>
            <SearchInput
              placeholder="Search by device ID or user name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadRequests()}
            />

            <FilterSelect value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </FilterSelect>
          </ControlsSection>

          {/* Table */}
          <TableWrapper>
            {!loading && requests.length === 0 && allRequests.length > 0 ? (
              <EmptyState>
                <EmptyIcon>🔍</EmptyIcon>
                <EmptyText>No service requests match your filters</EmptyText>
              </EmptyState>
            ) : !loading && requests.length === 0 ? (
              <EmptyState>
                <EmptyIcon>🔧</EmptyIcon>
                <EmptyText>No service requests available</EmptyText>
              </EmptyState>
            ) : loading ? (
              <EmptyState>
                <EmptyIcon>⏳</EmptyIcon>
                <EmptyText>Loading service requests...</EmptyText>
              </EmptyState>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>User & Device</Th>
                    <Th>Service Type</Th>
                    <Th>Location</Th>
                    <Th>Status</Th>
                    <Th>Technician Assignment</Th>
                    <Th>More Data</Th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((r) => (
                    <TableRow key={r._id}>
                      <Td>
                        <UserInfo>
                          <UserName>{r.user_name || '—'}</UserName>
                          <SecondaryText>Device: {r.device_id}</SecondaryText>
                        </UserInfo>
                      </Td>

                      <Td>
                        <ServiceTypeBadge>{r.service_type}</ServiceTypeBadge>
                      </Td>

                      <Td>
                        <LocationText>{formatLocation(r.location)}</LocationText>
                      </Td>

                      <Td>
                        <ActionGroup>
<SelectControl
  value={r.status}
  onChange={(e) =>
    handleStatusChange(r._id, e.target.value)
  }
>
  <option value="open">OPEN</option>
  <option
    value="closed"
    disabled={r.technician_approval_status !== 'accepted'}
  >
    CLOSED
  </option>
</SelectControl>
                        </ActionGroup>
                      </Td>

                      <Td>
{r.assigned_technician_name &&
 r.technician_approval_status === 'accepted' ? (
  <div>
    <TechnicianBadge>
      {r.assigned_technician_name}
    </TechnicianBadge>

    <Muted>
      {r.technician_approval_status?.toUpperCase() || 'PENDING'}
    </Muted>
  </div>
) : (
  <SelectControl
    onChange={(e) =>
      handleAssign(r._id, e.target.value)
    }
  >
    <option value="">
      {r.technician_approval_status === 'rejected'
        ? 'Reassign Technician'
        : 'Assign Technician'}
    </option>
    {technicians.map((t) => (
      <option key={t.user_id} value={t.user_id}>
        {t.user_name?.first_name} {t.user_name?.last_name}
      </option>
    ))}
  </SelectControl>
)}
                      </Td>
                      <Td>
  <button
    onClick={() => navigate(`/headadmin/service-requests/${r._id}`)}
    style={{
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '18px'
    }}
  >
    👁
  </button>
</Td>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            )}
          </TableWrapper>
        </Container>
      </Page>
    </HeadAdminNavbar>
  );
}
