import React, { useState } from 'react';
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
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
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }

  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
  }
`;

/* =========================
   COMPONENT
========================= */
export default function CreateAdmin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    phone_no: '',
    location: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      alert('Username, Email and Password are required');
      return;
    }

    try {
      setLoading(true);

      await axios.post('/api/headadmin/admins', {
        username: form.username,
        email: form.email,
        password: form.password,
        phone_no: form.phone_no,
        location: form.location,
      });

      alert('Admin created successfully');
      navigate('/head-admin/admins');
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to create admin'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeadAdminNavbar>
      <Page>
        <Title>Create Admin</Title>

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
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
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
            {loading ? 'Creating...' : 'Create Admin'}
          </Button>
        </form>
      </Page>
    </HeadAdminNavbar>
  );
}
