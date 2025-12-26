import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import QRCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';
import { getDevices } from '../../services/superAdminService';
import SuperAdminNavbar from '../../components/Navbar/SuperAdminNavbar';

/* ================= STYLES ================= */
const Page = styled.div`display:flex;flex-direction:column;gap:20px;`;
const TopBar = styled.div`display:flex;justify-content:space-between;align-items:center;`;
const Actions = styled.div`display:flex;gap:10px;`;
const Button = styled.button`
  padding:8px 14px;border-radius:6px;border:none;
  font-weight:600;cursor:pointer;color:white;background:#2563eb;
`;
const SearchRow = styled.div`display:flex;gap:16px;`;
const SearchBox = styled.input`
  padding:10px;border-radius:6px;border:1px solid #cbd5e1;width:280px;
`;
const Card = styled.div`
  background:white;border-radius:12px;border:1px solid #e5e7eb;padding:20px;
`;
const Table = styled.table`width:100%;border-collapse:collapse;`;
const Th = styled.th`
  padding:12px;background:#f8fafc;text-align:left;font-size:0.85rem;
`;
const Td = styled.td`padding:12px;border-top:1px solid #e5e7eb;`;

const Modal = styled.div`
  position:fixed;top:0;left:0;width:100%;height:100%;
  background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;
`;
const ModalBox = styled.div`
  background:white;padding:24px;border-radius:12px;
`;

/* ================= COMPONENT ================= */
const Devices = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState('');
  const [orgSearch, setOrgSearch] = useState('');
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    const res = await getDevices();
    setDevices(res.data || []);
  };

  const filtered = devices.filter(d =>
    `${d.macId} ${d.serialNumber}`.toLowerCase().includes(search.toLowerCase()) &&
    (d.organization?.organizationName || '')
      .toLowerCase()
      .includes(orgSearch.toLowerCase())
  );

  return (
    <SuperAdminNavbar>
      <Page>
        <TopBar>
          <h2>Devices</h2>
          <Actions>
            <Button onClick={() => navigate('/super-admin/addDevice')}>
              Add Device
            </Button>
            <Button>Download</Button>
          </Actions>
        </TopBar>

        <SearchRow>
          <SearchBox
            placeholder="Search MAC / Serial"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <SearchBox
            placeholder="Search Organization"
            value={orgSearch}
            onChange={e => setOrgSearch(e.target.value)}
          />
        </SearchRow>

        <Card>
          <Table>
            <thead>
              <tr>
                <Th>S.No</Th>
                <Th>Organization</Th>
                <Th>MAC ID</Th>
                <Th>Serial Number</Th>
                <Th>QR Code</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d._id}>
                  <Td>{i + 1}</Td>
                  <Td>{d.organization?.organizationName}</Td>
                  <Td>{d.macId}</Td>
                  <Td>{d.serialNumber}</Td>
                  <Td>
                    <span
                      style={{ color: '#2563eb', cursor: 'pointer' }}
                      onClick={() => setQrData(d.qrCode)}
                    >
                      Click here
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        {qrData && (
          <Modal onClick={() => setQrData(null)}>
            <ModalBox onClick={e => e.stopPropagation()}>
              <QRCode value={qrData} />
            </ModalBox>
          </Modal>
        )}
      </Page>
    </SuperAdminNavbar>
  );
};

export default Devices;
