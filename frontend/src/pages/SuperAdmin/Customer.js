import React, { useEffect, useState } from 'react';
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
  width: 300px;
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
const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [customerSearch, setCustomerSearch] = useState('');
  const [orgSearch, setOrgSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers();
      setCustomers(res.data || []);
    } catch {
      alert('Failed to load customers');
    }
  };

  /* =========================
     FILTER (CUSTOMER + ORG)
  ========================= */
  const filteredCustomers = customers.filter((c) => {
    const customerText = `
      ${c.email_address || ''}
      ${c.phone_number || ''}
      ${c.user_name?.first_name || ''}
      ${c.user_name?.last_name || ''}
    `.toLowerCase();

    const orgText = (c.org_id || '').toLowerCase();

    return (
      customerText.includes(customerSearch.toLowerCase()) &&
      orgText.includes(orgSearch.toLowerCase())
    );
  });

  return (
    <SuperAdminNavbar>
      <Page>
        <Title>Customers</Title>

        {/* SEARCH CONTAINERS */}
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

                  <Td>{c.org_id || '—'}</Td>

                  <Td>
                    {c.user_name
                      ? `${c.user_name.first_name} ${c.user_name.last_name}`
                      : '—'}
                  </Td>

                  <Td>{c.email_address || '—'}</Td>
                  <Td>{c.phone_number || '—'}</Td>
                  <Td>{c.address?.city || '—'}</Td>
                  <Td>{c.address?.state || '—'}</Td>
                </Tr>
              ))}

              {filteredCustomers.length === 0 && (
                <Tr>
                  <Td colSpan="7">No customers found</Td>
                </Tr>
              )}
            </tbody>
          </Table>
        </Card>
      </Page>
    </SuperAdminNavbar>
  );
};

export default Customer;
