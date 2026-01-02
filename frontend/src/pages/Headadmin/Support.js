import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import HeadAdminNavbar from '../../components/Navbar/HeadAdminNavbar';
import {
  getSupport,
  createSupport,
  updateSupport,
  deleteSupport,
} from '../../services/headAdminService';

/* =========================
   LAYOUT
========================= */

const Page = styled.div`
  background: #f8fafc;
`;

const Container = styled.div`
  max-width: 640px;
  margin: 0 auto;
  padding: 16px 24px 40px;
`;

/* =========================
   CARD
========================= */

const Card = styled.div`
  background: white;
  padding: 28px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
`;

/* =========================
   UI
========================= */

const Title = styled.h3`
  margin-bottom: 24px;
  font-weight: 800;
  color: #0f172a;
`;

const Field = styled.div`
  margin-bottom: 18px;
`;

const Label = styled.div`
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #475569;
`;

const Value = styled.div`
  font-weight: 600;
  color: #0f172a;
`;

const Error = styled.div`
  font-size: 12px;
  color: #dc2626;
  margin-top: 4px;
`;

const Input = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  background: ${(p) => (p.danger ? '#dc2626' : '#2563eb')};
  color: white;
  font-weight: 600;
  font-size: 14px;
  opacity: ${(p) => (p.disabled ? 0.6 : 1)};

  &:disabled {
    cursor: not-allowed;
  }
`;

/* =========================
   COMPONENT
========================= */

const role = localStorage.getItem('role');

export default function HeadAdminSupport() {
  const [support, setSupport] = useState(null);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    email: '',
    phoneNo: '',
    address: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    phoneNo: '',
  });

  useEffect(() => {
    loadSupport();
  }, []);

  const loadSupport = async () => {
    const res = await getSupport();
    if (res.data) {
      setSupport(res.data);
      setForm(res.data);
    }
  };

  /* =========================
     VALIDATION
  ========================= */

  const validateEmail = (email) => email.includes('@');
  const validatePhone = (phone) => /^[0-9]*$/.test(phone);

  const handleChange = (field, value) => {
    if (field === 'phoneNo' && !validatePhone(value)) return;

    setForm({ ...form, [field]: value });

    if (field === 'email') {
      setErrors({
        ...errors,
        email: validateEmail(value) ? '' : 'Email must contain @',
      });
    }

    if (field === 'phoneNo') {
      setErrors({
        ...errors,
        phoneNo:
          value.length < 10 ? 'Phone must be at least 10 digits' : '',
      });
    }
  };

  const isFormValid =
    validateEmail(form.email) &&
    form.phoneNo.length >= 10 &&
    form.address.trim().length > 0;

  /* =========================
     ACTIONS
  ========================= */

  const handleSave = async () => {
    if (!isFormValid) return;

    if (support) {
      await updateSupport(form);
    } else {
      await createSupport(form);
    }

    setEditing(false);
    loadSupport();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete support details?')) return;
    await deleteSupport();
    setSupport(null);
    setForm({ email: '', phoneNo: '', address: '' });
  };

  return (
    <HeadAdminNavbar>
      <Page>
        <Container>
          <Card>
            <Title>Organization Support Details</Title>

            {editing || !support ? (
              <>
                <Field>
                  <Label>Email</Label>
                  <Input
                    value={form.email}
                    onChange={(e) =>
                      handleChange('email', e.target.value)
                    }
                  />
                  {errors.email && <Error>{errors.email}</Error>}
                </Field>

                <Field>
                  <Label>Phone</Label>
                  <Input
                    value={form.phoneNo}
                    onChange={(e) =>
                      handleChange('phoneNo', e.target.value)
                    }
                  />
                  {errors.phoneNo && (
                    <Error>{errors.phoneNo}</Error>
                  )}
                </Field>

                <Field>
                  <Label>Address</Label>
                  <Input
                    value={form.address}
                    onChange={(e) =>
                      handleChange('address', e.target.value)
                    }
                  />
                </Field>

                {role === 'headadmin' && (
                  <Actions>
                    <Button
                      onClick={handleSave}
                      disabled={!isFormValid}
                    >
                      Save
                    </Button>
                  </Actions>
                )}
              </>
            ) : (
              <>
                <Field>
                  <Label>Email</Label>
                  <Value>{support.email}</Value>
                </Field>

                <Field>
                  <Label>Phone</Label>
                  <Value>{support.phoneNo}</Value>
                </Field>

                <Field>
                  <Label>Address</Label>
                  <Value>{support.address}</Value>
                </Field>

                {role === 'headadmin' && (
                  <Actions>
                    <Button onClick={() => setEditing(true)}>
                      Edit
                    </Button>
                    <Button danger onClick={handleDelete}>
                      Delete
                    </Button>
                  </Actions>
                )}
              </>
            )}
          </Card>
        </Container>
      </Page>
    </HeadAdminNavbar>
  );
}
