import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getTransactions } from '../../services/superAdminService';
import SuperAdminNavbar from '../../components/Navbar/SuperAdminNavbar';

/* =========================
   STYLES
========================= */
const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2`
  font-weight: 700;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 16px;
`;

const SearchBox = styled.input`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  width: 260px;
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
  font-size: 0.9rem;
`;

const Tr = styled.tr`
  &:hover {
    background: #f1f5f9;
  }
`;

/* =========================
   COMPONENT
========================= */
const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [orgSearch, setOrgSearch] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await getTransactions();
      setTransactions(res.data || []);
    } catch {
      alert('Failed to load transactions');
    }
  };

  /* =========================
     FILTER
  ========================= */
  const filtered = transactions.filter((t) => {
    const text = `
      ${t.txn_id}
      ${t.device_id}
      ${t.payment_gateway}
      ${t.status}
    `.toLowerCase();

    const orgText = (t.org_id || '').toLowerCase();

    return (
      text.includes(search.toLowerCase()) &&
      orgText.includes(orgSearch.toLowerCase())
    );
  });

  return (
    <SuperAdminNavbar>
      <Page>
        <Title>Transactions</Title>

        {/* SEARCH */}
        <SearchRow>
          <SearchBox
            placeholder="Search transaction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <SearchBox
            placeholder="Search organization..."
            value={orgSearch}
            onChange={(e) => setOrgSearch(e.target.value)}
          />
        </SearchRow>

        {/* TABLE */}
        <Card>
          <Table>
            <thead>
              <tr>
                <Th>S.No</Th>
                <Th>Organization</Th>
                <Th>User</Th>
                <Th>Device</Th>
                <Th>Txn ID</Th>
                <Th>Amount</Th>
                <Th>Gateway</Th>
                <Th>Status</Th>
                <Th>Date</Th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t, index) => (
                <Tr key={t._id}>
                  <Td>{index + 1}</Td>
                  <Td>{t.org_id || '—'}</Td>
                  <Td>{t.user_id || '—'}</Td>
                  <Td>{t.device_id || '—'}</Td>
                  <Td>{t.txn_id}</Td>
                  <Td>
                    {t.price} {t.currency}
                  </Td>
                  <Td>{t.payment_gateway}</Td>
                  <Td style={{ textTransform: 'capitalize' }}>
                    {t.status}
                  </Td>
                  <Td>
                    {t.date
                      ? new Date(t.date).toLocaleString()
                      : '—'}
                  </Td>
                </Tr>
              ))}

              {filtered.length === 0 && (
                <Tr>
                  <Td colSpan="9">No transactions found</Td>
                </Tr>
              )}
            </tbody>
          </Table>
        </Card>
      </Page>
    </SuperAdminNavbar>
  );
};

export default Transaction;
