import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  getOrganizations,
  createDevice,
} from '../../services/superAdminService';
import SuperAdminNavbar from '../../components/Navbar/SuperAdminNavbar';

/* =========================
   STYLES
========================= */
const Page = styled.div`
  max-width: 700px;
  margin: auto;
  padding: 24px;
`;

const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-weight: 700;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
`;

const Select = styled.select`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
`;

const ButtonBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 10px 18px;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  color: white;
  background: ${(p) => (p.$cancel ? '#64748b' : '#2563eb')};
`;

/* =========================
   COMPONENT
========================= */
const AddDevice = () => {
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    organization: '', // org _id (for UI selection)
    org_id: '',       // auto-filled
    mac_id: '',
    serial_number: '',
  });

  /* =========================
     LOAD ORGANIZATIONS
  ========================= */
  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      const res = await getOrganizations();
      setOrganizations(res.data || []);
    } catch {
      alert('Failed to load organizations');
    }
  };

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'organization') {
      const selectedOrg = organizations.find(
        (o) => o._id === value
      );

      setForm((prev) => ({
        ...prev,
        organization: value,
        org_id: selectedOrg?.org_id || '',
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.org_id || !form.mac_id || !form.serial_number) {
      alert('Organization, MAC ID and Serial Number are required');
      return;
    }

    try {
      setLoading(true);

      await createDevice({
        org_id: form.org_id, // ✅ only org_id sent
        mac_id: form.mac_id,
        serial_number: form.serial_number,
      });

      alert('Device added successfully');
      navigate('/super-admin/device');
    } catch (err) {
      alert(
        err?.response?.data?.message || 'Failed to add device'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SuperAdminNavbar>
      <Page>
        <Card>
          <Title>Add Device</Title>

          <form onSubmit={handleSubmit}>
            {/* ORGANIZATION */}
            <Field>
              <Label>Organization</Label>
              <Select
                name="organization"
                value={form.organization}
                onChange={handleChange}
                required
              >
                <option value="">Select Organization</option>
                {organizations.map((org) => (
                  <option key={org._id} value={org._id}>
                    {org.org_name}
                  </option>
                ))}
              </Select>
            </Field>

            {/* ORG ID (AUTO) */}
            <Field>
              <Label>Organization ID</Label>
              <Input value={form.org_id} disabled />
            </Field>

            {/* MAC ID */}
            <Field>
              <Label>MAC ID</Label>
              <Input
                name="mac_id"
                value={form.mac_id}
                onChange={handleChange}
                placeholder="AA:BB:CC:DD:EE:FF"
                required
              />
            </Field>

            {/* SERIAL NUMBER */}
            <Field>
              <Label>Serial Number</Label>
              <Input
                name="serial_number"
                value={form.serial_number}
                onChange={handleChange}
                placeholder="SN-000123"
                required
              />
            </Field>

            <ButtonBar>
              <Button
                type="button"
                $cancel
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </ButtonBar>
          </form>
        </Card>
      </Page>
    </SuperAdminNavbar>
  );
};

export default AddDevice;
