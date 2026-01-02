import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import axios from '../../utils/axiosConfig';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import ArchivedPlan from './ArchivedPlan';
import { useNavigate } from 'react-router-dom';

/* =========================
   CONSTANTS
========================= */
const PAGE_SIZE = 8;

/* =========================
   STYLES
========================= */

const Page = styled.div`
  background: #f8fafc;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 40px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

const Tab = styled.button`
  padding: 8px 18px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  background: ${({ active }) => (active ? '#2563eb' : '#e5e7eb')};
  color: ${({ active }) => (active ? '#ffffff' : '#0f172a')};
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const Search = styled.input`
  height: 42px;
  padding: 0 14px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  font-size: 13px;
  min-width: 260px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;

const CreateButton = styled.button`
  height: 42px;
  padding: 0 18px;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
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
  text-transform: uppercase;
  border-bottom: 2px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 14px;
  border-top: 1px solid #e5e7eb;
  font-size: 14px;
  color: #0f172a;
  vertical-align: middle;
`;

const Row = styled.tr`
  &:hover {
    background: #f8fafc;
  }
`;

const Badge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: #e0f2fe;
  color: #0369a1;
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 6px 12px;
  border-radius: 8px;
  border: none;
  font-size: 12px;
  cursor: pointer;
  font-weight: 600;
  background: ${({ variant }) =>
    variant === 'delete' ? '#fee2e2' : '#e0f2fe'};
  color: ${({ variant }) =>
    variant === 'delete' ? '#b91c1c' : '#0369a1'};
`;

const Price = styled.span`
  font-weight: 700;
  white-space: nowrap;
`;

const PlanId = styled.span`
  font-family: monospace;
  font-size: 12px;
  color: #475569;
  word-break: break-all;
`;

const EmptyState = styled.div`
  padding: 60px;
  text-align: center;
  color: #64748b;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
`;

const PageBtn = styled.button`
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  background: ${({ active }) => (active ? '#2563eb' : '#ffffff')};
  color: ${({ active }) => (active ? '#ffffff' : '#0f172a')};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-IN', {
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
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const isHeadAdmin = localStorage.getItem('role') === 'headadmin';

  useEffect(() => {
    loadPlans();
  }, [tab]);

  const loadPlans = async () => {
    const url =
      tab === 'active'
        ? '/api/headadmin/plans/active'
        : '/api/headadmin/plans/archived';

    const res = await axios.get(url);
    setPlans(res.data || []);
    setPage(1);
  };

  const deletePlan = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    await axios.delete(`/api/headadmin/plans/${id}`);
    loadPlans();
  };

  const filtered = useMemo(() => {
    return plans.filter((p) =>
      `${p.name} ${p.plan_id} ${p.type}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [plans, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <HeadAdminNavbar>
      <Page>
        <Container>
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

            <Actions>
              <Search
                placeholder="Search plans..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />

              {isHeadAdmin && tab === 'active' && (
                <CreateButton
                  onClick={() => navigate('/head-admin/plans/create')}
                >
                  + Create Plan
                </CreateButton>
              )}
            </Actions>
          </Header>

          <Card>
            {tab === 'active' ? (
              filtered.length === 0 ? (
                <EmptyState>No active plans found</EmptyState>
              ) : (
                <>
                  <Table>
                    <thead>
                      <tr>
                        <Th>#</Th>
                        <Th>Name</Th>
                        <Th>Price</Th>
                        <Th>Limit</Th>
                        <Th>Validity</Th>
                        <Th>Type</Th>
                        <Th>Created</Th>
                        <Th>Plan ID</Th>
                        {isHeadAdmin && <Th>Actions</Th>}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((p, i) => (
                        <Row key={p._id}>
                          <Td>{(page - 1) * PAGE_SIZE + i + 1}</Td>
                          <Td>{p.name}</Td>
                          <Td>
                            <Price>₹ {p.price}</Price>
                          </Td>
                          <Td>{p.limit}</Td>
                          <Td>{p.validity || 'Unlimited'}</Td>
                          <Td>
                            <Badge>{p.type}</Badge>
                          </Td>
                          <Td>{formatDateTime(p.created_at)}</Td>
                          <Td>
                            <PlanId>{p.plan_id}</PlanId>
                          </Td>

                          {isHeadAdmin && (
                            <Td>
                              <ActionGroup>
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
                              </ActionGroup>
                            </Td>
                          )}
                        </Row>
                      ))}
                    </tbody>
                  </Table>

                  {totalPages > 1 && (
                    <Pagination>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PageBtn
                          key={i}
                          active={page === i + 1}
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </PageBtn>
                      ))}
                    </Pagination>
                  )}
                </>
              )
            ) : (
              <ArchivedPlan plans={filtered} />
            )}
          </Card>
        </Container>
      </Page>
    </HeadAdminNavbar>
  );
}
