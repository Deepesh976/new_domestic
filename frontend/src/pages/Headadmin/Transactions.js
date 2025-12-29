import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from '../../utils/axiosConfig';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import { useLocation } from 'react-router-dom';

/* =========================
   STYLES
========================= */
const Page = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-weight: 700;
`;

const Search = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px;
  background: #f8fafc;
  font-size: 0.75rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  font-size: 0.8rem;
  border-top: 1px solid #e5e7eb;
`;

const Empty = styled.div`
  padding: 24px;
  text-align: center;
  color: #64748b;
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  color: white;
  background: ${({ status }) =>
    status === 'success' ? '#16a34a' : '#dc2626'};
`;

const formatDate = (date) => {
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
export default function RechargeTransactions() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const deviceId = params.get('device_id');

  useEffect(() => {
    axios
      .get('/api/headadmin/transactions', {
        params: deviceId ? { device_id: deviceId } : {},
      })
      .then((res) => {
        setData(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to load transactions');
      });
  }, [deviceId]);

  const filtered = data.filter(
    (t) =>
      t.device_id?.toLowerCase().includes(search.toLowerCase()) ||
      t.txn_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <HeadAdminNavbar>
      <Page>
        <Header>
          <Title>
            Recharge Transactions
            {deviceId ? ` — ${deviceId}` : ''}
          </Title>

          <Search
            placeholder="Search Device / Txn ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Header>

        <Card>
          {filtered.length === 0 ? (
            <Empty>No transactions found</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>S.No</Th>
                  <Th>Device ID</Th>
                  <Th>Txn ID</Th>
                  <Th>Plan ID</Th>
                  <Th>Amount</Th>
                  <Th>Gateway</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr key={t._id}>
                    <Td>{i + 1}</Td>
                    <Td>{t.device_id}</Td>
                    <Td>{t.txn_id}</Td>
                    <Td>{t.plan_id || '—'}</Td>
                    <Td>₹ {t.price}</Td>
                    <Td>{t.payment_gateway || '—'}</Td>
                    <Td>
                      <Badge status={t.status}>{t.status}</Badge>
                    </Td>
                    <Td>{formatDate(t.date)}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>
      </Page>
    </HeadAdminNavbar>
  );
}
