import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import './UnifiedLoginPage.css';

/* =====================================================
   UNIFIED LOGIN PAGE
   Roles:
   - superadmin
   - headadmin
   - admin
===================================================== */

const UnifiedLoginPage = () => {
  /* =========================
     STATE
  ========================= */
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');

  const [showForgot, setShowForgot] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* =========================
     AUTO REDIRECT IF LOGGED IN
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || !role) return;

    if (role === 'superadmin') {
      navigate('/superadmin', { replace: true });
    } else {
      navigate('/headadmin', { replace: true });
    }
  }, [navigate]);

  /* =========================
     LOGIN HANDLER
  ========================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    localStorage.clear();

    try {
      /* =========================
         1️⃣ SUPER ADMIN LOGIN
      ========================= */
      const superAdminRes = await fetch(
        'http://localhost:5000/api/superadmin/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      const superAdminData = await superAdminRes.json();

      if (superAdminRes.ok && superAdminData.role === 'superadmin') {
        saveSession(superAdminData);
        navigate('/superadmin', { replace: true });
        return;
      }

      /* =========================
         2️⃣ HEADADMIN / ADMIN LOGIN
      ========================= */
      const orgUserRes = await fetch(
        'http://localhost:5000/api/headadmin/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      const orgUserData = await orgUserRes.json();

      if (
        orgUserRes.ok &&
        (orgUserData.role === 'headadmin' ||
          orgUserData.role === 'admin')
      ) {
        saveSession(orgUserData);
        navigate('/headadmin', { replace: true });
        return;
      }

      setError('Invalid email or password');
    } catch (err) {
      console.error('LOGIN ERROR:', err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FORGOT PASSWORD HANDLER
  ========================= */
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // 🔁 Try SuperAdmin first
      let res = await fetch(
        'http://localhost:5000/api/superadmin/auth/forgot-password',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: forgotEmail }),
        }
      );

      // 🔁 Fallback to HeadAdmin/Admin
      if (!res.ok) {
        res = await fetch(
          'http://localhost:5000/api/headadmin/auth/forgot-password',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: forgotEmail }),
          }
        );
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to send reset link');
      } else {
        setMessage(
          'If this email exists, a password reset link has been sent.'
        );
      }
    } catch (err) {
      console.error('FORGOT PASSWORD ERROR:', err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     SAVE SESSION
  ========================= */
  const saveSession = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);

    if (data.organization) {
      localStorage.setItem('org_id', data.organization.org_id);
      localStorage.setItem('org_name', data.organization.org_name);
      localStorage.setItem('org_logo', data.organization.logo || '');
    }

    localStorage.setItem('email', data.user?.email || '');
    localStorage.setItem(
      'username',
      data.user?.username ||
        (data.role === 'superadmin'
          ? 'Super Admin'
          : data.role === 'headadmin'
          ? 'Head Admin'
          : 'Admin')
    );

    dispatch(
      loginSuccess({
        token: data.token,
        role: data.role,
        org_id: data.organization?.org_id || null,
        org_name: data.organization?.org_name || null,
        org_logo: data.organization?.logo || null,
        email: data.user?.email || '',
        username:
          data.user?.username ||
          (data.role === 'superadmin'
            ? 'Super Admin'
            : data.role === 'headadmin'
            ? 'Head Admin'
            : 'Admin'),
      })
    );
  };

  /* =========================
     UI
  ========================= */
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">D</div>
            <h1 className="login-title">Domesticro</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          {!showForgot ? (
            <>
              <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  className="login-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Signing in…' : 'Sign In'}
                </button>
              </form>

              <div className="forgot-link">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot password?
                </button>
              </div>
            </>
          ) : (
            <>
              <form
                className="login-form"
                onSubmit={handleForgotPassword}
              >
                <div className="form-group">
                  <label className="form-label">
                    Enter your registered email
                  </label>
                  <input
                    className="form-input"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  className="login-button"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Sending…' : 'Send Reset Link'}
                </button>
              </form>

              <div className="forgot-link">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                >
                  Back to login
                </button>
              </div>
            </>
          )}

          <div className="login-footer">
            © 2025 Domesticro. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLoginPage;
