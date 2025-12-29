import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useNavigate, useParams } from 'react-router-dom';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import styled from 'styled-components';

/* =========================
   STYLES
========================= */
const Page = styled.div`
  max-width: 520px;
  margin: 0 auto;
  padding: 24px;
`;

const Title = styled.h2`
  font-weight: 700;
  margin-bottom: 20px;
`;

const Field = styled.div`
  margin-bottom: 14px;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
`;

const Input = styled.input`
  width: 100%;
  padding: 9px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  width: 100%;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #15803d;
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

/* =========================
   COMPONENT
========================= */
export default function EditAdmin() {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone_no: '',
    location: '',
  });

  /* =========================
     FETCH ADMIN DETAILS
  ========================= */
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get('/api/headadmin/admins');
        const admin = res.data.admins.find(
          (a) => a._id === adminId && a.role === 'admin'
        );

        if (!admin) {
          alert('Admin not found');
          navigate('/head-admin/admins');
          return;
        }

        setForm({
          username: admin.username,
          email: admin.email,
          password: '',
          phone_no: admin.phoneNo || '',
          location: admin.location || '',
        });
      } catch {
        alert('Failed to load admin');
      }
    };

    fetchAdmin();
  }, [adminId, navigate]);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* =========================
     UPDATE ADMIN
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        username: form.username,
        email: form.email,
        phone_no: form.phone_no,
        location: form.location,
      };

      if (form.password) {
        payload.password = form.password;
      }

      await axios.put(
        `/api/headadmin/admins/${adminId}`,
        payload
      );

      alert('Admin updated successfully');
      navigate('/head-admin/admins');
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to update admin'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeadAdminNavbar>
      <Page>
        <Title>Edit Admin</Title>

        <form onSubmit={handleSubmit}>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </Field>

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

          <Field>
            <Label>New Password (optional)</Label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </Field>

          <Field>
            <Label>Phone No</Label>
            <Input
              name="phone_no"
              value={form.phone_no}
              onChange={handleChange}
            />
          </Field>

          <Field>
            <Label>Location</Label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </Field>

          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update Admin'}
          </Button>
        </form>
      </Page>
    </HeadAdminNavbar>
  );
}
