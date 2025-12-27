import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { getCustomers } from '../../services/superAdminService';
import SuperAdminNavbar from '../../components/Navbar/SuperAdminNavbar';

/* =========================
   STYLES
========================= */
const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

const Title = styled.h2`
  font-weight: 700;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 20px;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 16px;
`;

const SearchBox = styled.input`
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  width: 280px;
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

const EmptyText = styled.div`
  padding: 20px;
  text-align: center;
  color: #64748b;
`;

/* =========================
   COMPONENT
========================= */
const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [orgSearch, setOrgSearch] = useState('');

  /* =========================
     LOAD CUSTOMERS
  ========================= */
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await getCustomers();
      setCustomers(res.data || []);
    } catch (error) {
      alert('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FILTERED DATA
  ========================= */
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const customerText = `
        ${c.user_name?.first_name || ''}
        ${c.user_name?.last_name || ''}
        ${c.email_address || ''}
        ${c.phone_number || ''}
      `.toLowerCase();

      const orgText = (c.org_name || '').toLowerCase();

      return (
        customerText.includes(customerSearch.toLowerCase()) &&
        orgText.includes(orgSearch.toLowerCase())
      );
    });
  }, [customers, customerSearch, orgSearch]);

  return (
    <SuperAdminNavbar>
      <Page>
        <Title>Customers</Title>

        {/* SEARCH */}
        <SearchRow>
          <SearchBox
            placeholder="Search customer..."
            value={customerSearch}
            onChange={(e) => setCustomerSearch(e.target.value)}
          />

          <SearchBox
            placeholder="Search organization..."
            value={orgSearch}
            onChange={(e) => setOrgSearch(e.target.value)}
          />
        </SearchRow>

        {/* TABLE */}
        <Card>
          {loading ? (
            <EmptyText>Loading customers...</EmptyText>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>S.No</Th>
                  <Th>Organization</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>City</Th>
                  <Th>State</Th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((c, index) => (
                  <Tr key={c._id}>
                    <Td>{index + 1}</Td>
                    <Td>{c.org_name || '—'}</Td>
                    <Td>
                      {c.user_name?.first_name || c.user_name?.last_name
                        ? `${c.user_name.first_name || ''} ${
                            c.user_name.last_name || ''
                          }`
                        : '—'}
                    </Td>
                    <Td>{c.email_address || '—'}</Td>
                    <Td>{c.phone_number || '—'}</Td>
                    <Td>{c.address?.city || '—'}</Td>
                    <Td>{c.address?.state || '—'}</Td>
                  </Tr>
                ))}

                {filteredCustomers.length === 0 && (
                  <tr>
                    <Td colSpan="7">
                      <EmptyText>No customers found</EmptyText>
                    </Td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </Card>
      </Page>
    </SuperAdminNavbar>
  );
};

export default Customer;
