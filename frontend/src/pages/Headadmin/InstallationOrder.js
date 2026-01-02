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
  background: #f8fafc;
`;

const Container = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  padding: 16px 24px 40px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  font-weight: 800;
  color: #0f172a;
`;

const Search = styled.input`
  height: 40px;
  padding: 0 14px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  font-size: 13px;
  width: 320px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;

/* =========================
   TABLE
========================= */

const TableWrapper = styled.div`
  background: white;
  border-radius: 16px;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 14px;
  background: #f8fafc;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  text-align: left;
  text-transform: uppercase;
  border-bottom: 2px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 14px;
  font-size: 13px;
  border-top: 1px solid #f1f5f9;
  vertical-align: top;
  color: #0f172a;
`;

/* =========================
   UI ELEMENTS
========================= */

const Name = styled.div`
  font-weight: 700;
`;

const Muted = styled.div`
  font-size: 12px;
  color: #64748b;
`;

const AddressLine = styled.div`
  font-size: 12px;
  color: #475569;
`;

const StatusBadge = styled.span`
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: ${(p) =>
    p.type === 'completed' ? '#dcfce7' : '#fef9c3'};
  color: ${(p) =>
    p.type === 'completed' ? '#166534' : '#854d0e'};
`;

const YesNoBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background: ${(p) => (p.yes ? '#dcfce7' : '#fee2e2')};
  color: ${(p) => (p.yes ? '#166534' : '#991b1b')};
`;

const Select = styled.select`
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 12px;
  width: 190px;
`;

const Button = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  background: ${(p) => (p.danger ? '#dc2626' : '#2563eb')};
  color: white;

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

/* =========================
   COMPONENT
========================= */

export default function HeadAdminInstallationOrder() {
  const [orders, setOrders] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

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
        (t) => t.is_active && t.work_status === 'free'
      );

      setTechnicians(availableTechs);
    } catch {
      alert('Failed to load installation orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) =>
      `${o.customer_name} ${o.order_id} ${o.plan_name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [orders, search]);

  const handleAssign = async (order) => {
    const technician_id = assignments[order._id];
    if (!technician_id) return alert('Select a technician');

    if (!window.confirm(`Assign technician to ${order.customer_name}?`))
      return;

    await assignInstallationTechnician(order._id, { technician_id });
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

  return (
    <HeadAdminNavbar>
      <Page>
        <Container>
          <Header>
            <Title>Installation Orders</Title>
            <Search
              placeholder="Search customer / order / plan"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Header>

          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Customer</Th>
                  <Th>Plan</Th>
                  <Th>Payment</Th>
                  <Th>KYC</Th>
                  <Th>Installation</Th>
                  <Th>Address</Th>
                  <Th>Status</Th>
                  <Th>Technician</Th>
                  <Th>Action</Th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o._id}>
                    <Td>
                      <Name>{o.customer_name}</Name>
                      <Muted>Order ID: {o.order_id}</Muted>
                    </Td>

                    <Td>
                      <Name>{o.plan_name}</Name>
                    </Td>

                    <Td>
                      <YesNoBadge yes={o.stages?.payment_received}>
                        {o.stages?.payment_received ? 'Paid' : 'Unpaid'}
                      </YesNoBadge>
                    </Td>

                    <Td>
                      <YesNoBadge yes={o.stages?.kyc_verified}>
                        {o.stages?.kyc_verified ? 'Verified' : 'Pending'}
                      </YesNoBadge>
                    </Td>

                    <Td>
                      <YesNoBadge yes={o.stages?.installation_completed}>
                        {o.stages?.installation_completed
                          ? 'Completed'
                          : 'Pending'}
                      </YesNoBadge>
                    </Td>

                    <Td>
                      <AddressLine>{o.delivery_address?.house_flat_no}</AddressLine>
                      <AddressLine>
                        {o.delivery_address?.area}, {o.delivery_address?.district}
                      </AddressLine>
                      <AddressLine>
                        {o.delivery_address?.state},{' '}
                        {o.delivery_address?.country} –{' '}
                        {o.delivery_address?.postal_code}
                      </AddressLine>
                    </Td>

                    <Td>
                      <StatusBadge
                        type={
                          o.stages?.installation_completed
                            ? 'completed'
                            : 'pending'
                        }
                      >
                        {o.stages?.installation_completed
                          ? 'Completed'
                          : 'Pending'}
                      </StatusBadge>
                    </Td>

                    <Td>
                      {o.stages?.technician_assigned === false ? (
                        <Select
                          onChange={(e) =>
                            setAssignments({
                              ...assignments,
                              [o._id]: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Technician</option>
                          {technicians.map((t) => (
                            <option key={t._id} value={t._id}>
                              {t.user_name.first_name}{' '}
                              {t.user_name.last_name}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        <Muted>Assigned</Muted>
                      )}
                    </Td>

                    <Td>
                      {o.stages?.technician_assigned === false && (
                        <Button onClick={() => handleAssign(o)}>
                          Assign
                        </Button>
                      )}

                      {o.stages?.technician_assigned &&
                        !o.stages?.installation_completed && (
                          <Button danger onClick={() => handleComplete(o)}>
                            Complete
                          </Button>
                        )}
                    </Td>
                  </tr>
                ))}

                {!loading && filteredOrders.length === 0 && (
                  <tr>
                    <Td colSpan="9" style={{ textAlign: 'center' }}>
                      No installation orders available
                    </Td>
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
