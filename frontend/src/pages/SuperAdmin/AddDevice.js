import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  getOrganizations,
  createDevice,
} from '../../services/superAdminService';
import SuperAdminNavbar from '../../components/Navbar/SuperAdminNavbar';

const Page = styled.div`max-width:700px;margin:auto;`;
const Card = styled.div`background:white;padding:24px;border-radius:12px;`;
const Field = styled.div`display:flex;flex-direction:column;margin-bottom:16px;`;
const Input = styled.input`padding:10px;border:1px solid #cbd5e1;border-radius:6px;`;
const Select = styled.select`padding:10px;border:1px solid #cbd5e1;border-radius:6px;`;
const Button = styled.button`
  padding:10px 18px;border:none;border-radius:6px;
  background:#2563eb;color:white;font-weight:600;
`;

const AddDevice = () => {
  const navigate = useNavigate();
  const [orgs, setOrgs] = useState([]);
  const [form, setForm] = useState({
    organization: '',
    macId: '',
    serialNumber: '',
  });

  useEffect(() => {
    getOrganizations().then(res => setOrgs(res.data || []));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    await createDevice(form);
    alert('Device added');
    navigate('/super-admin/device');
  };

  return (
    <SuperAdminNavbar>
      <Page>
        <Card>
          <h2>Add Device</h2>

          <form onSubmit={handleSubmit}>
            <Field>
              <label>Organization</label>
              <Select
                required
                value={form.organization}
                onChange={e =>
                  setForm({ ...form, organization: e.target.value })
                }
              >
                <option value="">Select</option>
                {orgs.map(o => (
                  <option key={o._id} value={o._id}>
                    {o.organizationName}
                  </option>
                ))}
              </Select>
            </Field>

            <Field>
              <label>MAC ID</label>
              <Input
                required
                value={form.macId}
                onChange={e => setForm({ ...form, macId: e.target.value })}
              />
            </Field>

            <Field>
              <label>Serial Number</label>
              <Input
                required
                value={form.serialNumber}
                onChange={e =>
                  setForm({ ...form, serialNumber: e.target.value })
                }
              />
            </Field>

            <Button type="submit">Save</Button>
          </form>
        </Card>
      </Page>
    </SuperAdminNavbar>
  );
};

export default AddDevice;
