import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../../utils/axiosConfig';
import { useParams } from 'react-router-dom';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';

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

const Search = styled.input`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  width: 280px;
`;

const Card = styled.div`
  background: white;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  min-width: 1100px;
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

const Status = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: ${({ status }) =>
    status === 'active' ? '#dcfce7' : '#fee2e2'};
  color: ${({ status }) =>
    status === 'active' ? '#166534' : '#991b1b'};
`;

const Empty = styled.div`
  padding: 60px;
  text-align: center;
  color: #64748b;
  font-size: 15px;
`;

/* =========================
   HELPERS
========================= */
const formatIST = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/* =========================
   COMPONENT
========================= */
export default function RechargedPlan() {
  const { deviceId } = useParams(); // ✅ DEVICE SPECIFIC
  const [recharges, setRecharges] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios
      .get('/api/headadmin/recharged-plans', {
        params: { device_id: deviceId },
      })
      .then((res) => setRecharges(res.data || []))
      .catch(() => alert('Failed to load recharged plans'));
  }, [deviceId]);

  const filtered = recharges.filter((r) =>
    r.device_id?.toLowerCase().includes(search.toLowerCase()) ||
    r.plan_id?.toLowerCase().includes(search.toLowerCase()) ||
    r.txn_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <HeadAdminNavbar />

      <PageWrapper>
        <Content>
          <Header>
            <Title>Recharged Plans — {deviceId}</Title>
            <Search
              placeholder="Search Device / Plan ID / Txn ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Header>

          <Card>
            {filtered.length === 0 ? (
              <Empty>No recharged plans found</Empty>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th>S.No</Th>
                    <Th>Device ID</Th>
                    <Th>Plan ID</Th>
                    <Th>Txn ID</Th>
                    <Th>Limit</Th>
                    <Th>Validity</Th>
                    <Th>Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={r._id}>
                      <Td>{i + 1}</Td>
                      <Td>{r.device_id}</Td>
                      <Td>{r.plan_id}</Td>
                      <Td>{r.txn_id}</Td>
                      <Td>{r.limit}</Td>
                      <Td>{r.validity}</Td>
                      <Td>
                        <Status status={r.status}>{r.status}</Status>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Content>
      </PageWrapper>
    </>
  );
}
