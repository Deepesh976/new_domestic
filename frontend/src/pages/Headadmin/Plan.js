import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../../utils/axiosConfig';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import ArchivedPlan from './ArchivedPlan';
import { useNavigate } from 'react-router-dom';

/* =========================
   LAYOUT CONSTANTS
========================= */
const NAVBAR_HEIGHT = 64;
const SIDEBAR_WIDTH = 260;

/* =========================
   STYLES
========================= */
const PageWrapper = styled.div`
  position: fixed;
  top: ${NAVBAR_HEIGHT}px;
  left: ${SIDEBAR_WIDTH}px;
  right: 0;
  bottom: 0;
  background: #f8fafc;
  overflow-y: auto;
`;

const Content = styled.div`
  padding: 28px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
`;

const Tabs = styled.div`
  display: flex;
  gap: 10px;
`;

const Tab = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  background: ${({ active }) => (active ? '#059669' : '#e5e7eb')};
  color: ${({ active }) => (active ? '#fff' : '#111')};
`;

const CreateButton = styled.button`
  padding: 10px 18px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 14px;
  background: #f1f5f9;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
`;

const Td = styled.td`
  padding: 14px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #0f172a;
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ type }) =>
    type === 'Premium' ? '#fef3c7' : '#e0f2fe'};
  color: ${({ type }) =>
    type === 'Premium' ? '#92400e' : '#0369a1'};
`;

const ActionButton = styled.button`
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  font-size: 12px;
  cursor: pointer;
  margin-right: 6px;
  background: ${({ variant }) =>
    variant === 'delete' ? '#fee2e2' : '#e0f2fe'};
  color: ${({ variant }) =>
    variant === 'delete' ? '#b91c1c' : '#0369a1'};
`;

const EmptyState = styled.div`
  padding: 60px;
  text-align: center;
  color: #64748b;
  font-size: 15px;
`;

const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

/* =========================
   COMPONENT
========================= */
export default function Plan() {
  const [plans, setPlans] = useState([]);
  const [tab, setTab] = useState('active');
  const navigate = useNavigate();

  const loadPlans = async () => {
    const url =
      tab === 'active'
        ? '/api/headadmin/plans/active'
        : '/api/headadmin/plans/archived';

    const res = await axios.get(url);
    setPlans(res.data || []);
  };

  useEffect(() => {
    loadPlans();
  }, [tab]);

  const deletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    await axios.delete(`/api/headadmin/plans/${id}`);
    loadPlans();
  };

  return (
    <>
      <HeadAdminNavbar />

      <PageWrapper>
        <Content>
          <Header>
            <div>
              <Title>Plans</Title>
              <Tabs>
                <Tab active={tab === 'active'} onClick={() => setTab('active')}>
                  Active Plans
                </Tab>
                <Tab
                  active={tab === 'archived'}
                  onClick={() => setTab('archived')}
                >
                  Archived Plans
                </Tab>
              </Tabs>
            </div>

            {tab === 'active' && (
              <CreateButton
                onClick={() => navigate('/head-admin/plans/create')}
              >
                + Create Plan
              </CreateButton>
            )}
          </Header>

          <Card>
            {tab === 'active' ? (
              plans.length === 0 ? (
                <EmptyState>No active plans found</EmptyState>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <Th>S.No</Th>
                      <Th>Name</Th>
                      <Th>Price</Th>
                      <Th>Limit</Th>
                      <Th>Validity</Th>
                      <Th>Type</Th>
                      <Th>Created At</Th>
                      <Th>Plan ID</Th>
                      <Th>Actions</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((p, i) => (
                      <tr key={p._id}>
                        <Td>{i + 1}</Td>
                        <Td>{p.name}</Td>
                        <Td>₹ {p.price}</Td>
                        <Td>{p.limit}</Td>
                        <Td>{p.validity || 'Unlimited'}</Td>
                        <Td>
                          <Badge type={p.type}>{p.type}</Badge>
                        </Td>
                        <Td>{formatDateTime(p.created_at)}</Td>
                        <Td>{p.plan_id}</Td>
                        <Td>
                          <ActionButton
                            onClick={() =>
                              navigate(`/head-admin/plans/${p._id}/edit`)
                            }
                          >
                            Edit
                          </ActionButton>
                          <ActionButton
                            variant="delete"
                            onClick={() => deletePlan(p._id)}
                          >
                            Delete
                          </ActionButton>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )
            ) : (
              <ArchivedPlan plans={plans} />
            )}
          </Card>
        </Content>
      </PageWrapper>
    </>
  );
}
