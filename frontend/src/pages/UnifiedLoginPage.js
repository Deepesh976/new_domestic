import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import './UnifiedLoginPage.css';

const UnifiedLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* Auto redirect if already logged in */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role === 'superadmin') {
      navigate('/super-admin', { replace: true });
    }

    if (token && role === 'headadmin') {
      navigate('/head-admin', { replace: true });
    }
  }, [navigate]);

  /* Login handler - tries SuperAdmin first, then HeadAdmin */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      /* Try SuperAdmin login */
      let response = await fetch(
        'http://localhost:5000/api/superadmin/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      let data = await response.json();

      if (response.ok && data.role === 'superadmin') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        dispatch(
          loginSuccess({
            token: data.token,
            role: data.role,
          })
        );

        navigate('/super-admin', { replace: true });
        return;
      }

      /* Try HeadAdmin login */
      response = await fetch(
        'http://localhost:5000/api/headadmin/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      data = await response.json();

      if (response.ok && data.role === 'headadmin') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('organization', data.organization);

        dispatch(
          loginSuccess({
            token: data.token,
            role: data.role,
            organization: data.organization,
          })
        );

        navigate('/head-admin', { replace: true });
        return;
      }

      /* Invalid credentials */
      setError('Invalid email or password');
    } catch (err) {
      console.error(err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-logo">D</div>
            <h1 className="login-title">Domesticro</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Form */}
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
              <span className="button-text">
                {loading && <span className="spinner"></span>}
                {loading ? 'Signing in...' : 'Sign In'}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="login-footer">
            © 2025 Domesticro. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLoginPage;
