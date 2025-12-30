import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import axios from '../../utils/axiosConfig';

/* =========================
   PAGE LAYOUT
========================= */

const Page = styled.div`
  background: #f8fafc;
  min-height: calc(100vh - 64px);
`;

const Container = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-weight: 700;
  color: #0f172a;
`;

/* =========================
   TABLE
========================= */

const TableWrapper = styled.div`
  background: white;
  border-radius: 14px;
  overflow-x: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px;
  background: #f1f5f9;
  font-size: 12px;
  color: #475569;
  text-align: left;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px;
  font-size: 13px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
  white-space: nowrap;
`;

/* =========================
   BADGES
========================= */

const StatusBadge = styled.span`
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: ${(p) =>
    p.status === 'open'
      ? '#fef9c3'
      : p.status === 'assigned'
      ? '#dbeafe'
      : p.status === 'completed'
      ? '#dcfce7'
      : '#e5e7eb'};
  color: #1e293b;
  text-transform: capitalize;
`;

/* =========================
   COMPONENT
========================= */

const HeadAdminServiceRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH SERVICE REQUESTS
  ========================= */
  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/headadmin/service-requests');
      setRequests(res.data || []);
    } catch (err) {
      console.error('❌ Failed to fetch service requests', err);
      alert('Failed to load service requests');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeadAdminNavbar />

      <Page>
        <Container>
          <Header>
            <Title>Service Requests</Title>
          </Header>

          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Service ID</Th>
                  <Th>User ID</Th>
                  <Th>Device ID</Th>
                  <Th>Service Type</Th>
                  <Th>Description</Th>
                  <Th>Assigned To</Th>
                  <Th>Scheduled At</Th>
                  <Th>Arrived At</Th>
                  <Th>Completed At</Th>
                  <Th>Status</Th>
                  <Th>Replaced Parts</Th>
                  <Th>Completion Images</Th>
                  <Th>Location</Th>
                  <Th>Observation</Th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <Td colSpan="14" style={{ textAlign: 'center' }}>
                      Loading service requests...
                    </Td>
                  </tr>
                )}

                {!loading &&
                  requests.map((r) => (
                    <tr key={r._id}>
                      <Td>{r.request_id}</Td>
                      <Td>{r.user_id || '-'}</Td>
                      <Td>{r.device_id || '-'}</Td>
                      <Td>{r.request_type || '-'}</Td>
                      <Td>{r.description || '-'}</Td>
                      <Td>{r.assigned_to || '-'}</Td>
                      <Td>{r.scheduled_at || '-'}</Td>
                      <Td>{r.arrived_at || '-'}</Td>
                      <Td>{r.completed_at || '-'}</Td>
                      <Td>
                        <StatusBadge status={r.status}>
                          {r.status || 'open'}
                        </StatusBadge>
                      </Td>
                      <Td>
                        {r.replaced_parts?.length
                          ? r.replaced_parts.join(', ')
                          : '-'}
                      </Td>
                      <Td>
                        {r.completion_images?.length
                          ? `${r.completion_images.length} image(s)`
                          : '-'}
                      </Td>
                      <Td>
                        {[
                          r.location?.street,
                          r.location?.area,
                          r.location?.city,
                          r.location?.state,
                          r.location?.postal_code,
                          r.location?.country,
                        ]
                          .filter(Boolean)
                          .join(', ') || '-'}
                      </Td>
                      <Td>{r.observations || '-'}</Td>
                    </tr>
                  ))}

                {!loading && requests.length === 0 && (
                  <tr>
                    <Td colSpan="14" style={{ textAlign: 'center' }}>
                      No service requests found
                    </Td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>
        </Container>
      </Page>
    </>
  );
};

export default HeadAdminServiceRequest;
