import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import styled from 'styled-components';

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

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
`;

const Button = styled.button`
  padding: 8px 14px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const TableWrap = styled.div`
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

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  color: white;
  background: ${(p) => (p.active ? '#16a34a' : '#64748b')};
`;

const LinkBtn = styled.button`
  background: none;
  border: none;
  color: #2563eb;
  cursor: pointer;
  font-weight: 600;
`;

const ActionBtn = styled.button`
  padding: 4px 10px;
  font-size: 0.75rem;
  border-radius: 6px;
  border: none;
  color: white;
  cursor: pointer;
`;

const Empty = styled.div`
  padding: 24px;
  text-align: center;
  color: #64748b;
`;

/* =========================
   MODAL
========================= */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const Modal = styled.div`
  background: white;
  width: 650px;
  padding: 24px;
  border-radius: 12px;
  max-height: 80vh;
  overflow: auto;
`;

const Hr = styled.hr`
  margin: 14px 0;
`;

/* =========================
   HELPERS
========================= */
const formatIST = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/* =========================
   COMPONENT
========================= */
export default function Purifiers() {
  const navigate = useNavigate();

  const [purifiers, setPurifiers] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState(null);
  const [userView, setUserView] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /* =========================
     FETCH PURIFIERS
  ========================= */
  useEffect(() => {
    const fetchPurifiers = async () => {
      try {
        const res = await axios.get('/api/headadmin/purifiers');
        setPurifiers(res.data.purifiers || []);
      } catch (err) {
        console.error('PURIFIER ERROR:', err);
        setError('Failed to load purifiers');
      } finally {
        setLoading(false);
      }
    };

    fetchPurifiers();
  }, []);

  const filtered = purifiers.filter(
    (p) =>
      p.device_id?.toLowerCase().includes(search.toLowerCase()) ||
      `${p.user_details?.user_name?.first_name || ''} ${
        p.user_details?.user_name?.last_name || ''
      }`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  /* =========================
     DOWNLOAD CSV
  ========================= */
  const downloadCSV = () => {
    if (!filtered.length) return;

    const rows = filtered.map((p, i) => ({
      SNo: i + 1,
      DeviceID: p.device_id,
      Name: p.user_details
        ? `${p.user_details.user_name?.first_name} ${p.user_details.user_name?.last_name}`
        : '',
      Status: p.status,
      Location: p.installed_location || '',
      TotalUsage: p.total_usage ?? '',
      AvgUsage: p.avg_usage ?? '',
      CreatedOn: formatIST(p.createdAt),
    }));

    const csv = [
      Object.keys(rows[0]).join(','),
      ...rows.map((r) => Object.values(r).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'purifiers.csv';
    link.click();
  };

  return (
    <HeadAdminNavbar>
      <Page>
        <Header>
          <Title>Purifiers</Title>
          <Actions>
            <Input
              placeholder="Search Device / Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={downloadCSV}>Download</Button>
          </Actions>
        </Header>

        {loading && <Empty>Loading purifiers…</Empty>}
        {error && <Empty>{error}</Empty>}

        {!loading && !error && filtered.length === 0 && (
          <Empty>No purifiers found</Empty>
        )}

        {!loading && !error && filtered.length > 0 && (
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <Th>S.No</Th>
                  <Th>Device ID</Th>
                  <Th>Name</Th>
                  <Th>Status</Th>
                  <Th>Installed Location</Th>
                  <Th>Total Usage</Th>
                  <Th>Avg Usage</Th>
                  <Th>Created On</Th>
                  <Th>Action</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p._id}>
                    <Td>{i + 1}</Td>

                    <Td>
                      <LinkBtn
                        onClick={() =>
                          navigate(
                            `/headadmin/purifiers/${p.device_id}/history`
                          )
                        }
                      >
                        {p.device_id}
                      </LinkBtn>
                    </Td>

                    <Td>
                      {p.user_details ? (
                        <LinkBtn onClick={() => setUserView(p.user_details)}>
                          {p.user_details.user_name?.first_name}{' '}
                          {p.user_details.user_name?.last_name}
                        </LinkBtn>
                      ) : (
                        '—'
                      )}
                    </Td>

                    <Td>
                      <Badge active={p.status === 'active'}>
                        {p.status}
                      </Badge>
                    </Td>

                    <Td>{p.installed_location || '—'}</Td>
                    <Td>{p.total_usage ?? '—'}</Td>
                    <Td>{p.avg_usage ?? '—'}</Td>
                    <Td>{formatIST(p.createdAt)}</Td>

                    <Td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <ActionBtn
                          style={{ background: '#0ea5e9' }}
                          onClick={() => setView(p)}
                        >
                          View More
                        </ActionBtn>

                        <ActionBtn
                          style={{ background: '#6366f1' }}
                          onClick={() =>
                            navigate(
                              `/headadmin/purifiers/${p.device_id}/analytics`
                            )
                          }
                        >
                          Analytics
                        </ActionBtn>

<ActionBtn
  style={{ background: '#16a34a' }}
  onClick={() =>
    navigate(
      `/headadmin/purifiers/${p.device_id}/recharged-plan`
    )
  }
>
  Recharged Plan
</ActionBtn>

                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        )}
      </Page>

      {/* ================= USER DETAILS MODAL ================= */}
      {userView && (
        <Overlay onClick={() => setUserView(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3>Customer Details</h3>
            <Hr />
            <Table>
              <tbody>
                <tr>
                  <Th>First Name</Th>
                  <Td>{userView.user_name?.first_name || '—'}</Td>
                </tr>
                <tr>
                  <Th>Last Name</Th>
                  <Td>{userView.user_name?.last_name || '—'}</Td>
                </tr>
                <tr>
                  <Th>Email</Th>
                  <Td>{userView.email_address || '—'}</Td>
                </tr>
                <tr>
                  <Th>Phone</Th>
                  <Td>{userView.phone_number || '—'}</Td>
                </tr>
              </tbody>
            </Table>
            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Button onClick={() => setUserView(null)}>Close</Button>
            </div>
          </Modal>
        </Overlay>
      )}

      {/* ================= PURIFIER DETAILS MODAL ================= */}
      {view && (
        <Overlay onClick={() => setView(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <h3>Purifier Details</h3>
            <Hr />
            <Table>
              <tbody>
                <tr>
                  <Th>Installed At</Th>
                  <Td>{formatIST(view.installed_at)}</Td>
                </tr>
                <tr>
                  <Th>Last Service Date</Th>
                  <Td>{formatIST(view.last_service_date)}</Td>
                </tr>
                <tr>
                  <Th>Connectivity Status</Th>
                  <Td>{view.connectivity_status || '—'}</Td>
                </tr>
                <tr>
                  <Th>Firmware Version</Th>
                  <Td>{view.firmware_version || 'v1.0'}</Td>
                </tr>
                <tr>
                  <Th>Is Locked</Th>
                  <Td>{view.is_locked ? 'Yes' : 'No'}</Td>
                </tr>
                <tr>
                  <Th>Deregistered At</Th>
                  <Td>{formatIST(view.deregistered_at)}</Td>
                </tr>
                <tr>
                  <Th>Replaced Module History</Th>
                  <Td>
                    {view.replaced_module_history?.length
                      ? view.replaced_module_history.join(', ')
                      : '—'}
                  </Td>
                </tr>
                <tr>
                  <Th>Flow Sensor Count</Th>
                  <Td>{view.flow_sensor_count ?? '—'}</Td>
                </tr>
                <tr>
                  <Th>TDS High</Th>
                  <Td>{view.tds_high ?? '—'}</Td>
                </tr>
                <tr>
                  <Th>TDS Low</Th>
                  <Td>{view.tds_low ?? '—'}</Td>
                </tr>
                <tr>
                  <Th>Filter Life</Th>
                  <Td>{view.filter_life ?? '—'}</Td>
                </tr>
                <tr>
                  <Th>Module Physical ID</Th>
                  <Td>{view.module_physical_id || '—'}</Td>
                </tr>
              </tbody>
            </Table>

            <div style={{ textAlign: 'right', marginTop: 16 }}>
              <Button onClick={() => setView(null)}>Close</Button>
            </div>
          </Modal>
        </Overlay>
      )}
    </HeadAdminNavbar>
  );
}
