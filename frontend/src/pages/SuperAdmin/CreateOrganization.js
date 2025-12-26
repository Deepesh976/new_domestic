import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { createOrganization } from '../../services/superAdminService';
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
  background: ${(p) => (p.$cancel ? '#64748b' : '#059669')};
`;

/* =========================
   COMPONENT
========================= */
const CreateOrganization = () => {
  const navigate = useNavigate();

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
    country: 'India',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createOrganization(form); // ✅ JSON only
      alert('Organization created successfully');
      navigate('/super-admin/org');
    } catch (err) {
      if (err.response?.status === 409) {
        alert('Organization already registered');
      } else {
        alert('Failed to create organization');
      }
    }
  };

  return (
    <SuperAdminNavbar>
      <Page>
        <Card>
          <Title>Create Organization</Title>

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
                  required
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
              <Button
                type="button"
                $cancel
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </ButtonBar>
          </form>
        </Card>
      </Page>
    </SuperAdminNavbar>
  );
};

export default CreateOrganization;
