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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    if (!token || !role) return;

    if (role === 'superadmin') {
      navigate('/superadmin', { replace: true });
    } else if (role === 'headadmin' || role === 'admin') {
      navigate('/headadmin', { replace: true });
    }
  }, [navigate]);

  /* =========================
     LOGIN HANDLER
  ========================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Clear old session
    localStorage.clear();

    try {
      /* =========================
         1️⃣ TRY SUPERADMIN LOGIN
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
         2️⃣ TRY HEADADMIN / ADMIN
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
     SAVE SESSION (HELPER)
  ========================= */
  const saveSession = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);

    if (data.organization) {
      localStorage.setItem('org_id', data.organization);
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
        org_id: data.organization || null,
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
            <p className="login-subtitle">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="error-message">{error}</div>
          )}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="Enter your email"
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
                placeholder="Enter your password"
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

          <div className="login-footer">
            © 2025 Domesticro. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLoginPage;
