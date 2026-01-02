import React, { useEffect, useMemo, useState } from 'react';
import axios from '../../utils/axiosConfig';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

/* =========================
   STYLES
========================= */

const Page = styled.div`
  padding: 32px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Search = styled.input`
  padding: 10px 14px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  font-size: 13px;
  min-width: 240px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;

const DownloadBtn = styled.button`
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #059669, #10b981);
  color: white;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  box-shadow: 0 10px 20px rgba(5, 150, 105, 0.35);

  &:hover {
    transform: translateY(-2px);
  }
`;

const TableWrap = styled.div`
  background: white;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #475569;
  background: #f8fafc;
  border-bottom: 2px solid #e5e7eb;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px;
  font-size: 13px;
  border-top: 1px solid #e5e7eb;
  vertical-align: top;
`;

const Select = styled.select`
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 12px;
`;

const ActionBtn = styled.button`
  padding: 6px 14px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background: #1d4ed8;
  }
`;

const Empty = styled.div`
  padding: 40px;
  text-align: center;
  color: #64748b;
`;

const KycLink = styled.span`
  color: #2563eb;
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
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
  background: ${(p) => (p.active ? '#2563eb' : '#ffffff')};
  color: ${(p) => (p.active ? '#ffffff' : '#0f172a')};
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    border-color: #2563eb;
  }
`;

/* =========================
   COMPONENT
========================= */

export default function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 8;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/headadmin/customers');
      setCustomers(res.data.customers || []);
    } catch {
      alert('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ADDRESS FORMATTER
  ========================= */

  const formatAddress = (address = {}) =>
    [
      address.flat_no,
      address.area,
      address.city,
      address.state,
      address.country &&
        `${address.country}${address.postal_code ? ' - ' + address.postal_code : ''}`,
    ]
      .filter(Boolean)
      .join(', ') || '—';

  /* =========================
     SEARCH + PAGINATION
  ========================= */

  const filtered = useMemo(() => {
    return customers.filter((c) =>
      `
        ${c.user_name?.first_name || ''}
        ${c.user_name?.last_name || ''}
        ${c.email_address || ''}
        ${c.phone_number || ''}
      `
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [customers, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const paginated = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  /* =========================
     CSV DOWNLOAD
  ========================= */

  const downloadCSV = () => {
    const rows = [
      [
        'First Name',
        'Last Name',
        'Email',
        'Phone',
        'Address',
        'KYC Status',
        'Device Status',
      ],
      ...filtered.map((c) => [
        c.user_name?.first_name || '',
        c.user_name?.last_name || '',
        c.email_address || '',
        c.phone_number || '',
        formatAddress(c.address),
        c.kyc_details?.kyc_approval_status || '',
        c.user_device_status || '',
      ]),
    ];

    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  /* =========================
     UPDATE HANDLERS
  ========================= */

  const updateLocal = (id, field, value) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c._id === id
          ? field === 'kyc'
            ? {
                ...c,
                kyc_details: {
                  ...(c.kyc_details || {}),
                  kyc_approval_status: value,
                },
              }
            : { ...c, user_device_status: value }
          : c
      )
    );
  };

  const submitUpdate = async (customer) => {
    try {
      if (customer.kyc_details?.kyc_approval_status) {
        await axios.patch(
          `/api/headadmin/customers/${customer._id}/kyc`,
          { status: customer.kyc_details.kyc_approval_status }
        );
      }

      if (customer.user_device_status) {
        await axios.patch(
          `/api/headadmin/customers/${customer._id}/device-status`,
          { status: customer.user_device_status }
        );
      }

      fetchCustomers();
      alert('Customer updated');
    } catch {
      alert('Update failed');
    }
  };

  /* =========================
     RENDER
  ========================= */

  return (
    <HeadAdminNavbar>
      <Page>
        <Header>
          <Title>Customers ({filtered.length})</Title>

          <Toolbar>
            <Search
              placeholder="Search customers..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <DownloadBtn onClick={downloadCSV}>
              Download CSV
            </DownloadBtn>
          </Toolbar>
        </Header>

        {loading ? (
          <Empty>Loading customers...</Empty>
        ) : filtered.length === 0 ? (
          <Empty>No customers found</Empty>
        ) : (
          <>
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <Th>First Name</Th>
                    <Th>Last Name</Th>
                    <Th>Email</Th>
                    <Th>Phone</Th>
                    <Th>Address</Th>
                    <Th>KYC</Th>
                    <Th>KYC Status</Th>
                    <Th>Device Status</Th>
                    <Th>Action</Th>
                  </tr>
                </thead>

                <tbody>
                  {paginated.map((c) => (
                    <tr key={c._id}>
                      <Td>{c.user_name?.first_name || '—'}</Td>
                      <Td>{c.user_name?.last_name || '—'}</Td>
                      <Td>{c.email_address || '—'}</Td>
                      <Td>{c.phone_number || '—'}</Td>
                      <Td title={formatAddress(c.address)}>
                        {formatAddress(c.address)}
                      </Td>

                      <Td>
                        {c.kyc_details?.doc_image ? (
                          <KycLink
                            onClick={() =>
                              navigate(`/headadmin/customers/${c._id}/kyc`)
                            }
                          >
                            View
                          </KycLink>
                        ) : (
                          'Pending'
                        )}
                      </Td>

                      <Td>
                        <Select
                          value={c.kyc_details?.kyc_approval_status || ''}
                          onChange={(e) =>
                            updateLocal(c._id, 'kyc', e.target.value)
                          }
                        >
                          <option value="">pending</option>
                          <option value="approved">approved</option>
                          <option value="rejected">rejected</option>
                        </Select>
                      </Td>

                      <Td>
                        <Select
                          value={c.user_device_status || ''}
                          onChange={(e) =>
                            updateLocal(c._id, 'device', e.target.value)
                          }
                        >
                          <option value="">—</option>
                          <option value="linked">linked</option>
                          <option value="unlinked">unlinked</option>
                          <option value="declined">declined</option>
                        </Select>
                      </Td>

                      <Td>
                        <ActionBtn onClick={() => submitUpdate(c)}>
                          Submit
                        </ActionBtn>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>

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
        )}
      </Page>
    </HeadAdminNavbar>
  );
}
