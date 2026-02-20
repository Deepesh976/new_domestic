import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import {
  getInstallationOrders,
  getTechnicians,
  assignInstallationTechnician,
} from '../../services/headAdminService';
import axios from '../../utils/axiosConfig';

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
   SEARCH & FILTER
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
   CUSTOMER CELL
========================= */

const CustomerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CustomerName = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: #0f172a;
`;

const OrderId = styled.div`
  font-size: 12px;
  color: #94a3b8;
`;

const PlanName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #0f172a;
`;

const AddressText = styled.div`
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
`;

const Muted = styled.div`
  font-size: 12px;
  color: #94a3b8;
`;

/* =========================
   STATUS BADGES
========================= */

const StageIndicator = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${(p) => (p.completed ? '#d1fae5' : '#fef3c7')};
  color: ${(p) => (p.completed ? '#047857' : '#b45309')};
`;

const StageDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background: ${(p) =>
    p.type === 'completed' ? '#d1fae5' : '#fef3c7'};
  color: ${(p) =>
    p.type === 'completed' ? '#047857' : '#b45309'};
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

/* =========================
   INPUTS & BUTTONS
========================= */

const Select = styled.select`
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

const ActionButton = styled.button`
  padding: 8px 16px;
  background: ${(p) => (p.danger ? '#dc2626' : '#2563eb')};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: ${(p) => (p.danger ? '#b91c1c' : '#1d4ed8')};
    box-shadow: ${(p) =>
      p.danger
        ? '0 4px 12px rgba(220, 38, 38, 0.4)'
        : '0 4px 12px rgba(37, 99, 235, 0.4)'};
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    opacity: 0.6;
  }
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
   COMPONENT
========================= */

export default function HeadAdminInstallationOrder() {
  const [orders, setOrders] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [kycModal, setKycModal] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [orderRes, techRes] = await Promise.all([
        getInstallationOrders(),
        getTechnicians(),
      ]);

      setOrders(orderRes.data || []);

const availableTechs = (techRes.data || []).filter(
  (t) => t.is_active
);

      setTechnicians(availableTechs);
    } catch {
      alert('Failed to load installation orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        `${o.customer_name} ${o.order_id} ${o.plan_name}`
          .toLowerCase()
          .includes(searchLower);

      const isCompleted = o.stages?.installation_completed;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'pending' && !isCompleted) ||
        (statusFilter === 'completed' && isCompleted);

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const handleAssign = async (order) => {
    const technician_id = assignments[order._id];
    if (!technician_id) return alert('Select a technician');

    if (!window.confirm(`Assign technician to ${order.customer_name}?`))
      return;

    await assignInstallationTechnician(order._id, technician_id);
    alert('Technician assigned successfully ✅');
    loadData();
  };

  const handleComplete = async (order) => {
    if (!window.confirm('Mark installation as completed?')) return;

    await axios.put(
      `/api/headadmin/installations/${order._id}/complete`
    );

    alert('Installation completed ✅');
    loadData();
  };

  const handleRemoveAssignment = async (order) => {
  if (
    !window.confirm(
      `Remove assignment for ${order.customer_name}?`
    )
  )
    return;

  try {
    await axios.patch(
      `/api/headadmin/installations/${order._id}/remove-assignment`
    );

    alert('Assignment removed successfully ✅');
    loadData();
  } catch (err) {
    alert(
      err.response?.data?.message ||
        'Failed to remove assignment'
    );
  }
};

  const openKycModal = (order) => {
  setKycModal(order);
};

const closeKycModal = () => {
  setKycModal(null);
};

const updateKycStatus = async (status) => {
  if (!kycModal) return;

  await axios.patch(
    `/api/headadmin/installations/${kycModal._id}/kyc`,
    { status }
  );

  alert(`KYC ${status} successfully`);
  closeKycModal();
  loadData();
};

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => !o.stages?.installation_completed).length,
    completed: orders.filter((o) => o.stages?.installation_completed).length,
    assigned: orders.filter((o) => o.stages?.technician_assigned).length,
  };

  return (
    <HeadAdminNavbar>
      <Page>
        <Container>
          <HeaderSection>
            <PageTitle>Installation Orders</PageTitle>
            <PageDescription>
              Manage installation tasks and track technician assignments
            </PageDescription>
          </HeaderSection>

          {/* Stats Cards */}
          <StatsGrid>
            <StatCard>
              <StatIcon bgColor="#dbeafe">📦</StatIcon>
              <StatLabel>Total Orders</StatLabel>
              <StatValue color="#2563eb">{stats.total}</StatValue>
            </StatCard>

            <StatCard>
              <StatIcon bgColor="#fef3c7">⏳</StatIcon>
              <StatLabel>Pending</StatLabel>
              <StatValue color="#d97706">{stats.pending}</StatValue>
            </StatCard>

            <StatCard>
              <StatIcon bgColor="#d1fae5">✓</StatIcon>
              <StatLabel>Completed</StatLabel>
              <StatValue color="#059669">{stats.completed}</StatValue>
            </StatCard>

            <StatCard>
              <StatIcon bgColor="#c7d2fe">👤</StatIcon>
              <StatLabel>Assigned</StatLabel>
              <StatValue color="#4f46e5">{stats.assigned}</StatValue>
            </StatCard>
          </StatsGrid>

          {/* Search & Filters */}
          <ControlsSection>
            <SearchInput
              type="text"
              placeholder="Search by customer name, order ID, or plan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </FilterSelect>
          </ControlsSection>

{/* Table */}
<TableWrapper>
  {!loading && filteredOrders.length === 0 && orders.length > 0 ? (
    <EmptyState>
      <EmptyIcon>🔍</EmptyIcon>
      <EmptyText>No orders match your filters</EmptyText>
    </EmptyState>
  ) : !loading && orders.length === 0 ? (
    <EmptyState>
      <EmptyIcon>📋</EmptyIcon>
      <EmptyText>No installation orders available</EmptyText>
    </EmptyState>
  ) : loading ? (
    <EmptyState>
      <EmptyIcon>⏳</EmptyIcon>
      <EmptyText>Loading orders...</EmptyText>
    </EmptyState>
  ) : (
    <Table>
      <thead>
        <tr>
          <Th>Customer & Order</Th>
          <Th>Plan</Th>
          <Th>KYC</Th>
          <Th>Stages</Th>
          <Th>Address</Th>
          <Th>Status</Th>
          <Th>Technician</Th>
          <Th>Actions</Th>
        </tr>
      </thead>

      <tbody>
        {filteredOrders.map((o) => {
          const isCompleted = o.status === 'CLOSED';
          const isAccepted =
            o.technician_approval_status === 'ACCEPTED';
          const isPending =
            o.technician_approval_status === 'PENDING';
          const isRejected =
            o.technician_approval_status === 'REJECTED';

          const kycStatus =
            o.kyc_approval_status || 'PENDING';

          return (
            <TableRow key={o._id}>
              {/* Customer */}
              <Td>
                <CustomerWrapper>
                  <CustomerName>
                    {o.customer_name}
                  </CustomerName>
                  <OrderId>
                    Order: {o.order_id}
                  </OrderId>
                </CustomerWrapper>
              </Td>

              {/* Plan */}
              <Td>
                <PlanName>{o.plan_name}</PlanName>
              </Td>

              {/* KYC */}
              <Td>
                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-block',
                    background:
                      kycStatus === 'APPROVED'
                        ? '#d1fae5'
                        : kycStatus === 'REJECTED'
                        ? '#fee2e2'
                        : '#fef3c7',
                    color:
                      kycStatus === 'APPROVED'
                        ? '#047857'
                        : kycStatus === 'REJECTED'
                        ? '#b91c1c'
                        : '#b45309',
                  }}
                  onClick={() => openKycModal(o)}
                >
                  {kycStatus}
                </div>
              </Td>

              {/* Stages */}
              <Td>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <StageIndicator
                    completed={o.stages?.payment_received}
                  >
                    <StageDot />
                    {o.stages?.payment_received
                      ? 'Payment'
                      : 'Awaiting Payment'}
                  </StageIndicator>

                  <StageIndicator
                    completed={o.stages?.kyc_verified}
                  >
                    <StageDot />
                    {o.stages?.kyc_verified
                      ? 'KYC Verified'
                      : 'KYC Pending'}
                  </StageIndicator>
                </div>
              </Td>

              {/* Address */}
              <Td>
                <AddressText>
                  {o.delivery_address?.house_flat_no}
                  <br />
                  {o.delivery_address?.area}
                  <br />
                  {o.delivery_address?.district},{' '}
                  {o.delivery_address?.state}{' '}
                  {o.delivery_address?.postal_code}
                </AddressText>
              </Td>

              {/* Status */}
              <Td>
                <StatusBadge
                  type={isCompleted ? 'completed' : 'pending'}
                >
                  <StatusDot pulse={!isCompleted} />
                  {isCompleted ? 'CLOSED' : 'OPEN'}
                </StatusBadge>
              </Td>

              {/* Technician */}
              <Td>
                {o.assigned_to ? (
                  <div>
                    <strong>
                      {o.technician_name ||
                        'Technician'}
                    </strong>
                    <br />

                    {isPending && (
                      <Muted>
                        Awaiting Approval...
                      </Muted>
                    )}

                    {isAccepted && (
                      <Muted
                        style={{
                          color: '#059669',
                          fontWeight: 600,
                        }}
                      >
                        Accepted ✓
                      </Muted>
                    )}

                    {isRejected && (
                      <Muted
                        style={{
                          color: '#dc2626',
                          fontWeight: 600,
                        }}
                      >
                        Rejected ❌
                      </Muted>
                    )}
                  </div>
                ) : (
                  <Select
                    onChange={(e) =>
                      setAssignments({
                        ...assignments,
                        [o._id]:
                          e.target.value,
                      })
                    }
                  >
                    <option value="">
                      Select Technician
                    </option>
                    {technicians.map((t) => (
                      <option
                        key={t._id}
                        value={t._id}
                      >
                        {t.user_name.first_name}{' '}
                        {t.user_name.last_name}
                      </option>
                    ))}
                  </Select>
                )}
              </Td>

              {/* Actions */}
              <Td>
                <ActionGroup>
                  {/* Assign */}
                  {!o.assigned_to && (
                    <ActionButton
                      disabled={
                        kycStatus !==
                          'APPROVED' ||
                        !o.stages
                          ?.payment_received
                      }
                      onClick={() =>
                        handleAssign(o)
                      }
                    >
                      Assign
                    </ActionButton>
                  )}

                  {/* Remove (only when pending) */}
                  {isPending && (
                    <ActionButton
                      danger
                      onClick={() =>
                        handleRemoveAssignment(o)
                      }
                    >
                      Remove
                    </ActionButton>
                  )}

                  {/* Reassign if rejected */}
                  {isRejected && (
                    <ActionButton
                      onClick={() =>
                        handleAssign(o)
                      }
                    >
                      Reassign
                    </ActionButton>
                  )}

                  {/* Complete only if accepted */}
                  {isAccepted &&
                    !isCompleted && (
                      <ActionButton
                        danger
                        onClick={() =>
                          handleComplete(o)
                        }
                      >
                        Complete
                      </ActionButton>
                    )}

                  {isCompleted && (
                    <Muted>Done ✓</Muted>
                  )}
                </ActionGroup>
              </Td>
            </TableRow>
          );
        })}
      </tbody>
    </Table>
  )}
</TableWrapper>
{/* 🔥 KYC MODAL */}
{kycModal && (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}
  >
    <div
      style={{
        background: 'white',
        padding: 24,
        borderRadius: 12,
        width: '600px',
        maxWidth: '95%',
      }}
    >
      <h3 style={{ marginBottom: 16 }}>
        {kycModal.kyc_details?.type || 'KYC Document'}
      </h3>

      {kycModal.kyc_details?.document && (
        <img
          src={`http://localhost:5000/uploads/${kycModal.kyc_details.document}`}
          alt="KYC"
          style={{
            width: '100%',
            maxHeight: 400,
            objectFit: 'contain',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
          }}
        />
      )}

      <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
        <ActionButton onClick={() => updateKycStatus('approved')}>
          Approve
        </ActionButton>

        <ActionButton danger onClick={() => updateKycStatus('rejected')}>
          Reject
        </ActionButton>

        <ActionButton
          style={{ background: '#64748b' }}
          onClick={closeKycModal}
        >
          Close
        </ActionButton>
      </div>
    </div>
  </div>
)}
        </Container>
      </Page>
    </HeadAdminNavbar>
  );
}
