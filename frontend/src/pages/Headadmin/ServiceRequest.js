import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import {
  getServiceRequests,
  getAvailableServiceTechnicians,
  assignServiceTechnician,
  updateServiceRequestStatus,
} from '../../services/headAdminService';

/* =========================
   LAYOUT
========================= */
const Page = styled.div`
  background: #f8fafc;
  min-height: calc(100vh - 64px);
`;

const Container = styled.div`
  max-width: 1800px;
  margin: auto;
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-weight: 700;
`;

/* =========================
   SEARCH & FILTER
========================= */
const Filters = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  width: 280px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
`;

/* =========================
   TABLE
========================= */
const TableWrapper = styled.div`
  background: white;
  border-radius: 14px;
  overflow-x: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.08);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px;
  background: #f1f5f9;
  font-size: 12px;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 13px;
  white-space: nowrap;
`;

/* =========================
   BADGE
========================= */
const Badge = styled.span`
  margin-left: 8px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: #dbeafe;
`;

/* =========================
   MODAL
========================= */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`;

const Modal = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 760px;
  max-height: 85vh;
  overflow-y: auto;
`;

const CloseBtn = styled.button`
  float: right;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
`;

const ImgGrid = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Img = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
`;

/* =========================
   HELPERS
========================= */
const formatDate = (val) => {
  if (!val) return '-';
  const d = new Date(val);
  return isNaN(d) ? '-' : d.toLocaleString();
};

/* =========================
   COMPONENT
========================= */
const ServiceRequest = () => {
  const [requests, setRequests] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD REQUESTS
  ========================= */
  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await getServiceRequests({
        search,
        status: filterStatus,
      });
      setRequests(res.data || []);
    } catch (error) {
      console.error('❌ Failed to load service requests', error);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOAD TECHNICIANS
  ========================= */
  const loadTechnicians = async () => {
    try {
      const res = await getAvailableServiceTechnicians();
      setTechnicians(res.data || []);
    } catch (error) {
      console.error('❌ Failed to load technicians', error);
    }
  };

  useEffect(() => {
    loadRequests();
    loadTechnicians();
  }, [filterStatus]);

  /* =========================
     ACTIONS
  ========================= */
  const handleStatusChange = async (id, newStatus) => {
    if (!newStatus) return;
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;

    await updateServiceRequestStatus(id, newStatus);
    loadRequests();
    loadTechnicians();
  };

  const handleAssignTech = async (requestId, techId) => {
    if (!techId) return;

    const tech = technicians.find((t) => t._id === techId);
    if (
      !window.confirm(
        `Assign technician ${tech?.user_name?.first_name || ''} ${tech?.user_name?.last_name || ''}?`
      )
    )
      return;

    await assignServiceTechnician(requestId, techId);
    loadRequests();
    loadTechnicians();
  };

  return (
    <>
      <HeadAdminNavbar />

      <Page>
        <Container>
          <Header>
            <Title>Service Requests</Title>
          </Header>

          <Filters>
            <Input
              placeholder="Search Device ID / User Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadRequests()}
            />

            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="assigned">Assigned</option>
              <option value="closed">Closed</option>
            </Select>
          </Filters>

          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>#</Th>
                  <Th>User</Th>
                  <Th>Device ID</Th>
                  <Th>Service Type</Th>
                  <Th>Location</Th>
                  <Th>Status</Th>
                  <Th>Assigned Technician</Th>
                  <Th>Fixed By</Th>
                  <Th>View</Th>
                </tr>
              </thead>

              <tbody>
                {loading && (
                  <tr>
                    <Td colSpan="9">Loading...</Td>
                  </tr>
                )}

                {!loading &&
                  requests.map((r, i) => (
                    <tr key={r._id}>
                      <Td>{i + 1}</Td>
                      <Td>{r.user_name || 'Guest User'}</Td>
                      <Td>{r.device_id}</Td>
                      <Td>{r.request_type}</Td>
                      <Td>
                        {[r.location?.street,
                          r.location?.area,
                          r.location?.city,
                          r.location?.state,
                          r.location?.country,
                          r.location?.postal_code]
                          .filter(Boolean)
                          .join(', ')}
                      </Td>

                      <Td>
                        <Select
                          value={r.status}
                          disabled={r.status === 'closed'}
                          onChange={(e) =>
                            handleStatusChange(r._id, e.target.value)
                          }
                        >
                          <option value="open">Open</option>
                          <option value="assigned">Assigned</option>
                          <option value="closed">Closed</option>
                        </Select>
                      </Td>

                      <Td>
                        {r.status === 'closed' ? (
                          <span style={{ color: '#64748b' }}>Closed</span>
                        ) : r.assigned_technician_name ? (
                          <>
                            {r.assigned_technician_name}
                            <Badge>Assigned</Badge>
                          </>
                        ) : (
                          <Select
                            onChange={(e) =>
                              handleAssignTech(r._id, e.target.value)
                            }
                          >
                            <option value="">Assign Technician</option>
                            {technicians.map((t) => (
                              <option key={t._id} value={t._id}>
                                {`${t.user_name?.first_name || ''} ${t.user_name?.last_name || ''}`}
                              </option>
                            ))}
                          </Select>
                        )}
                      </Td>

                      <Td>
                        {r.status === 'closed'
                          ? r.fixed_by_name || '—'
                          : '—'}
                      </Td>

                      <Td>
                        <button onClick={() => setSelected(r)}>
                          View More
                        </button>
                      </Td>
                    </tr>
                  ))}

                {!loading && requests.length === 0 && (
                  <tr>
                    <Td colSpan="9">No service requests found</Td>
                  </tr>
                )}
              </tbody>
            </Table>
          </TableWrapper>
        </Container>
      </Page>

      {/* VIEW MORE MODAL */}
      {selected && (
        <Overlay>
          <Modal>
            <CloseBtn onClick={() => setSelected(null)}>✕</CloseBtn>

            <h3>Service Details</h3>

            <p><b>Description:</b> {selected.description}</p>
            <p><b>Scheduled At:</b> {formatDate(selected.scheduled_at)}</p>
            <p><b>Arrival At:</b> {formatDate(selected.arrived_at)}</p>
            <p><b>Completed At:</b> {formatDate(selected.completed_at)}</p>
            <p><b>Fixed By:</b> {selected.fixed_by?.technician_name || '—'}</p>
            <p><b>Observation:</b> {selected.observations}</p>

            <p><b>Replaced Parts:</b></p>
            <ul>
              {selected.replaced_parts?.length
                ? selected.replaced_parts.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))
                : <li>None</li>}
            </ul>

            <p><b>Completion Images:</b></p>
            <ImgGrid>
              {selected.completion_images?.length ? (
                selected.completion_images.map((img, i) => (
                  <Img
                    key={i}
                    src={`http://localhost:5000/uploads/serviceimage/${img}`}
                    alt="completion"
                  />
                ))
              ) : (
                'No images'
              )}
            </ImgGrid>
          </Modal>
        </Overlay>
      )}
    </>
  );
};

export default ServiceRequest;
