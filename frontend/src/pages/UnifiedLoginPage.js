import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import styled, { keyframes } from 'styled-components';

/* =========================
   COLORS
========================= */
const colors = {
  primary: '#1E40AF',
  primaryLight: '#3B82F6',
  darkText: '#1F2937',
  lightText: '#9CA3AF',
  lightBg: '#F8FAFC',
  borderColor: '#E2E8F0',
  errorRed: '#DC2626',
};

/* =========================
   ANIMATIONS
========================= */
const fadeInLeft = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const fadeInRight = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

/* =========================
   STYLED COMPONENTS
========================= */
const AuthContainer = styled.div`
  display: flex;
  height: 100vh;
  background: #F0FDFB;
`;

const BrandingSection = styled.div`
  flex: 1;
  background: #CCFBF1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: ${fadeInLeft} 0.6s ease;
`;

const LoginSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeInRight} 0.6s ease;
`;

const LoginCard = styled.div`
  background: white;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  border-radius: 12px;
  border: 1px solid ${colors.borderColor};
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BrandName = styled.h1`
  font-size: 2.2rem;
  color: #0F766E;
`;

const Tagline = styled.p`
  color: #14B8A6;
  font-weight: 600;
`;

const Description = styled.p`
  max-width: 360px;
  text-align: center;
  color: #0F766E;
`;

const WelcomeHeading = styled.h2`
  text-align: center;
`;

const Subtitle = styled.p`
  text-align: center;
  color: ${colors.lightText};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.7rem;
  border-radius: 6px;
  border: 1px solid ${colors.borderColor};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
`;

const SubmitButton = styled.button`
  padding: 0.8rem;
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  background: #FEE2E2;
  color: ${colors.errorRed};
  padding: 0.7rem;
  border-radius: 6px;
  text-align: center;
`;

const Footer = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: ${colors.lightText};
  margin-top: 1rem;
`;

/* =========================
   COMPONENT
========================= */
const UnifiedLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* =========================
     AUTO REDIRECT IF LOGGED IN
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role === 'SUPERADMIN') {
      navigate('/super-admin', { replace: true });
    }

    if (token && role === 'HEADADMIN') {
      navigate('/head-admin', { replace: true });
    }
  }, [navigate]);

  /* =========================
     LOGIN HANDLER
  ========================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      let data;

      /* 🔹 TRY SUPERADMIN LOGIN */
      response = await fetch(
        'http://localhost:5000/api/superadmin/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      data = await response.json();

      /* 🔹 IF SUPERADMIN FAILS → TRY HEADADMIN */
      if (!response.ok) {
        response = await fetch(
          'http://localhost:5000/api/headadmin/auth/login',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          }
        );

        data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Invalid credentials');
          return;
        }
      }

      /* 🔹 EXTRACT ROLE SAFELY (CRITICAL FIX) */
      const role = data.role || data.user?.role;

      if (!role) {
        setError('Login failed: role missing');
        return;
      }

      /* 🔹 SAVE AUTH */
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', role);

      dispatch(loginSuccess({ token: data.token, role }));

      /* 🔹 REDIRECT BY ROLE */
      if (role === 'SUPERADMIN') {
        navigate('/super-admin', { replace: true });
      } else if (role === 'HEADADMIN') {
        navigate('/head-admin', { replace: true });
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <BrandingSection>
        <BrandName>Domestic RO Controller</BrandName>
        <Tagline>Pure Water, Pure Control</Tagline>
        <Description>
          Smart RO monitoring & management system.
        </Description>
      </BrandingSection>

      <LoginSection>
        <LoginCard>
          <LoginForm onSubmit={handleLogin}>
            <WelcomeHeading>Welcome</WelcomeHeading>
            <Subtitle>Sign in to continue</Subtitle>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <FormGroup>
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <InputWrapper>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁️
                </PasswordToggle>
              </InputWrapper>
            </FormGroup>

            <SubmitButton disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </SubmitButton>

            <Footer>© Domestic RO Controller</Footer>
          </LoginForm>
        </LoginCard>
      </LoginSection>
    </AuthContainer>
  );
};

export default UnifiedLoginPage;
