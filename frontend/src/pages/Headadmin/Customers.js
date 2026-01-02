import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

/* =========================
   STYLES
========================= */
const Page = styled.div`
  padding: 24px;
`;

const Title = styled.h2`
  margin-bottom: 16px;
  font-weight: 700;
`;

const TableWrap = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 10px;
  background: #f8fafc;
  font-size: 0.75rem;
  text-align: left;
  color: #475569;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 10px;
  font-size: 0.8rem;
  border-top: 1px solid #e5e7eb;
  vertical-align: top;
`;

const Select = styled.select`
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 0.8rem;
`;

const Button = styled.button`
  padding: 6px 14px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;

  &:hover {
    background: #1d4ed8;
  }
`;

const Empty = styled.div`
  padding: 24px;
  text-align: center;
  color: #64748b;
`;

const KycLink = styled.span`
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #1d4ed8;
  }
`;

/* =========================
   COMPONENT
========================= */
export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH CUSTOMERS
  ========================= */
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/headadmin/customers');
      setCustomers(res.data.customers || []);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          'Failed to load customers'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  /* =========================
     UPDATE LOCAL STATE
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
            : {
                ...c,
                user_device_status: value,
              }
          : c
      )
    );
  };

  /* =========================
     SUBMIT UPDATE
  ========================= */
  const submitUpdate = async (customer) => {
    try {
      if (customer.kyc_details?.kyc_approval_status) {
        await axios.patch(
          `/api/headadmin/customers/${customer._id}/kyc`,
          {
            status: customer.kyc_details.kyc_approval_status,
          }
        );
      }

      if (customer.user_device_status) {
        await axios.patch(
          `/api/headadmin/customers/${customer._id}/device-status`,
          {
            status: customer.user_device_status,
          }
        );
      }

      await fetchCustomers();
      alert('Customer updated successfully');
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          'Failed to update customer'
      );
    }
  };

  /* =========================
     ADDRESS FORMATTER
  ========================= */
  const formatAddress = (address = {}) => {
    return (
      [
        address.flat_no,
        address.area,
        address.city,
        address.state,
        address.country &&
          `${address.country}${
            address.postal_code
              ? ' - ' + address.postal_code
              : ''
          }`,
      ]
        .filter(Boolean)
        .join(', ') || '—'
    );
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <HeadAdminNavbar>
      <Page>
        <Title>Customers</Title>

        {loading ? (
          <Empty>Loading customers...</Empty>
        ) : customers.length === 0 ? (
          <Empty>No customers found</Empty>
        ) : (
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
                {customers.map((c) => (
                  <tr key={c._id}>
                    <Td>{c.user_name?.first_name || '—'}</Td>
                    <Td>{c.user_name?.last_name || '—'}</Td>
                    <Td>{c.email_address || '—'}</Td>
                    <Td>{c.phone_number || '—'}</Td>

                    <Td title={formatAddress(c.address)}>
                      {formatAddress(c.address)}
                    </Td>

                    {/* ✅ KYC IMAGE COLUMN */}
                    <Td>
                      {c.kyc_details?.doc_image ? (
                        <KycLink
                          onClick={() =>
                            navigate(
                              `/headadmin/customers/${c._id}/kyc`
                            )
                          }
                        >
                          Click Me
                        </KycLink>
                      ) : (
                        <span style={{ color: '#64748b' }}>
                          Pending
                        </span>
                      )}
                    </Td>

                    {/* KYC STATUS */}
                    <Td>
                      <Select
                        value={
                          c.kyc_details?.kyc_approval_status || ''
                        }
                        onChange={(e) =>
                          updateLocal(
                            c._id,
                            'kyc',
                            e.target.value
                          )
                        }
                      >
                        <option value="">pending</option>
                        <option value="approved">approved</option>
                        <option value="rejected">rejected</option>
                      </Select>
                    </Td>

                    {/* DEVICE STATUS */}
                    <Td>
                      <Select
                        value={c.user_device_status || ''}
                        onChange={(e) =>
                          updateLocal(
                            c._id,
                            'device',
                            e.target.value
                          )
                        }
                      >
                        <option value="">—</option>
                        <option value="linked">linked</option>
                        <option value="unlinked">unlinked</option>
                        <option value="declined">declined</option>
                      </Select>
                    </Td>

                    <Td>
                      <Button onClick={() => submitUpdate(c)}>
                        Submit
                      </Button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
        )}
      </Page>
    </HeadAdminNavbar>
  );
}
