import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getOrganizationById,
  updateOrganization,
} from '../../services/superAdminService';
import SuperAdminNavbar from '../../components/Navbar/SuperAdminNavbar';

/* =========================
   STYLES
========================= */
const Page = styled.div`
  max-width: 900px;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
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
const EditOrganization = () => {
  const navigate = useNavigate();
  const { organizationId } = useParams();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    org_id: '',
    org_name: '',
    type: '',
    gst_number: '',
    email_id: '',
    phone_number: '',
    state: '',
    pincode: '',
    country: '',
  });

  /* =========================
     LOAD ORGANIZATION
  ========================= */
  useEffect(() => {
    loadOrganization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  const loadOrganization = async () => {
    try {
      const res = await getOrganizationById(organizationId);
      const org = res.data;

      setForm({
        org_id: org.org_id || '',
        org_name: org.org_name || '',
        type: org.type || '',
        gst_number: org.gst_number || '',
        email_id: org.email_id || '',
        phone_number: org.phone_number || '',
        state: org.state || '',
        pincode: org.pincode || '',
        country: org.country || 'India',
      });

      setLoading(false);
    } catch (error) {
      alert('Failed to load organization');
      navigate('/super-admin/org');
    }
  };

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 IMPORTANT: remove org_id from update payload
    const { org_id, ...updatePayload } = form;

    try {
      await updateOrganization(organizationId, updatePayload);
      alert('Organization updated successfully');
      navigate('/super-admin/org');
    } catch (error) {
      alert('Failed to update organization');
    }
  };

  if (loading) {
    return (
      <SuperAdminNavbar>
        <Page>
          <Card>Loading organization...</Card>
        </Page>
      </SuperAdminNavbar>
    );
  }

  return (
    <SuperAdminNavbar>
      <Page>
        <Card>
          <Title>Edit Organization</Title>

          <form onSubmit={handleSubmit}>
            <Grid>
              {/* READ ONLY */}
              <Field>
                <Label>Organization ID</Label>
                <Input value={form.org_id} disabled />
              </Field>

              <Field>
                <Label>Organization Name *</Label>
                <Input
                  name="org_name"
                  value={form.org_name}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <Label>Organization Type</Label>
                <Input
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Label>GST Number</Label>
                <Input
                  name="gst_number"
                  value={form.gst_number}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Label>Email *</Label>
                <Input
                  type="email"
                  name="email_id"
                  value={form.email_id}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <Label>Phone Number</Label>
                <Input
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Label>State</Label>
                <Input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Label>Pincode</Label>
                <Input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Label>Country</Label>
                <Input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                />
              </Field>
            </Grid>

            <ButtonBar>
              <Button type="button" $cancel onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </ButtonBar>
          </form>
        </Card>
      </Page>
    </SuperAdminNavbar>
  );
};

export default EditOrganization;
