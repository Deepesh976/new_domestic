import React, { useEffect, useMemo, useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useParams } from 'react-router-dom';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import styled from 'styled-components';

/* ========================= STYLES ========================= */
const Page = styled.div`padding:24px;`;
const Header = styled.div`
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:16px;
`;
const Title = styled.h2`font-weight:700;`;
const Filters = styled.div`
  display:flex;
  gap:8px;
  flex-wrap:wrap;
`;
const Input = styled.input`
  padding:8px;
  border:1px solid #cbd5e1;
  border-radius:6px;
`;
const Button = styled.button`
  padding:8px 14px;
  background:#2563eb;
  color:white;
  border:none;
  border-radius:6px;
  cursor:pointer;
`;

const Table = styled.table`
  width:100%;
  border-collapse:collapse;
`;
const Th = styled.th`
  padding:12px;
  background:#f8fafc;
  font-size:0.75rem;
`;
const Td = styled.td`
  padding:12px;
  font-size:0.8rem;
  border-top:1px solid #e5e7eb;
`;
const Empty = styled.div`
  padding:24px;
  text-align:center;
  color:#64748b;
`;

const Pagination = styled.div`
  margin-top:16px;
  display:flex;
  justify-content:space-between;
  align-items:center;
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

/* ========================= COMPONENT ========================= */
export default function PurifierHistory() {
  const { deviceId } = useParams();

  const [history, setHistory] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [search, setSearch] = useState('');

  /* Pagination */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchHistory = async () => {
    const res = await axios.get(
      `/api/headadmin/purifiers/${deviceId}/history`,
      { params: { from, to } }
    );
    setHistory(res.data.history || []);
    setPage(1);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  /* ========================= SEARCH (GLOBAL) ========================= */
  const filteredData = useMemo(() => {
    if (!search) return history;

    const q = search.toLowerCase();

    return history.filter(h =>
      Object.values({
        device: h.metadata?.device_id,
        tdsIn: h.tds_in,
        tdsOut: h.tds_out,
        total: h.total_litres,
        remaining: h.rem_litres,
        uv: h.uv_error ? 'yes' : 'no',
        lps: h.lps_error ? 'yes' : 'no',
      })
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [history, search]);

  /* ========================= PAGINATION ========================= */
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  /* ========================= DOWNLOAD CSV ========================= */
  const downloadCSV = () => {
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
      h.metadata.device_id,
      h.tds_in,
      h.tds_out,
      h.lps_error ? 'Yes' : 'No',
      h.plan_limit,
      h.filter_life,
      h.total_litres,
      h.rem_litres,
      h.uv_error ? 'Yes' : 'No',
    ]);

    const csv = [headers, ...rows]
      .map(r => r.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `purifier-history-${deviceId}.csv`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <HeadAdminNavbar>
      <Page>
        <Header>
          <Title>Purifier Logs – {deviceId}</Title>
          <Filters>
            <Input type="date" value={from} onChange={e => setFrom(e.target.value)} />
            <Input type="date" value={to} onChange={e => setTo(e.target.value)} />
            <Input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <Button onClick={fetchHistory}>Filter</Button>
            <Button onClick={downloadCSV}>Download</Button>
          </Filters>
        </Header>

        {filteredData.length === 0 ? (
          <Empty>No history found</Empty>
        ) : (
          <>
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
                    <Td>{h.metadata.device_id}</Td>
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

            <Pagination>
              <div>
                Page {page} of {totalPages}
              </div>
              <div>
                <Button disabled={page === 1} onClick={() => setPage(p => p - 1)}>
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
