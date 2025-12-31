import React, { useEffect, useMemo, useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useParams } from 'react-router-dom';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import styled, { keyframes } from 'styled-components';

/* =========================
   ANIMATIONS
========================= */
const fadeIn = keyframes`
  from { opacity:0; transform: translateY(6px); }
  to { opacity:1; transform: translateY(0); }
`;

/* =========================
   STYLES
========================= */
const Page = styled.div`
  padding: 24px;
  animation: ${fadeIn} 0.25s ease;
`;

const Header = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  gap:12px;
  margin-bottom:16px;
  flex-wrap:wrap;
`;

const Title = styled.h2`
  font-weight:700;
`;

const Filters = styled.div`
  display:flex;
  gap:8px;
  flex-wrap:wrap;
`;

const Input = styled.input`
  padding:8px;
  border:1px solid #cbd5e1;
  border-radius:6px;
  font-size:0.8rem;
`;

const Button = styled.button`
  padding:8px 14px;
  background:#2563eb;
  color:white;
  border:none;
  border-radius:6px;
  font-size:0.75rem;
  cursor:pointer;
  transition:all .15s ease;

  &:hover { background:#1d4ed8; }
  &:disabled {
    background:#94a3b8;
    cursor:not-allowed;
  }
`;

const TableWrap = styled.div`
  background:white;
  border-radius:12px;
  border:1px solid #e5e7eb;
  overflow:auto;
`;

const Table = styled.table`
  width:100%;
  border-collapse:collapse;
`;

const Th = styled.th`
  padding:12px;
  background:#f8fafc;
  font-size:0.7rem;
  text-align:left;
  white-space:nowrap;
`;

const Td = styled.td`
  padding:10px 12px;
  font-size:0.75rem;
  border-top:1px solid #e5e7eb;
  white-space:nowrap;
`;

const Empty = styled.div`
  padding:32px;
  text-align:center;
  color:#64748b;
`;

const Pagination = styled.div`
  margin-top:16px;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:12px;
  flex-wrap:wrap;
`;

const Meta = styled.div`
  font-size:0.75rem;
  color:#475569;
`;

const formatIST = (date) =>
  new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

/* =========================
   COMPONENT
========================= */
export default function PurifierHistory() {
  const { deviceId } = useParams();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [search, setSearch] = useState('');

  /* Pagination */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* =========================
     FETCH HISTORY
  ========================= */
  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await axios.get(
        `/api/headadmin/purifiers/${deviceId}/history`,
        { params: { from, to } }
      );

      setHistory(res.data.history || []);
      setPage(1);
    } catch (err) {
      console.error('History error:', err);
      setError('Failed to load purifier history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, [deviceId]);

  /* =========================
     SEARCH
  ========================= */
  const filteredData = useMemo(() => {
    if (!search) return history;

    const q = search.toLowerCase();

    return history.filter(h =>
      [
        h.metadata?.device_id,
        h.tds_in,
        h.tds_out,
        h.total_litres,
        h.rem_litres,
        h.uv_error ? 'yes' : 'no',
        h.lps_error ? 'yes' : 'no',
      ]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [history, search]);

  /* =========================
     PAGINATION
  ========================= */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / pageSize)
  );

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  /* =========================
     DOWNLOAD CSV
  ========================= */
  const downloadCSV = () => {
    if (!filteredData.length) return;

    const headers = [
      'Timestamp',
      'Device',
      'TDS In',
      'TDS Out',
      'LPS Error',
      'Plan Limit',
      'Filter Life',
      'Total Litres',
      'Remaining Litres',
      'UV Error',
    ];

    const rows = filteredData.map(h => [
      formatIST(h.timestamp),
      h.metadata?.device_id,
      h.tds_in,
      h.tds_out,
      h.lps_error ? 'Yes' : 'No',
      h.plan_limit,
      h.filter_life,
      h.total_litres,
      h.rem_litres,
      h.uv_error ? 'Yes' : 'No',
    ]);

    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `purifier-history-${deviceId}.csv`;
    link.click();
  };

  /* =========================
     UI
  ========================= */
  return (
    <HeadAdminNavbar>
      <Page>
        <Header>
          <Title>Purifier History – {deviceId}</Title>

          <Filters>
            <Input type="date" value={from} onChange={e => setFrom(e.target.value)} />
            <Input type="date" value={to} onChange={e => setTo(e.target.value)} />
            <Input
              placeholder="Search logs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Button onClick={fetchHistory}>Apply</Button>
            <Button onClick={downloadCSV}>Export</Button>
          </Filters>
        </Header>

        {loading ? (
          <Empty>Loading purifier logs…</Empty>
        ) : error ? (
          <Empty>{error}</Empty>
        ) : filteredData.length === 0 ? (
          <Empty>No history found</Empty>
        ) : (
          <>
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th>#</Th>
                    <Th>Timestamp</Th>
                    <Th>Device</Th>
                    <Th>TDS In</Th>
                    <Th>TDS Out</Th>
                    <Th>LPS</Th>
                    <Th>Plan</Th>
                    <Th>Filter</Th>
                    <Th>Total</Th>
                    <Th>Remaining</Th>
                    <Th>UV</Th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((h, i) => (
                    <tr key={h._id}>
                      <Td>{(page - 1) * pageSize + i + 1}</Td>
                      <Td>{formatIST(h.timestamp)}</Td>
                      <Td>{h.metadata?.device_id}</Td>
                      <Td>{h.tds_in}</Td>
                      <Td>{h.tds_out}</Td>
                      <Td>{h.lps_error ? 'Yes' : 'No'}</Td>
                      <Td>{h.plan_limit}</Td>
                      <Td>{h.filter_life}</Td>
                      <Td>{h.total_litres}</Td>
                      <Td>{h.rem_litres}</Td>
                      <Td>{h.uv_error ? 'Yes' : 'No'}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>

            <Pagination>
              <Meta>
                Showing {(page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, filteredData.length)} of{' '}
                {filteredData.length}
              </Meta>

              <div>
                <Button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Prev
                </Button>{' '}
                <Button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Next
                </Button>
              </div>
            </Pagination>
          </>
        )}
      </Page>
    </HeadAdminNavbar>
  );
}
