import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import {
  getDevices,
  getOrganizations,
} from '../../services/superAdminService';
import SuperAdminNavbar from '../../components/Navbar/SuperAdminNavbar';

/* ================= STYLES ================= */
const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  color: white;
  background: #2563eb;
`;

const SearchRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const SearchBox = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  width: 280px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 12px;
  background: #f8fafc;
  text-align: left;
  font-size: 0.85rem;
  color: #475569;
`;

const Td = styled.td`
  padding: 12px;
  border-top: 1px solid #e5e7eb;
`;

const Empty = styled.div`
  padding: 24px;
  text-align: center;
  color: #64748b;
`;

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalBox = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
`;

/* ================= COMPONENT ================= */
const Devices = () => {
  const navigate = useNavigate();

  const [devices, setDevices] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [search, setSearch] = useState('');
  const [orgSearch, setOrgSearch] = useState('');
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [deviceRes, orgRes] = await Promise.all([
        getDevices(),
        getOrganizations(),
      ]);

      setDevices(deviceRes.data || []);
      setOrganizations(orgRes.data || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  /* ================= ORG MAP ================= */
  const orgMap = useMemo(() => {
    const map = {};
    organizations.forEach((o) => {
      map[o.org_id] = o.org_name;
    });
    return map;
  }, [organizations]);

  /* ================= FILTER ================= */
  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      const deviceText = `${d.mac_id || ''} ${d.serial_number || ''}`.toLowerCase();
      const orgText = `${d.org_id || ''} ${orgMap[d.org_id] || ''}`.toLowerCase();

      return (
        deviceText.includes(search.toLowerCase()) &&
        orgText.includes(orgSearch.toLowerCase())
      );
    });
  }, [devices, search, orgSearch, orgMap]);

  /* ================= UI ================= */
  return (
    <SuperAdminNavbar>
      <Page>
        <TopBar>
          <h2>Devices</h2>
          <Actions>
            <Button onClick={() => navigate('/superadmin/devices/add')}>
              Add Device
            </Button>
          </Actions>
        </TopBar>

        <SearchRow>
          <SearchBox
            placeholder="Search MAC / Serial"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchBox
            placeholder="Search Org Name / Org ID"
            value={orgSearch}
            onChange={(e) => setOrgSearch(e.target.value)}
          />
        </SearchRow>

        <Card>
          {loading ? (
            <Empty>Loading devices…</Empty>
          ) : filteredDevices.length === 0 ? (
            <Empty>No devices found</Empty>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>#</Th>
                  <Th>Organization</Th>
                  <Th>Org ID</Th>
                  <Th>MAC ID</Th>
                  <Th>Serial Number</Th>
                  <Th>QR Code</Th>
                </tr>
              </thead>

              <tbody>
                {filteredDevices.map((d, index) => (
                  <tr key={d._id}>
                    <Td>{index + 1}</Td>
                    <Td>{orgMap[d.org_id] || '—'}</Td>
                    <Td>{d.org_id}</Td>
                    <Td>{d.mac_id}</Td>
                    <Td>{d.serial_number}</Td>
                    <Td>
                      <span
                        style={{
                          color: '#2563eb',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                        onClick={() => setQrData(d.qr_code)}
                      >
                        View
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card>

        {/* ================= QR MODAL ================= */}
        {qrData && (
          <Modal onClick={() => setQrData(null)}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
              <QRCode value={qrData} />
            </ModalBox>
          </Modal>
        )}
      </Page>
    </SuperAdminNavbar>
  );
};

export default Devices;
