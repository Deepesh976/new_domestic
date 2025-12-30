import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import {
  getTechnicians,
  updateTechnician,
} from '../../services/headAdminService';

/* =========================
   PAGE LAYOUT
========================= */

const Page = styled.div`
  background: #f8fafc;
  min-height: calc(100vh - 64px);
`;

const Container = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  padding: 24px;
`;

const Title = styled.h2`
  font-weight: 700;
  margin-bottom: 16px;
  color: #0f172a;
`;

/* =========================
   TABLE
========================= */

const TableWrapper = styled.div`
  background: #ffffff;
  border-radius: 14px;
  overflow-x: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 14px 16px;
  background: #f1f5f9;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  color: #475569;
`;

const Td = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  color: #334155;
`;

/* =========================
   NAME CELL
========================= */

const NameWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NameBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const FullName = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: #0f172a;
`;

const Email = styled.div`
  font-size: 12px;
  color: #64748b;
`;

/* =========================
   STATUS BADGE
========================= */

const StatusBadge = styled.span`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;

  background: ${(p) =>
    p.status === 'AVAILABLE'
      ? '#dcfce7'
      : p.status === 'ON DUTY'
      ? '#fef9c3'
      : '#fee2e2'};

  color: ${(p) =>
    p.status === 'AVAILABLE'
      ? '#166534'
      : p.status === 'ON DUTY'
      ? '#854d0e'
      : '#991b1b'};
`;

/* =========================
   INPUTS
========================= */

const Select = styled.select`
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 13px;
`;

const Button = styled.button`
  padding: 6px 14px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

/* =========================
   HELPERS
========================= */

const getTechStatusLabel = (tech) => {
  if (!tech.is_active) return 'OFFLINE';
  if (tech.work_status === 'busy') return 'ON DUTY';
  return 'AVAILABLE';
};

/* =========================
   COMPONENT
========================= */

const HeadAdminTechnicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [changes, setChanges] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTechnicians();
  }, []);

  /* =========================
     LOAD TECHNICIANS
  ========================= */
  const loadTechnicians = async () => {
    setLoading(true);
    try {
      const res = await getTechnicians();
      setTechnicians(res.data || []);
    } catch (err) {
      alert('Failed to load technicians');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     TRACK CHANGES
  ========================= */
  const handleChange = (id, field, value) => {
    setChanges((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  /* =========================
     SUBMIT UPDATE
  ========================= */
  const handleSubmit = async (tech) => {
    const status = getTechStatusLabel(tech);

    if (status === 'ON DUTY') {
      alert('ON DUTY technician cannot be modified');
      return;
    }

    if (!changes[tech._id]) {
      alert('No changes made');
      return;
    }

    const confirmed = window.confirm(
      `Update technician ${tech.user_name?.first_name} ${tech.user_name?.last_name}?`
    );

    if (!confirmed) return;

    try {
      await updateTechnician(tech._id, {
        is_active:
          changes[tech._id]?.is_active ?? tech.is_active,
        kyc_approval_status:
          changes[tech._id]?.kyc_approval_status ??
          tech.kyc_details?.kyc_approval_status,
      });

      alert('Technician updated successfully ✅');
      setChanges({});
      loadTechnicians();
    } catch (err) {
      alert('Failed to update technician');
    }
  };

  return (
    <>
      <HeadAdminNavbar />

      <Page>
        <Container>
          <Title>Technicians</Title>

          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Phone</Th>
                  <Th>Address</Th>
                  <Th>KYC</Th>
                  <Th>Status</Th>
                  <Th>Action</Th>
                </tr>
              </thead>

              <tbody>
                {technicians.map((tech) => {
                  const status = getTechStatusLabel(tech);

                  return (
                    <tr key={tech._id}>
                      {/* NAME */}
                      <Td>
                        <NameWrapper>
                          <Avatar>
                            {tech.user_name?.first_name?.[0]}
                            {tech.user_name?.last_name?.[0]}
                          </Avatar>

                          <NameBlock>
                            <FullName>
                              {tech.user_name?.first_name}{' '}
                              {tech.user_name?.last_name}
                            </FullName>
                            {tech.email_address && (
                              <Email>{tech.email_address}</Email>
                            )}
                          </NameBlock>
                        </NameWrapper>
                      </Td>

                      {/* PHONE */}
                      <Td>{tech.phone_number}</Td>

                      {/* ADDRESS */}
                      <Td>
                        {tech.address?.flat_no}
                        <div style={{ fontSize: 12, color: '#64748b' }}>
                          {tech.address?.area},{' '}
                          {tech.address?.city},{' '}
                          {tech.address?.state}
                        </div>
                      </Td>

                      {/* KYC */}
                      <Td>
                        <Select
                          disabled={status === 'ON DUTY'}
                          defaultValue={
                            tech.kyc_details?.kyc_approval_status ||
                            'pending'
                          }
                          onChange={(e) =>
                            handleChange(
                              tech._id,
                              'kyc_approval_status',
                              e.target.value
                            )
                          }
                        >
                          <option value="approved">Approved</option>
                          <option value="pending">Pending</option>
                          <option value="rejected">Rejected</option>
                        </Select>
                      </Td>

                      {/* STATUS */}
                      <Td>
                        <StatusBadge status={status}>
                          {status}
                        </StatusBadge>
                      </Td>

                      {/* ACTION */}
                      <Td>
                        <Button
                          disabled={status === 'ON DUTY'}
                          onClick={() => handleSubmit(tech)}
                        >
                          Update
                        </Button>
                      </Td>
                    </tr>
                  );
                })}

                {!loading && technicians.length === 0 && (
                  <tr>
                    <Td colSpan="6" style={{ textAlign: 'center' }}>
                      No technicians found
                    </Td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <Td colSpan="6" style={{ textAlign: 'center' }}>
                      Loading technicians...
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

export default HeadAdminTechnicians;
