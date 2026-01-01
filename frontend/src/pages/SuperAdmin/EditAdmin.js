import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getAdminById,
  updateAdmin,
  getOrganizations,
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
  background: ${(p) => (p.disabled ? '#f8fafc' : 'white')};
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
  margin-top: 24px;
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
const EditAdmin = () => {
  const navigate = useNavigate();

  // ✅ MUST MATCH: /admins/:id/edit
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);

  const [form, setForm] = useState({
    organization: '',
    org_id: '',
    username: '',
    email: '',
    phoneNo: '',
    location: '',
    role: 'admin',
  });

  /* =========================
     LOAD ADMIN + ORGANIZATIONS
  ========================= */
  useEffect(() => {
    if (!id) {
      alert('Invalid admin ID');
      navigate('/superadmin/admins');
      return;
    }

    loadData();
    // eslint-disable-next-line
  }, [id]);

  const loadData = async () => {
    try {
      const [adminRes, orgRes] = await Promise.all([
        getAdminById(id),
        getOrganizations(),
      ]);

      const admin = adminRes.data;
      const orgs = orgRes.data || [];

      setOrganizations(orgs);

      setForm({
        organization:
          admin.organization?._id ||
          admin.organization ||
          '',
        org_id: admin.org_id || '',
        username: admin.username || '',
        email: admin.email || '',
        phoneNo: admin.phoneNo || '',
        location: admin.location || '',
        role: admin.role || 'admin',
      });

      setLoading(false);
    } catch (error) {
      console.error(error);
      alert('Failed to load admin');
      navigate('/superadmin/admins');
    }
  };

  /* =========================
     HANDLERS
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🔥 Keep org_id in sync with organization
    if (name === 'organization') {
      const selectedOrg = organizations.find(
        (org) => org._id === value
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

    try {
      await updateAdmin(id, form);
      alert('Admin updated successfully');
      navigate('/superadmin/admins');
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          'Failed to update admin'
      );
    }
  };

  if (loading) {
    return (
      <SuperAdminNavbar>
        <Page>
          <Card>Loading admin details...</Card>
        </Page>
      </SuperAdminNavbar>
    );
  }

  return (
    <SuperAdminNavbar>
      <Page>
        <Card>
          <Title>Edit Admin / Head Admin</Title>

          <form onSubmit={handleSubmit}>
            <Grid>
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

              {/* ORG ID */}
              <Field>
                <Label>Organization ID</Label>
                <Input value={form.org_id} disabled />
              </Field>

              {/* ROLE */}
              <Field>
                <Label>Role</Label>
                <Select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="admin">Admin</option>
                  <option value="headadmin">Head Admin</option>
                </Select>
              </Field>

              {/* USERNAME */}
              <Field>
                <Label>Username</Label>
                <Input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </Field>

              {/* EMAIL */}
              <Field>
                <Label>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </Field>

              {/* PHONE */}
              <Field>
                <Label>Phone Number</Label>
                <Input
                  name="phoneNo"
                  value={form.phoneNo}
                  onChange={handleChange}
                />
              </Field>

              {/* LOCATION */}
              <Field>
                <Label>Location</Label>
                <Input
                  name="location"
                  value={form.location}
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
              <Button type="submit">Update</Button>
            </ButtonBar>
          </form>
        </Card>
      </Page>
    </SuperAdminNavbar>
  );
};

export default EditAdmin;
