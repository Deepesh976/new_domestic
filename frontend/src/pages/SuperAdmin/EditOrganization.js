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
`;

const Card = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  margin-bottom: 20px;
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
  background: ${(p) => (p.cancel ? '#64748b' : '#2563eb')};
`;

/* =========================
   COMPONENT
========================= */
const EditOrganization = () => {
  const navigate = useNavigate();
  const { organizationId } = useParams();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    organizationName: '',
    type: '',
    gstNumber: '',
    emailId: '',
    phoneNumber: '',
    building: '',
    area: '',
    district: '',
    state: '',
    pincode: '',
    country: '',
  });

  useEffect(() => {
    loadOrganization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  const loadOrganization = async () => {
    try {
      const res = await getOrganizationById(organizationId);
      const org = res.data;

      setForm({
        organizationName: org.organizationName || '',
        type: org.type || '',
        gstNumber: org.gstNumber || '',
        emailId: org.emailId || '',
        phoneNumber: org.phoneNumber || '',
        building: org.building || '',
        area: org.area || '',
        district: org.district || '',
        state: org.state || '',
        pincode: org.pincode || '',
        country: org.country || '',
      });

      setLoading(false);
    } catch (error) {
      alert('Failed to load organization');
      navigate('/super-admin/org');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateOrganization(organizationId, form);
      alert('Organization updated successfully');
      navigate('/super-admin/org');
    } catch (error) {
      alert('Failed to update organization');
    }
  };

  if (loading) return null;

  return (
    <SuperAdminNavbar>
      <Page>
        <Card>
          <Title>Edit Organization</Title>

          <form onSubmit={handleSubmit}>
            <Grid>
              <Field>
                <Label>Organization Name</Label>
                <Input
                  name="organizationName"
                  value={form.organizationName}
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
                  name="gstNumber"
                  value={form.gstNumber}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="emailId"
                  value={form.emailId}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <Label>Phone Number</Label>
                <Input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Label>Building</Label>
                <Input
                  name="building"
                  value={form.building}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Label>Area</Label>
                <Input
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Label>District</Label>
                <Input
                  name="district"
                  value={form.district}
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
              <Button type="button" cancel onClick={() => navigate(-1)}>
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
